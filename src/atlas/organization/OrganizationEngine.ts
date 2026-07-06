import type {
  DepartmentAssignment,
  ExecutionPlanStep,
  OrganizationRoutingInput,
  OrganizationRoutingResult,
  WorkerAssignment,
} from "./organization.types";
import {
  getDepartment,
  getOrganizationalModel,
  ORGANIZATION_MODEL_ID,
} from "./OrganizationalModel";

const ORG_CAPABILITY_PATTERNS: Array<{ pattern: RegExp; capabilityId: string }> = [
  { pattern: /\binstagram|social media|tiktok|growth|marketing|brand|audience|followers|content strategy/i, capabilityId: "growth" },
  { pattern: /\bresearch|analyze|study|investigate|trends|competitive/i, capabilityId: "research" },
  { pattern: /\bknowledge|document|learn|wiki|curat/i, capabilityId: "knowledge-work" },
  { pattern: /\boperations|workflow|process|coordinate|monitor/i, capabilityId: "operations-work" },
  { pattern: /\bpersonal|assistant|schedule|calendar|remind/i, capabilityId: "personal-assist" },
  { pattern: /\bfinance|budget|cost|spending|revenue/i, capabilityId: "finance-work" },
  { pattern: /\bquality|audit|review|validate|qa\b/i, capabilityId: "quality-work" },
  { pattern: /\bbuild|code|software|engineer|typescript|module|platform|mission|atlas core/i, capabilityId: "software-delivery" },
  { pattern: /\bplanning\b|\bplanner\b|\bplan\b/i, capabilityId: "software-delivery" },
  { pattern: /\breason(ing|en)?\b|\bdecision(s| engine)?\b/i, capabilityId: "software-delivery" },
  { pattern: /\bmemory\b|\bcontext\b|\borchestrat/i, capabilityId: "software-delivery" },
];

const SUPPORTING_DEPARTMENTS: Record<string, string[]> = {
  growth: ["research", "quality-assurance"],
  research: ["knowledge"],
  "software-delivery": ["quality-assurance", "operations"],
  "operations-work": ["quality-assurance"],
  "knowledge-work": ["research"],
};

function matchOrganizationalCapabilities(intent: string): string[] {
  return [
    ...new Set(
      ORG_CAPABILITY_PATTERNS.filter((entry) => entry.pattern.test(intent)).map(
        (entry) => entry.capabilityId,
      ),
    ),
  ];
}

function assignDepartments(capabilityIds: string[]): DepartmentAssignment[] {
  const model = getOrganizationalModel();
  const assignments: DepartmentAssignment[] = [];
  const seen = new Set<string>();

  for (const capabilityId of capabilityIds) {
    const capability = model.organizationalCapabilities.find((item) => item.id === capabilityId);
    if (!capability || seen.has(capability.primaryDepartmentId)) continue;

    const department = getDepartment(capability.primaryDepartmentId);
    if (!department) continue;

    seen.add(capability.primaryDepartmentId);
    assignments.push({
      departmentId: department.id,
      departmentName: department.name,
      role: "primary",
      rationale: `${capability.name} intent routes to ${department.name} department.`,
    });

    for (const supportId of SUPPORTING_DEPARTMENTS[capabilityId] ?? []) {
      if (seen.has(supportId)) continue;
      const supportDept = getDepartment(supportId);
      if (!supportDept) continue;

      seen.add(supportId);
      assignments.push({
        departmentId: supportDept.id,
        departmentName: supportDept.name,
        role: "supporting",
        rationale: `${supportDept.name} supports ${department.name} on this intent.`,
      });
    }
  }

  if (assignments.length === 0) {
    const operations = getDepartment("operations");
    if (operations) {
      assignments.push({
        departmentId: operations.id,
        departmentName: operations.name,
        role: "primary",
        rationale: "General intent routed to Operations for coordination.",
      });
    }
  }

  return assignments;
}

function assignWorkers(
  intent: string,
  departments: DepartmentAssignment[],
): WorkerAssignment[] {
  const assignments: WorkerAssignment[] = [];

  for (const dept of departments) {
    const department = getDepartment(dept.departmentId);
    if (!department) continue;

    const workersToAssign = dept.role === "primary" ? department.workers.slice(0, 2) : department.workers.slice(0, 1);

    for (const worker of workersToAssign) {
      assignments.push({
        workerId: worker.id,
        workerName: worker.name,
        departmentId: worker.departmentId,
        role: worker.role,
        task: buildWorkerTask(intent, dept.departmentId, worker.id),
      });
    }
  }

  return assignments;
}

function buildWorkerTask(intent: string, departmentId: string, workerId: string): string {
  const tasks: Record<string, Record<string, string>> = {
    marketing: {
      "growth-strategist": "Design growth strategy aligned with founder intent",
      "content-planner": "Create content calendar and campaign plan",
      "social-manager": "Execute platform-specific growth tactics (Instagram, etc.)",
    },
    research: {
      "trend-analyst": "Analyze trends relevant to the intent",
      "data-researcher": "Gather supporting data and benchmarks",
    },
    engineering: {
      "claude-engineer": "Implement software deliverables via Engineering Package",
      "platform-architect": "Ensure platform architecture alignment",
    },
    "quality-assurance": {
      "qa-reviewer": "Review deliverable quality before reporting to Branch Director",
      "audit-specialist": "Run Atlas Auditor validation when software is involved",
    },
  };

  return tasks[departmentId]?.[workerId] ?? `Execute ${departmentId} work for: ${intent.slice(0, 80)}`;
}

