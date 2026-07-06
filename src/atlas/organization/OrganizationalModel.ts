import type { OrganizationalModelDefinition } from "./organization.types";

export const ORGANIZATION_MODEL_ID = "ATLAS-002";

export const ORGANIZATION_HIERARCHY = [
  "Founder / CEO · Robbert",
  "Chief Architect · ChatGPT",
  "Branch Director · Atlas",
  "AI Departments",
  "AI Workers",
] as const;

export const ORGANIZATION_ROUTING_HIERARCHY = [
  "Intent",
  "Capability",
  "Department(s)",
  "Worker Assignment",
  "Execution Plan",
  "Engineering Package",
] as const;

export const ORGANIZATIONAL_MODEL: OrganizationalModelDefinition = {
  id: ORGANIZATION_MODEL_ID,
  title: "Organizational Model",
  version: "1.0.0",
  hierarchy: [...ORGANIZATION_HIERARCHY],
  atlasRole: "Branch Director (Vestigingsdirecteur) of the Robbert AI Organization",
  atlasResponsibilities: [
    "Translate human intent into execution across AI departments",
    "Select the correct department for each intent",
    "Assign work to AI Workers",
    "Monitor progress and coordinate execution",
    "Evaluate quality through Quality Assurance",
    "Report status to Robbert (Founder / CEO)",
    "Recommend evolution of the organization",
    "Request Engineering Packages only when software work is required",
  ],
  communicationRules: [
    "Robbert (Founder / CEO) provides intent — the highest human input",
    "ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers",
    "Atlas (Branch Director) operationalizes intent — every AI Worker reports to Atlas",
    "Atlas reports status and recommendations to Robbert",
    "ChatGPT does not assign tasks, write Architecture Briefs, or manage AI Workers",
    "Engineering department executes software work via Engineering Packages when required",
    "Non-software intents route to operational departments without code generation",
  ],
  organizationalCapabilities: [
    {
      id: "growth",
      name: "Growth & Marketing",
      description: "Audience growth, content strategy, social media, brand presence",
      primaryDepartmentId: "marketing",
    },
    {
      id: "research",
      name: "Research & Analysis",
      description: "Market research, trend analysis, competitive intelligence",
      primaryDepartmentId: "research",
    },
    {
      id: "knowledge-work",
      name: "Knowledge Management",
      description: "Documentation, learning paths, knowledge curation",
      primaryDepartmentId: "knowledge",
    },
    {
      id: "operations-work",
      name: "Operations",
      description: "Workflow coordination, process optimization, execution queues",
      primaryDepartmentId: "operations",
    },
    {
      id: "personal-assist",
      name: "Personal Assistance",
      description: "Scheduling, reminders, executive support for the founder",
      primaryDepartmentId: "personal-assistance",
    },
    {
      id: "finance-work",
      name: "Finance",
      description: "Budget tracking, cost analysis, financial planning",
      primaryDepartmentId: "finance",
    },
    {
      id: "quality-work",
      name: "Quality Assurance",
      description: "Review, audit, validation, release readiness",
      primaryDepartmentId: "quality-assurance",
    },
    {
      id: "software-delivery",
      name: "Software Delivery",
      description: "Platform engineering, code, missions, and Engineering Packages",
      primaryDepartmentId: "engineering",
    },
  ],
  departments: [
    {
      id: "engineering",
      name: "Engineering",
      responsibilities: ["Software development", "Platform missions", "Engineering Packages", "Atlas core"],
      workers: [
        { id: "claude-engineer", name: "Claude Engineer", departmentId: "engineering", role: "Implements Engineering Packages" },
        { id: "platform-architect", name: "Platform Architect", departmentId: "engineering", role: "Maintains Atlas platform architecture" },
      ],
    },
    {
      id: "research",
      name: "Research",
      responsibilities: ["Trend analysis", "Competitive research", "Data gathering", "Insight reports"],
      workers: [
        { id: "trend-analyst", name: "Trend Analyst", departmentId: "research", role: "Analyzes market and platform trends" },
        { id: "data-researcher", name: "Data Researcher", departmentId: "research", role: "Gathers and synthesizes research data" },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      responsibilities: ["Growth strategy", "Content planning", "Social media", "Brand presence"],
      workers: [
        { id: "growth-strategist", name: "Growth Strategist", departmentId: "marketing", role: "Designs audience growth strategies" },
        { id: "content-planner", name: "Content Planner", departmentId: "marketing", role: "Plans content calendars and campaigns" },
        { id: "social-manager", name: "Social Media Manager", departmentId: "marketing", role: "Executes social platform growth tactics" },
      ],
    },
    {
      id: "knowledge",
      name: "Knowledge",
      responsibilities: ["Documentation", "Learning paths", "Knowledge base", "Content curation"],
      workers: [
        { id: "knowledge-curator", name: "Knowledge Curator", departmentId: "knowledge", role: "Organizes and maintains knowledge assets" },
        { id: "doc-writer", name: "Documentation Writer", departmentId: "knowledge", role: "Produces clear documentation" },
      ],
    },
    {
      id: "operations",
      name: "Operations",
      responsibilities: ["Workflow coordination", "Process optimization", "Execution monitoring"],
      workers: [
        { id: "workflow-coordinator", name: "Workflow Coordinator", departmentId: "operations", role: "Coordinates cross-department workflows" },
        { id: "process-optimizer", name: "Process Optimizer", departmentId: "operations", role: "Improves operational efficiency" },
      ],
    },
    {
      id: "personal-assistance",
      name: "Personal Assistance",
      responsibilities: ["Scheduling", "Reminders", "Executive support", "Founder productivity"],
      workers: [
        { id: "executive-assistant", name: "Executive Assistant", departmentId: "personal-assistance", role: "Supports founder daily operations" },
        { id: "scheduler", name: "Scheduler", departmentId: "personal-assistance", role: "Manages calendars and deadlines" },
      ],
    },
    {
      id: "finance",
      name: "Finance",
      responsibilities: ["Budget tracking", "Cost analysis", "Financial reporting"],
      workers: [
        { id: "budget-analyst", name: "Budget Analyst", departmentId: "finance", role: "Tracks budgets and spending" },
        { id: "cost-tracker", name: "Cost Tracker", departmentId: "finance", role: "Monitors operational costs" },
      ],
    },
    {
      id: "quality-assurance",
      name: "Quality Assurance",
      responsibilities: ["Quality review", "Atlas Auditor coordination", "Release validation"],
      workers: [
        { id: "qa-reviewer", name: "QA Reviewer", departmentId: "quality-assurance", role: "Reviews deliverable quality" },
        { id: "audit-specialist", name: "Audit Specialist", departmentId: "quality-assurance", role: "Runs Atlas Auditor checks" },
      ],
    },
  ],
};

export function getOrganizationalModel(): OrganizationalModelDefinition {
  return ORGANIZATIONAL_MODEL;
}

export function getDepartment(departmentId: string) {
  return ORGANIZATIONAL_MODEL.departments.find((item) => item.id === departmentId);
}

export function renderOrganizationHierarchy(): string {
  return ORGANIZATION_HIERARCHY.join("\n↓\n");
}

export function renderOrganizationRoutingHierarchy(): string {
  return ORGANIZATION_ROUTING_HIERARCHY.join("\n↓\n");
}
