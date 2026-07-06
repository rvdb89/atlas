import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { runDecision } from "@/atlas/brain/decision";
import {
  auditorEngine,
  bootstrapAtlasAuditor,
  createAuditReportPath,
} from "@/atlas/auditor";
import { deriveReleaseDecision } from "@/atlas/auditor/ReleaseDecision";
import {
  ENGINEERING_PACKAGE_FILENAMES,
  missionRegistry,
  orchestrateMission,
  registerMissionFromSource,
  serializePackageManifest,
  setLastEngineeringPackage,
  type EngineeringPackage,
} from "@/atlas/engineering/mission-orchestrator";
import { createInitialWorkflowSteps } from "@/atlas/studio/ceo-workflow/ceoWorkflow.constants";
import {
  attachDebriefToWorkflow,
  buildContinueIntent,
  CEO_ADJUST_OPTIONS,
} from "@/atlas/studio/ceo-workflow/BranchDirectorDebrief";
import type {
  CeoAdjustOptionId,
  CeoWorkflowAuditSummary,
  CeoWorkflowState,
  CeoWorkflowStep,
  CeoWorkflowStepStatus,
} from "@/atlas/studio/ceo-workflow/ceoWorkflow.types";

import { collectAuditContext, ROOT_DIR, writeAuditReportFile } from "../audit-context";
import { readAtlasVersion, runCommand } from "../shared";
import {
  buildSuggestedCommitMessage,
  commitRelease,
  getGitReleaseStatus,
  pushRelease,
  stageSafeChanges,
  verifyRemoteSync,
  hasUnpushedCommits,
} from "./gitReleaseService";
import { CEO_PUBLISH_ERRORS } from "./publishErrors";

let activeWorkflow: CeoWorkflowState | null = null;

function loadMissionFilesFromDisk(): void {
  const missionsDir = join(ROOT_DIR, "engineering/missions");
  if (!existsSync(missionsDir)) return;

  for (const filename of readdirSync(missionsDir)) {
    if (!filename.endsWith(".mission")) continue;
    const missionId = filename.replace(/\.mission$/, "").toUpperCase();
    registerMissionFromSource(missionId, `engineering/missions/${filename}`, readFileSync(join(missionsDir, filename), "utf8"));
  }
}

function removeStalePackageFiles(packageRoot: string): void {
  if (!existsSync(packageRoot)) return;
  const allowed = new Set<string>(ENGINEERING_PACKAGE_FILENAMES);
  for (const filename of readdirSync(packageRoot)) {
    if (allowed.has(filename)) continue;
    unlinkSync(join(packageRoot, filename));
  }
}

function writePackageArtifacts(pkg: EngineeringPackage): void {
  const packageRoot = join(ROOT_DIR, pkg.outputDir);
  mkdirSync(packageRoot, { recursive: true });
  removeStalePackageFiles(packageRoot);

  for (const artifact of pkg.artifacts) {
    writeFileSync(join(ROOT_DIR, artifact.relativePath), artifact.markdown, "utf8");
  }

  writeFileSync(join(packageRoot, "manifest.json"), serializePackageManifest(pkg.manifest), "utf8");

  const briefPath = join(ROOT_DIR, pkg.legacyBriefPath);
  mkdirSync(join(briefPath, ".."), { recursive: true });
  writeFileSync(briefPath, pkg.brief.markdown, "utf8");

  writeFileSync(
    join(ROOT_DIR, "engineering/packages/latest-package.json"),
    JSON.stringify(
      {
        missionId: pkg.missionId,
        title: pkg.title,
        outputDir: pkg.outputDir,
        entrypoint: pkg.claudePackagePath,
        decisionEngineId: pkg.manifest.decisionEngineId,
        generatedAt: pkg.generatedAt,
      },
      null,
      2,
    ),
    "utf8",
  );
}

function updateStep(
  steps: CeoWorkflowStep[],
  id: CeoWorkflowStep["id"],
  patch: Partial<CeoWorkflowStep>,
): CeoWorkflowStep[] {
  return steps.map((step) => (step.id === id ? { ...step, ...patch } : step));
}