function buildExecutionPlan(workers: WorkerAssignment[]): ExecutionPlanStep[] {
  return workers.map((worker, index) => ({
    order: index + 1,
    departmentId: worker.departmentId,
    workerId: worker.workerId,
    action: worker.task,
    deliverable: `${worker.workerName} output for review by Atlas (Branch Director)`,
  }));
}

function requiresEngineeringPackage(intent: string, capabilityIds: string[]): boolean {
  if (capabilityIds.includes("software-delivery")) return true;
  if (/\bbuild|code|software|implement|module|typescript|engineer|mission|package/i.test(intent)) return true;
  if (/\batlas\b.*\b(better|improve|fix|add)\b/i.test(intent) && !/\binstagram|social|marketing|growth/i.test(intent)) {
    return true;
  }
  return false;
}

function buildBranchDirectorRationale(input: {
  intent: string;
  capabilities: string[];
  departments: DepartmentAssignment[];
  engineeringRequired: boolean;
}): string {
  const model = getOrganizationalModel();
  const primaryDept = input.departments.find((item) => item.role === "primary");

  if (!input.engineeringRequired && primaryDept) {
    return [
      `Atlas (Branch Director) received intent from Robbert (CEO).`,
      `This is operational work — not a code generation request.`,
      `Primary department: ${primaryDept.departmentName}.`,
      `ChatGPT (Chief Architect) provides strategic direction only; Atlas assigns AI Workers.`,
      `No Engineering Package required unless software deliverables emerge.`,
    ].join(" ");
  }

  return [
    `Atlas (Branch Director) routes software work to Engineering department.`,
    `Engineering Package will be generated for Claude Engineer execution.`,
    `ChatGPT defines architecture; Atlas operationalizes execution.`,
  ].join(" ");
}

export function routeOrganization(input: OrganizationRoutingInput): OrganizationRoutingResult {
  const model = getOrganizationalModel();
  const intent = input.intent.trim();
  const organizationalCapabilities = matchOrganizationalCapabilities(intent);
  const departmentAssignments = assignDepartments(organizationalCapabilities);
  const workerAssignments = assignWorkers(intent, departmentAssignments);
  const executionPlan = buildExecutionPlan(workerAssignments);
  const engineeringPackageRequired = requiresEngineeringPackage(intent, organizationalCapabilities);

  return {
    modelId: ORGANIZATION_MODEL_ID,
    intent,
    organizationalCapabilities,
    departmentAssignments,
    workerAssignments,
    executionPlan,
    engineeringPackageRequired,
    engineeringMissionId: engineeringPackageRequired ? null : null,
    branchDirectorRationale: buildBranchDirectorRationale({
      intent,
      capabilities: organizationalCapabilities,
      departments: departmentAssignments,
      engineeringRequired: engineeringPackageRequired,
    }),
    evaluatedAt: new Date().toISOString(),
  };
}

export function getOrganizationLeaders() {
  return {
    founder: { role: "Founder / CEO", name: "Robbert" },
    chiefArchitect: { role: "Chief Architect", name: "ChatGPT" },
    branchDirector: { role: "Branch Director", name: "Atlas" },
  };
}

export function renderOrganizationMarkdown(): string {
  const model = getOrganizationalModel();
  const leaders = getOrganizationLeaders();

  const deptList = model.departments
    .map(
      (dept) =>
        `- **${dept.name}** (${dept.id})\n  - ${dept.responsibilities.join("; ")}\n  - Workers: ${dept.workers.map((w) => w.name).join(", ")}`,
    )
    .join("\n");

  return [
    `# ${model.title}`,
    "",
    `> **${model.id}** · Organizational Model v${model.version}`,
    "",
    "## Organization Hierarchy",
    "",
    "```",
    model.hierarchy.join("\n↓\n"),
    "```",
    "",
    "## Leadership",
    "",
    `- **${leaders.founder.role}** · ${leaders.founder.name}`,
    `- **${leaders.chiefArchitect.role}** · ${leaders.chiefArchitect.name} — architecture and strategic direction only`,
    `- **${leaders.branchDirector.role}** · ${leaders.branchDirector.name} — ${model.atlasRole}`,
    "",
    "## Atlas Responsibilities",
    "",
    ...model.atlasResponsibilities.map((item) => `- ${item}`),
    "",
    "## Communication Rules",
    "",
    ...model.communicationRules.map((item) => `- ${item}`),
    "",
    "## AI Departments",
    "",
    deptList,
    "",
    "## Routing Hierarchy",
    "",
    "```",
    "Intent\n↓\nCapability\n↓\nDepartment(s)\n↓\nWorker Assignment\n↓\nExecution Plan\n↓\nEngineering Package (if software work required)",
    "```",
    "",
  ].join("\n");
}
