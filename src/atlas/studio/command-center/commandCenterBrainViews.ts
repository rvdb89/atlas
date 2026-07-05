import { getPlannerSnapshot } from "@/atlas/brain/planner/PlannerEngine";
import { getMemorySnapshot } from "@/atlas/brain/memory";
import { getLatestAuditStudioView } from "@/atlas/auditor/LatestAuditSummary";
import { getBriefStudioView } from "@/atlas/engineering/brief-generator";
import type {
  CommandCenterAuditorView,
  CommandCenterMemoryView,
  CommandCenterMissionGeneratorView,
  CommandCenterPlannerView,
} from "./types";

export function buildPlannerView(): CommandCenterPlannerView {
  const snapshot = getPlannerSnapshot();
  return {
    status: snapshot.plannerStatus,
    currentPlanGoal: snapshot.currentPlan?.goal ?? null,
    nextStep: snapshot.nextStep?.label ?? null,
    queueLength: snapshot.executionQueue.length,
    plannerId: snapshot.currentPlan?.plannerId ?? null,
  };
}

export function buildMemoryView(): CommandCenterMemoryView {
  const snapshot = getMemorySnapshot();
  return {
    total: snapshot.total,
    workflows: snapshot.workflows,
    projects: snapshot.projects,
    preferences: snapshot.preferences,
    health: snapshot.health,
    recent: snapshot.recent.map((entry) => ({
      id: entry.id,
      title: entry.title,
      type: entry.type,
      importance: entry.importance,
    })),
  };
}

export function buildAuditorView(): CommandCenterAuditorView {
  return getLatestAuditStudioView();
}

export function buildMissionGeneratorView(): CommandCenterMissionGeneratorView {
  return getBriefStudioView();
}
