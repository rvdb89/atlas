export type OrganizationLeader = {
  role: string;
  name: string;
  responsibilities: string[];
  authority: string[];
};

export type AiWorker = {
  id: string;
  name: string;
  departmentId: string;
  role: string;
};

export type AiDepartment = {
  id: string;
  name: string;
  responsibilities: string[];
  workers: AiWorker[];
};

export type OrganizationalCapability = {
  id: string;
  name: string;
  description: string;
  primaryDepartmentId: string;
};

export type OrganizationalModelDefinition = {
  id: string;
  title: string;
  version: string;
  hierarchy: string[];
  atlasRole: string;
  atlasResponsibilities: string[];
  communicationRules: string[];
  departments: AiDepartment[];
  organizationalCapabilities: OrganizationalCapability[];
};

export type DepartmentAssignment = {
  departmentId: string;
  departmentName: string;
  role: "primary" | "supporting";
  rationale: string;
};

export type WorkerAssignment = {
  workerId: string;
  workerName: string;
  departmentId: string;
  role: string;
  task: string;
};

export type ExecutionPlanStep = {
  order: number;
  departmentId: string;
  workerId: string;
  action: string;
  deliverable: string;
};

export type OrganizationRoutingInput = {
  intent: string;
};

export type OrganizationRoutingResult = {
  modelId: string;
  intent: string;
  organizationalCapabilities: string[];
  departmentAssignments: DepartmentAssignment[];
  workerAssignments: WorkerAssignment[];
  executionPlan: ExecutionPlanStep[];
  engineeringPackageRequired: boolean;
  engineeringMissionId: string | null;
  branchDirectorRationale: string;
  evaluatedAt: string;
};
