import type { GeneratedBrief } from "../brief-generator/BriefGenerator";
import type { InferredMissionContext } from "./MissionKnowledge";
import { renderBulletList, renderChecklist, renderDependencies, renderPipelineDiagram } from "./MissionKnowledge";

export function generateArchitectureBriefDocument(input: {
  context: InferredMissionContext;
  brief: GeneratedBrief;
  atlasVersion: string;
  atlasBuild: string;
}): string {
  const { context, brief, atlasVersion, atlasBuild } = input;

  return [
    `# Architecture Brief — ${context.missionId}`,
    "",
    "> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.",
    "",
    "### Decision Framework",
    "",
    `- Constitution · **${context.constitutionId}**`,
    `- Evolution Engine · **${context.decisionTrace.evolution?.engineId ?? context.decisionTrace.frameworkId}**`,
    `- North Star score · ${context.northStarEvaluation.score}/10`,
    `- Selection rationale · ${context.decisionTrace.selectionRationale}`,
    "",
    "## Atlas Inference Pipeline",
    "",
    "```",
    renderPipelineDiagram(),
    "```",
    "",
    "## Mission Metadata",
    "",
    `- Mission ID · **${context.missionId}**`,
    `- Title · **${context.card.title}**`,
    `- Registry source · ${context.registryEntry.sourcePath}`,
    `- Template · ${brief.templateLabel}`,
    `- Atlas · ${atlasVersion} (${atlasBuild})`,
    `- Generated · ${brief.generatedAt}`,
    "",
    "## Engineering Standards",
    "",
    renderBulletList(context.engineeringStandards),
    "",
    "## North Star",
    "",
    renderBulletList(context.northStarGoals),
    "",
    "## Architecture Rules",
    "",
    renderBulletList(context.architectureRules),
    "",
    "## Mission Dependencies",
    "",
    renderDependencies(context.dependencies),
    "",
    "## Definition of Done",
    "",
    renderChecklist(context.definitionOfDone),
    "",
    "---",
    "",
    "## Detailed Architecture Brief",
    "",
    brief.markdown.replace(/^# Architecture Brief — .+\n\n/, ""),
  ].join("\n");
}
