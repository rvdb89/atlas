import type { CompanyModels } from "../types";
import { average, clampScore } from "./scoreUtils";

export function calculateCompanyHealth(models: CompanyModels): number {
  const agentHealth = average(models.agents.map((agent) => agent.health));
  const businessHealth = average(
    models.businesses.filter((b) => b.status !== "idle" && b.status !== "planning").map((b) => b.health),
  );
  const pendingApprovals = models.approvals.filter((item) => item.status === "pending").length;
  const criticalBugs = models.bugs.filter((bug) => bug.severity === "critical" && bug.status !== "resolved").length;
  const blockedAgents = models.agents.filter((agent) => agent.status === "blocked").length;

  let score = (agentHealth + businessHealth) / 2;
  score -= pendingApprovals * 2;
  score -= criticalBugs * 10;
  score -= blockedAgents * 4;

  return clampScore(score);
}

export function calculateEngineeringHealth(models: CompanyModels): number {
  const engineering = models.departments.find((dept) => dept.id === "engineering");
  const engineeringAgent = models.agents.find((agent) => agent.department === "engineering");
  return clampScore(average([engineering?.health ?? 82, engineeringAgent?.health ?? 82]));
}

export function calculateMemoryHealth(models: CompanyModels): number {
  return clampScore(models.memory.health);
}

export function calculatePlatformHealth(models: CompanyModels): number {
  const platform = models.platform;
  return clampScore(
    average([
      platform.studioHealth,
      platform.appHealth,
      platform.apiHealth,
      platform.providersHealth,
      platform.reviewsHealth,
    ]),
  );
}

export function calculateAgentHealth(models: CompanyModels): number {
  return clampScore(average(models.agents.map((agent) => agent.health)));
}

export function calculateBusinessHealth(models: CompanyModels): number {
  return clampScore(average(models.businesses.map((business) => business.health)));
}

export function calculateAppHealth(models: CompanyModels): number {
  return clampScore(average(models.apps.filter((app) => app.health > 0).map((app) => app.health)));
}

export function calculateRoadmapProgress(models: CompanyModels): number {
  return clampScore(average(models.roadmap.map((item) => item.progress)));
}

export function calculateSprintProgress(models: CompanyModels): number {
  const active = models.sprints.filter((sprint) => sprint.lifecycle === "running");
  if (active.length === 0) return 100;
  return clampScore(average(active.map((sprint) => sprint.progress)));
}

export function calculateNorthStarAlignment(models: CompanyModels): number {
  const aligned = models.roadmap.filter((item) => item.lane !== "blocked").length;
  return clampScore((aligned / Math.max(models.roadmap.length, 1)) * 100);
}

export function calculateTechnicalDebtScore(models: CompanyModels): number {
  const openBugs = models.bugs.filter((bug) => bug.status !== "resolved").length;
  const blockedSprints = models.sprints.filter((sprint) => sprint.lifecycle === "blocked").length;
  let score = 88;
  score -= openBugs * 3;
  score -= blockedSprints * 8;
  return clampScore(score);
}

export function calculateApprovalQueueSize(models: CompanyModels): number {
  return models.approvals.filter((item) => item.status === "pending").length;
}
