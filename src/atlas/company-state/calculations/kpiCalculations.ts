import type { CompanyModels, CompanyKpiState, OverallStatus } from "../types";
import {
  calculateAgentHealth,
  calculateAppHealth,
  calculateApprovalQueueSize,
  calculateBusinessHealth,
  calculateCompanyHealth,
  calculateEngineeringHealth,
  calculateMemoryHealth,
  calculateNorthStarAlignment,
  calculatePlatformHealth,
  calculateRoadmapProgress,
  calculateSprintProgress,
  calculateTechnicalDebtScore,
} from "./healthCalculations";
import { statusFromScore, trendFromScore } from "./scoreUtils";

export function calculateOverallStatus(models: CompanyModels): OverallStatus {
  const criticalBugs = models.bugs.filter(
    (bug) => bug.severity === "critical" && bug.status !== "resolved",
  ).length;
  if (criticalBugs > 0 || models.blockers.length > 0) {
    return "blocked";
  }

  const blockedAgents = models.agents.filter((agent) => agent.status === "blocked").length;
  const blockedSprints = models.sprints.filter((sprint) => sprint.lifecycle === "blocked").length;
  const pendingApprovals = calculateApprovalQueueSize(models);

  if (blockedAgents > 0 || blockedSprints > 0 || pendingApprovals > 0) {
    return "attention";
  }

  if (calculateMemoryHealth(models) < 75 || calculatePlatformHealth(models) < 80) {
    return "attention";
  }

  return "healthy";
}

export function calculateCompanyKpis(models: CompanyModels): CompanyKpiState[] {
  const companyHealth = calculateCompanyHealth(models);
  const engineeringHealth = calculateEngineeringHealth(models);
  const memoryHealth = calculateMemoryHealth(models);
  const platformHealth = calculatePlatformHealth(models);
  const agentHealth = calculateAgentHealth(models);
  const businessHealth = calculateBusinessHealth(models);
  const appHealth = calculateAppHealth(models);
  const roadmapProgress = calculateRoadmapProgress(models);
  const sprintProgress = calculateSprintProgress(models);
  const approvalQueue = calculateApprovalQueueSize(models);
  const northStar = calculateNorthStarAlignment(models);
  const technicalDebt = calculateTechnicalDebtScore(models);

  const openBugs = models.bugs.filter((bug) => bug.status !== "resolved");
  const criticalBugs = openBugs.filter((bug) => bug.severity === "critical").length;
  const blockers = models.blockers.length + models.agents.filter((agent) => agent.status === "blocked").length;
  const activeSprints = models.sprints.filter((sprint) => sprint.lifecycle === "running").length;
  const activeInitiatives = models.initiatives.filter(
    (item) => item.lane === "now" && item.progress < 100,
  ).length;
  const appsRunning = models.apps.filter((app) => app.status === "healthy" || app.status === "active").length;
  const businessesRunning = models.businesses.filter(
    (business) => business.status === "healthy" || business.status === "active",
  ).length;

  return [
    {
      id: "company-health",
      label: "Company Health",
      value: `${companyHealth}%`,
      trend: trendFromScore(companyHealth),
      status: statusFromScore(companyHealth),
    },
    {
      id: "engineering-health",
      label: "Engineering Health",
      value: `${engineeringHealth}%`,
      trend: trendFromScore(engineeringHealth),
      status: statusFromScore(engineeringHealth),
    },
    {
      id: "platform-health",
      label: "Platform Health",
      value: `${platformHealth}%`,
      trend: trendFromScore(platformHealth),
      status: statusFromScore(platformHealth),
    },
    {
      id: "memory-health",
      label: "Memory Health",
      value: `${memoryHealth}%`,
      trend: trendFromScore(memoryHealth, 75),
      status: statusFromScore(memoryHealth),
    },
    {
      id: "agent-health",
      label: "Agent Health",
      value: `${agentHealth}%`,
      trend: trendFromScore(agentHealth),
      status: statusFromScore(agentHealth),
    },
    {
      id: "business-health",
      label: "Business Health",
      value: `${businessHealth}%`,
      trend: trendFromScore(businessHealth),
      status: statusFromScore(businessHealth),
    },
    {
      id: "app-health",
      label: "App Health",
      value: `${appHealth}%`,
      trend: trendFromScore(appHealth),
      status: statusFromScore(appHealth),
    },
    {
      id: "roadmap-progress",
      label: "Roadmap Progress",
      value: `${roadmapProgress}%`,
      trend: trendFromScore(roadmapProgress),
      status: statusFromScore(roadmapProgress),
    },
    {
      id: "sprint-progress",
      label: "Sprint Progress",
      value: `${sprintProgress}%`,
      trend: trendFromScore(sprintProgress),
      status: statusFromScore(sprintProgress),
    },
    {
      id: "approval-queue",
      label: "Approval Queue",
      value: String(approvalQueue),
      trend: approvalQueue > 2 ? "up" : "flat",
      status: approvalQueue > 0 ? "attention" : "healthy",
    },
    {
      id: "technical-debt",
      label: "Technical Debt",
      value: technicalDebt >= 75 ? "Low" : technicalDebt >= 55 ? "Medium" : "High",
      trend: technicalDebt >= 75 ? "down" : "up",
      status: statusFromScore(technicalDebt),
    },
    {
      id: "north-star-alignment",
      label: "North Star Alignment",
      value: `${northStar}%`,
      trend: trendFromScore(northStar),
      status: statusFromScore(northStar),
    },
    {
      id: "apps-running",
      label: "Apps Running",
      value: String(appsRunning),
      trend: "flat",
      status: "healthy",
    },
    {
      id: "businesses-running",
      label: "Businesses Running",
      value: String(businessesRunning),
      trend: "up",
      status: "healthy",
    },
    {
      id: "active-initiatives",
      label: "Active Initiatives",
      value: String(activeInitiatives),
      trend: "up",
      status: "healthy",
    },
    {
      id: "active-sprints",
      label: "Active Sprints",
      value: String(activeSprints),
      trend: "flat",
      status: activeSprints > 0 ? "healthy" : "attention",
    },
    {
      id: "critical-bugs",
      label: "Critical Bugs",
      value: String(criticalBugs),
      trend: criticalBugs > 0 ? "up" : "down",
      status: criticalBugs > 0 ? "critical" : "healthy",
    },
    {
      id: "open-bugs",
      label: "Open Bugs",
      value: String(openBugs.length),
      trend: openBugs.length > 2 ? "up" : "flat",
      status: openBugs.length > 3 ? "attention" : "healthy",
    },
    {
      id: "blockers",
      label: "Blockers",
      value: String(blockers),
      trend: blockers > 0 ? "up" : "flat",
      status: blockers > 0 ? "attention" : "healthy",
    },
    {
      id: "atlas-confidence",
      label: "Atlas Confidence",
      value: `${models.recommendation.confidence}%`,
      trend: "up",
      status: "healthy",
    },
  ];
}
