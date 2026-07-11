import {
  calculateCompanyHealth,
  calculateNorthStarAlignment,
  calculatePlatformHealth,
} from "./calculations/healthCalculations";
import { calculateCompanyKpis, calculateOverallStatus } from "./calculations/kpiCalculations";
import { buildTimeGreeting } from "./calculations/scoreUtils";
import {
  DEPARTMENT_LABELS,
  entityStatusLabel,
  platformComponentLabel,
  sprintLifecycleLabel,
  sprintLifecycleStatus,
} from "./labels";
import type {
  CompanyModels,
  CompanyState,
  CompanyCeoCommandState,
  CompanyRecommendation,
  CompanyStateResult,
  CompanyStateSource,
} from "./types";
import { getCompanyModels } from "./CompanyStateStore";

function buildRecommendation(models: CompanyModels): CompanyRecommendation {
  return { ...models.recommendation };
}

function buildCeoCommand(models: CompanyModels, companyHealth: number): CompanyCeoCommandState {
  const recommendation = models.recommendation;

  if (models.decisionFeedback.ceoCommandConfirmation) {
    return {
      greeting: buildTimeGreeting(),
      companyHealthScore: companyHealth,
      todayAdvice: recommendation.headline,
      recommendation: recommendation.recommendation,
      reason: recommendation.rationale,
      primaryActionLabel: recommendation.relatedInitiativeId
        ? `Approve ${recommendation.relatedInitiativeId}`
        : "Approve Recommendation",
      secondaryActionLabel: "Review Details",
      confirmationMessage: models.decisionFeedback.ceoCommandConfirmation,
    };
  }

  return {
    greeting: buildTimeGreeting(),
    companyHealthScore: companyHealth,
    todayAdvice: recommendation.headline,
    recommendation: recommendation.recommendation,
    reason: recommendation.rationale,
    primaryActionLabel: recommendation.relatedInitiativeId
      ? `Approve ${recommendation.relatedInitiativeId}`
      : "Approve Recommendation",
    secondaryActionLabel: "Review Details",
  };
}

function resolveActiveSprintName(models: CompanyModels, sprintId: string | null): string {
  if (!sprintId) return "Not started";
  return models.sprints.find((sprint) => sprint.id === sprintId)?.name ?? sprintId;
}

/** Builds the computed CompanyState from raw business models. */
export function buildCompanyState(models: CompanyModels): CompanyState {
  const companyHealth = calculateCompanyHealth(models);
  const northStarAlignment = calculateNorthStarAlignment(models);
  const platformHealth = calculatePlatformHealth(models);

  return {
    companyName: models.companyName,
    companyHealth,
    overallStatus: calculateOverallStatus(models),
    northStarAlignment,
    recommendation: buildRecommendation(models),
    generatedAt: new Date().toISOString(),
    ceoCommand: buildCeoCommand(models, companyHealth),
    businesses: models.businesses.map((business) => ({
      id: business.id,
      name: business.name,
      health: business.health,
      status: business.status,
      statusLabel: entityStatusLabel(business.status),
      currentFocus: business.currentFocus,
      activeSprint: resolveActiveSprintName(models, business.activeSprintId),
      roadmapProgress: business.roadmapProgress,
      openBugs: business.openBugs,
      nextRecommendation: business.nextRecommendation,
      marketingStatus: business.marketingStatus,
      productIds: business.productIds,
    })),
    apps: models.apps.map((app) => ({
      id: app.id,
      name: app.name,
      businessId: app.businessId,
      status: app.status,
      statusLabel: entityStatusLabel(app.status),
      version: app.version,
      health: app.health,
      lastRelease: app.lastRelease,
      currentInitiative: app.currentInitiative,
    })),
    departments: models.departments.map((department) => ({
      id: department.id,
      label: DEPARTMENT_LABELS[department.id],
      health: department.health,
      status: department.status,
      statusLabel: entityStatusLabel(department.status),
      currentWork: department.currentWork,
      owner: department.owner,
    })),
    agents: models.agents.map((agent) => ({ ...agent })),
    initiatives: models.initiatives.map((item) => ({ ...item })),
    sprints: models.sprints.map((sprint) => ({
      id: sprint.id,
      name: sprint.name,
      businessId: sprint.businessId,
      progress: sprint.progress,
      lifecycle: sprint.lifecycle,
      status: sprintLifecycleStatus(sprint.lifecycle),
      statusLabel: sprintLifecycleLabel(sprint.lifecycle),
    })),
    roadmap: models.roadmap.map((item) => ({ ...item })),
    approvals: models.approvals.map((approval) => ({ ...approval })),
    platform: {
      health: platformHealth,
      statusLabel: models.platform.statusLabel,
      latestReviewLabel: models.platform.latestReviewLabel,
      studioLabel: platformComponentLabel(models.platform.studioHealth),
      appLabel: platformComponentLabel(models.platform.appHealth),
      apiLabel: platformComponentLabel(models.platform.apiHealth),
      providersLabel: platformComponentLabel(models.platform.providersHealth),
      reviewsLabel: models.platform.latestReviewLabel,
    },
    memory: { ...models.memory },
    bugs: models.bugs.map((bug) => ({ ...bug })),
    blockers: models.blockers.map((blocker) => ({ ...blocker })),
    kpis: calculateCompanyKpis(models),
    activity: models.activity.map((event) => ({ ...event })),
    livePlan: models.livePlan ? { ...models.livePlan, steps: models.livePlan.steps.map((step) => ({ ...step })) } : null,
  };
}

export type CompanyStateEngineOptions = {
  source?: CompanyStateSource;
};

/** Primary read API — all consumers should use this to read company state. */
export function getCompanyState(options: CompanyStateEngineOptions = {}): CompanyStateResult {
  const models = getCompanyModels();
  return {
    source: options.source ?? "mock",
    state: buildCompanyState(models),
  };
}

export async function loadCompanyState(options?: CompanyStateEngineOptions): Promise<CompanyStateResult> {
  return getCompanyState(options);
}

export function peekCompanyState(): CompanyState {
  return buildCompanyState(getCompanyModels());
}