function setStepStatus(
  steps: CeoWorkflowStep[],
  id: CeoWorkflowStep["id"],
  status: CeoWorkflowStepStatus,
  summary: string,
  details: string[] = [],
  error?: string,
): CeoWorkflowStep[] {
  return updateStep(steps, id, { status, summary, details, error });
}

function buildAuditSummary(
  blockers: Array<{ title: string; reason: string }>,
  warnings: Array<{ title: string; reason: string }>,
  recommendation: string,
  score: number,
): CeoWorkflowAuditSummary {
  return {
    recommendation,
    score,
    blockerCount: blockers.length,
    warningCount: warnings.length,
    blockers: blockers.map((item) => ({ title: item.title, reason: item.reason })),
    warnings: warnings.map((item) => ({ title: item.title, reason: item.reason })),
  };
}

function resolveNextInitiativeTitle(missionId: string): string | null {
  const entry = missionRegistry.get(missionId);
  return entry?.card.title ?? null;
}

function createWorkflow(intent: string): CeoWorkflowState {
  return {
    id: `ceo-${Date.now()}`,
    intent,
    status: "running",
    steps: createInitialWorkflowSteps(),
    updatedAt: new Date().toISOString(),
  };
}

function persistWorkflow(state: CeoWorkflowState): CeoWorkflowState {
  activeWorkflow = { ...state, updatedAt: new Date().toISOString() };
  return activeWorkflow;
}

export function getCeoWorkflowState(): CeoWorkflowState | null {
  return activeWorkflow;
}

