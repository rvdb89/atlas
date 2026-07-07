export type ControlStatus = "healthy" | "attention" | "critical" | "idle" | "active" | "pending";

export type ControlExecutiveOverview = {
  companyHealthScore: number;
  companyHealthLabel: string;
  activeAgents: number;
  activeBusinesses: number;
  openBlockers: number;
  pendingApprovals: number;
  activeInitiatives: number;
  platformStatus: ControlStatus;
  platformStatusLabel: string;
  recommendedNextAction: string;
};

export type ControlAgent = {
  id: string;
  name: string;
  role: string;
  status: ControlStatus;
  statusLabel: string;
  currentFocus: string;
};

export type ControlPlatformHealth = {
  overall: ControlStatus;
  overallLabel: string;
  atlasCore: ControlStatus;
  studio: ControlStatus;
  intelligence: ControlStatus;
  workflows: ControlStatus;
  detail: string;
};

export type ControlBusiness = {
  id: string;
  name: string;
  type: string;
  status: ControlStatus;
  statusLabel: string;
  summary: string;
};

export type ControlBlocker = {
  id: string;
  title: string;
  severity: "low" | "medium" | "high";
  area: string;
  owner: string;
};

export type ControlApproval = {
  id: string;
  title: string;
  type: "release" | "initiative" | "budget" | "strategy";
  requestedBy: string;
  urgency: "normal" | "high";
};

export type ControlInitiative = {
  id: string;
  title: string;
  phase: string;
  progress: number;
  status: ControlStatus;
};

export type ControlBranchDirectorAdvice = {
  headline: string;
  summary: string;
  recommendedInitiative: string;
  confidence: number;
  rationale: string[];
};

export type ControlSnapshot = {
  collectedAt: string;
  overview: ControlExecutiveOverview;
  agents: ControlAgent[];
  platformHealth: ControlPlatformHealth;
  businesses: ControlBusiness[];
  blockers: ControlBlocker[];
  approvals: ControlApproval[];
  initiatives: ControlInitiative[];
  branchDirectorAdvice: ControlBranchDirectorAdvice;
};

export type ControlDataSource = "mock" | "live";

export type ControlLoadResult = {
  source: ControlDataSource;
  snapshot: ControlSnapshot;
};
