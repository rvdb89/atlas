import { listProviders } from "@/atlas/ai/providers/registry";
import { ATLAS_AI_TEAM } from "@/atlas/agents/team";
import { tryGetActiveModule } from "@/atlas/publishing/plugin/registry";

import type { PlanningContext } from "./planner.types";

export function createPlanningContext(options?: {
  moduleId?: string;
  moduleLabel?: string;
  userId?: string;
  userLabel?: string;
  workspace?: string;
  language?: string;
  environment?: string;
  contentType?: string;
  topic?: string;
  knowledgeAvailable?: string[];
}): PlanningContext {
  const activeModule = tryGetActiveModule();
  const moduleId = options?.moduleId ?? activeModule?.id ?? "atlas";
  const moduleLabel = options?.moduleLabel ?? activeModule?.name ?? moduleId;

  return {
    currentModule: {
      id: moduleId,
      label: moduleLabel,
    },
    currentUser: {
      id: options?.userId ?? "atlas-user",
      label: options?.userLabel ?? "Atlas Developer",
    },
    currentWorkspace: options?.workspace ?? "Atlas Studio",
    availableProviders: listProviders().map((provider) => provider.id),
    availableAgents: ATLAS_AI_TEAM.map((member) => member.id),
    knowledgeAvailable: options?.knowledgeAvailable ?? [
      "entity-catalog",
      "intelligence-insights",
      "publishing-templates",
    ],
    language: options?.language ?? "nl",
    environment: options?.environment ?? "development",
    contentType: options?.contentType,
    topic: options?.topic,
  };
}