export async function runCeoWorkflowPipeline(intent: string): Promise<CeoWorkflowState> {
  loadMissionFilesFromDisk();

  let workflow = createWorkflow(intent.trim());
  const { version, build } = readAtlasVersion();

  let steps = setStepStatus(workflow.steps, "intent", "completed", "Intent captured", [workflow.intent]);
  steps = setStepStatus(steps, "branch-director-decision", "running", "Branch Director is deciding…");
  workflow = persistWorkflow({ ...workflow, steps });

  const decision = runDecision({
    intent: workflow.intent,
    missionRegistered: (id) => missionRegistry.has(id),
  });

  steps = setStepStatus(steps, "branch-director-decision", "completed", decision.recommendedInitiativeId ?? "Operational routing", [
    decision.why,
    ...(decision.recommendedInitiativeId
      ? [`${decision.recommendedInitiativeTitle ?? decision.recommendedInitiativeId} · priority ${decision.priorityScore.toFixed(2)}`]
      : decision.departmentAssignments.map((item) => `${item.departmentName} (${item.role})`)),
  ]);

  workflow = persistWorkflow({
    ...workflow,
    decision: {
      recommendedInitiativeId: decision.recommendedInitiativeId,
      recommendedInitiativeTitle: decision.recommendedInitiativeTitle,
      nextBestInitiativeId: decision.nextBestInitiativeId,
      nextBestInitiativeTitle: decision.nextBestInitiativeId
        ? resolveNextInitiativeTitle(decision.nextBestInitiativeId)
        : null,
      priorityScore: decision.priorityScore,
      northStarAligned: decision.northStarAligned,
      northStarScore: decision.northStarScore,
      why: decision.why,
      branchDirectorAdvice: decision.branchDirectorAdvice,
      executionPackageRequired: decision.executionPackageRequired,
      departmentAssignments: decision.departmentAssignments.map((item) => ({
        departmentName: item.departmentName,
        role: item.role,
      })),
    },
    steps,
  });

  steps = setStepStatus(steps, "execution", "running", "Preparing execution…");

  if (decision.executionPackageRequired && decision.executionPackageTrigger && decision.executionPackageMissionId) {
    const result = orchestrateMission(decision.executionPackageMissionId, { atlasVersion: version, atlasBuild: build });
    if (!result.ok) {
      steps = setStepStatus(steps, "execution", "failed", "Execution package failed", [], result.message);
      return persistWorkflow({ ...workflow, status: "failed", steps, error: result.message });
    }

    writePackageArtifacts(result.package);
    setLastEngineeringPackage(result.package);
    steps = setStepStatus(steps, "execution", "completed", "Execution Package generated", [
      result.package.claudePackagePath,
      `${result.package.missionId} · ${result.package.title}`,
    ]);
  } else if (decision.executionPackageRequired) {
    steps = setStepStatus(steps, "execution", "failed", "Execution blocked", [], "Mission not registered or alignment incomplete.");
    return persistWorkflow({
      ...workflow,
      status: "failed",
      steps,
      error: "Execution package could not be generated.",
    });
  } else {
    steps = setStepStatus(steps, "execution", "completed", "Operational execution routed", [
      "Atlas coordinates AI Workers — no code generation required.",
    ]);
  }

  steps = setStepStatus(steps, "branch-director-review", "running", "Running Branch Director Review…");
  workflow = persistWorkflow({ ...workflow, steps });

  bootstrapAtlasAuditor();
  const auditContext = collectAuditContext({ strict: true });
  const reportPath = createAuditReportPath(ROOT_DIR);
  const relativeReportPath = reportPath.replace(`${ROOT_DIR}/`, "");
  const auditResult = auditorEngine.runAudit(auditContext, { reportPath: relativeReportPath, strict: true });
  const markdown = auditorEngine.renderReport(auditResult.report);
  writeAuditReportFile(reportPath, markdown, auditResult.report);

  const blockers = auditResult.report.blockers;
  const warnings = auditResult.report.warnings;

  const auditSummary = buildAuditSummary(
    blockers,
    warnings,
    auditResult.report.recommendation,
    auditResult.report.qualityScores.overall,
  );

  steps = setStepStatus(steps, "branch-director-review", "completed", auditResult.report.recommendation, [
    `Score: ${auditResult.report.qualityScores.overall}`,
    `${warnings.length} warning(s) · ${blockers.length} blocker(s)`,
    relativeReportPath,
  ]);

  steps = setStepStatus(steps, "release-decision", "running", "Evaluating release readiness…");

  const releaseDecision = deriveReleaseDecision({
    blockers,
    warnings,
    typescriptOk: auditContext.build.typescriptOk,
    healthOk: auditContext.build.healthOk,
  });

  steps = setStepStatus(steps, "release-decision", releaseDecision.pushAllowed ? "completed" : "failed", releaseDecision.status, [
    releaseDecision.reason,
    ...releaseDecision.reasons.slice(0, 3),
  ]);

  const gitStatus = getGitReleaseStatus();
  const atlasChanged = gitStatus.changedFiles.filter((file) => file.startsWith("src/atlas/"));

  const impact = {
    branch: gitStatus.branch,
    changedFiles: gitStatus.changedFiles,
    atlasChangedFiles: atlasChanged,
    suggestedCommitMessage: buildSuggestedCommitMessage({
      missionId: decision.recommendedInitiativeId,
      missionTitle: decision.recommendedInitiativeTitle,
      version,
      build,
    }),
    version,
    build,
    missionId: decision.recommendedInitiativeId,
    fileCount: gitStatus.changedFiles.length,
  };

  if (!releaseDecision.pushAllowed) {
    steps = setStepStatus(steps, "ceo-approval", "failed", "Release blocked", releaseDecision.nextActions);
    return persistWorkflow({
      ...workflow,
      status: "blocked",
      steps,
      releaseDecision,
      auditSummary,
      auditReportPath: relativeReportPath,
      impact,
      error: releaseDecision.reason,
    });
  }

  steps = setStepStatus(steps, "ceo-approval", "awaiting", "Wacht op CEO-goedkeuring", [
    "Atlas heeft alles voorbereid. Jij keurt de release goed wanneer je klaar bent.",
  ]);
  steps = setStepStatus(steps, "publish", "pending", "Wacht op goedkeuring");
  steps = setStepStatus(steps, "confirmation", "pending", "Wacht op afronding");
  steps = setStepStatus(steps, "branch-director-debrief", "pending", "Wacht op afronding");
  steps = setStepStatus(steps, "ceo-continue-decision", "pending", "Wacht op debrief");

  return persistWorkflow({
    ...workflow,
    status: "awaiting_ceo_approval",
    steps,
    releaseDecision,
    auditSummary,
    auditReportPath: relativeReportPath,
    impact,
  });
}

function failPublish(
  workflow: CeoWorkflowState,
  steps: CeoWorkflowStep[],
  ceoMessage: string,
  publishSummary = "Publiceren mislukt",
): CeoWorkflowState {
  const halted = setStepStatus(steps, "publish", "failed", publishSummary, [], ceoMessage);
  const confirmationHalted = setStepStatus(halted, "confirmation", "failed", "Geannuleerd", [
    "Atlas is gestopt — er is niets gepubliceerd.",
  ]);

  return persistWorkflow({
    ...workflow,
    status: "failed",
    steps: confirmationHalted,
    error: ceoMessage,
  });
}

function finalizePublication(
  workflow: CeoWorkflowState,
  steps: CeoWorkflowStep[],
  confirmation: CeoWorkflowState["confirmation"],
): CeoWorkflowState {
  steps = setStepStatus(steps, "branch-director-debrief", "running", "Atlas bereidt debrief voor…");
  steps = setStepStatus(steps, "branch-director-debrief", "completed", "Debrief klaar", [
    "Branch Director rapporteert aan CEO.",
  ]);
  steps = setStepStatus(steps, "ceo-continue-decision", "awaiting", "Wacht op CEO-beslissing", [
    "Gaan we door?",
  ]);

  return attachDebriefToWorkflow(
    persistWorkflow({
      ...workflow,
      steps,
      confirmation,
      error: undefined,
    }),
  );
}

export async function approveCeoWorkflowRelease(commitMessage?: string): Promise<CeoWorkflowState> {
  if (!activeWorkflow) {
    throw new Error("No active CEO workflow. Run a workflow first.");
  }

  if (activeWorkflow.status !== "awaiting_ceo_approval") {
    throw new Error(`Workflow is not awaiting approval (status: ${activeWorkflow.status}).`);
  }

  if (!activeWorkflow.releaseDecision?.pushAllowed) {
    throw new Error("Release is blocked — Branch Director Review did not approve push.");
  }

  let steps = setStepStatus(activeWorkflow.steps, "ceo-approval", "completed", "CEO approved release", [
    "Explicit CEO approval received via Atlas Studio.",
  ]);
  steps = setStepStatus(steps, "publish", "running", "Publishing release…");

  let workflow = persistWorkflow({ ...activeWorkflow, status: "publishing", steps });

  const message =
    commitMessage?.trim() ||
    workflow.impact?.suggestedCommitMessage ||
    buildSuggestedCommitMessage({
      missionId: workflow.decision?.recommendedInitiativeId ?? null,
      missionTitle: workflow.decision?.recommendedInitiativeTitle ?? null,
      version: workflow.impact?.version ?? readAtlasVersion().version,
      build: workflow.impact?.build ?? readAtlasVersion().build,
    });

  const staged = stageSafeChanges();
  if (!staged.ok) {
    const ceoMessage = staged.ceoMessage ?? CEO_PUBLISH_ERRORS.stageFailed;
    return failPublish(workflow, steps, ceoMessage, "Voorbereiden mislukt");
  }

  if (staged.staged.length > 0) {
    const committed = commitRelease(message);
    if (!committed.ok) {
      const ceoMessage = committed.ceoMessage ?? CEO_PUBLISH_ERRORS.commitFailed;
      return failPublish(workflow, steps, ceoMessage, "Vastleggen mislukt");
    }
  } else if (!hasUnpushedCommits()) {
    steps = setStepStatus(steps, "publish", "completed", "Release is actueel", [
      "Geen nieuwe wijzigingen om te publiceren.",
    ]);
    steps = setStepStatus(steps, "confirmation", "completed", "Publicatie bevestigd", [
      workflow.auditReportPath ?? "Review rapport beschikbaar",
    ]);
    return finalizePublication(workflow, steps, {
      publishedAt: new Date().toISOString(),
      commitSha: null,
      remoteVerified: true,
      reportPath: workflow.auditReportPath ?? "",
      pushOutput: "Geen wijzigingen vereist.",
    });
  }

  const pushed = pushRelease();
  if (!pushed.ok) {
    const ceoMessage = pushed.ceoMessage ?? CEO_PUBLISH_ERRORS.pushFailed;
    return failPublish(workflow, steps, ceoMessage, "Vrijgeven mislukt");
  }

  steps = setStepStatus(steps, "publish", "completed", "Release gepubliceerd", ["Atlas heeft de release afgerond."]);
  steps = setStepStatus(steps, "confirmation", "running", "Atlas verifieert publicatie…");

  const verification = verifyRemoteSync();
  const gitHead = getGitReleaseStatus().available
    ? (() => {
        try {
          return runCommand("git", ["rev-parse", "--short", "HEAD"]);
        } catch {
          return null;
        }
      })()
    : null;

  steps = setStepStatus(steps, "confirmation", verification.ok ? "completed" : "failed", verification.detail, [
    workflow.auditReportPath ?? "Review rapport beschikbaar",
    `Atlas ${workflow.impact?.version ?? ""} (${workflow.impact?.build ?? ""})`,
  ]);

  const confirmation = {
    publishedAt: new Date().toISOString(),
    commitSha: gitHead,
    remoteVerified: verification.ok,
    reportPath: workflow.auditReportPath ?? "",
    pushOutput: pushed.output,
  };

  if (!verification.ok) {
    return failPublish(workflow, steps, CEO_PUBLISH_ERRORS.verificationFailed, "Bevestiging mislukt");
  }

  return finalizePublication(workflow, steps, confirmation);
}

export async function continueAfterDebrief(): Promise<CeoWorkflowState> {
  if (!activeWorkflow) {
    throw new Error("No active CEO workflow.");
  }

  if (activeWorkflow.status !== "awaiting_ceo_debrief") {
    throw new Error(`Workflow is not awaiting debrief decision (status: ${activeWorkflow.status}).`);
  }

  const debrief = activeWorkflow.debrief;
  if (!debrief) {
    throw new Error("Debrief is missing from workflow state.");
  }

  let steps = setStepStatus(activeWorkflow.steps, "ceo-continue-decision", "completed", "CEO koos: doorgaan", [
    "Ja, ga door",
  ]);

  persistWorkflow({
    ...activeWorkflow,
    status: "continuing",
    steps,
    debrief: { ...debrief, ceoDecision: "continue" },
  });

  const continueIntent = buildContinueIntent(debrief);
  return runCeoWorkflowPipeline(continueIntent);
}

export async function adjustAfterDebrief(
  option: CeoAdjustOptionId,
  feedback?: string,
): Promise<CeoWorkflowState> {
  if (!activeWorkflow) {
    throw new Error("No active CEO workflow.");
  }

  if (activeWorkflow.status !== "awaiting_ceo_debrief") {
    throw new Error(`Workflow is not awaiting debrief decision (status: ${activeWorkflow.status}).`);
  }

  const debrief = activeWorkflow.debrief;
  if (!debrief) {
    throw new Error("Debrief is missing from workflow state.");
  }

  const selected = CEO_ADJUST_OPTIONS.find((item) => item.id === option);
  if (!selected) {
    throw new Error(`Unknown adjust option: ${option}`);
  }

  let steps = setStepStatus(activeWorkflow.steps, "ceo-continue-decision", "completed", "CEO koos: aanpassen", [
    selected.label,
    feedback?.trim() ? feedback.trim() : "Geen extra toelichting.",
  ]);

  const adjustmentSummary =
    option === "pause-execution"
      ? "Atlas pauzeert execution. Geef nieuwe intent wanneer je verder wilt."
      : `Atlas stopt execution en stelt voor: ${selected.description}`;

  steps = setStepStatus(steps, "branch-director-debrief", "completed", "Aanpassing vastgelegd", [
    adjustmentSummary,
  ]);

  return persistWorkflow({
    ...activeWorkflow,
    status: "paused",
    steps,
    debrief: {
      ...debrief,
      ceoDecision: "adjust",
      selectedAdjustOption: option,
      adjustFeedback: feedback?.trim(),
    },
    adjustOptions: CEO_ADJUST_OPTIONS,
    error: undefined,
  });
}
