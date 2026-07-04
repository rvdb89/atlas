import { getTeamMember } from "@/atlas/agents/team";
import { getTaskRegistryEntryByName } from "@/atlas/ai/registry/taskRegistry";
import { getModelProfile } from "@/atlas/ai/models/profiles";
import type { AiTaskName } from "@/atlas/ai/types";
import type { StudioAiMockResult, StudioAiTaskForm } from "../types";

export function runMockAiTask(form: StudioAiTaskForm): StudioAiMockResult {
  const route = getTaskRegistryEntryByName(form.taskName);
  const profile = getModelProfile(route.primaryModelId);
  const member = getTeamMember(route.agentId);

  const preview = [
    `Task: ${form.taskName}`,
    `Module: ${form.moduleId}`,
    form.targetEntityId ? `Target: ${form.targetEntityId}` : "Target: none",
    "",
    "Mock output preview:",
    form.context.trim() || "Generated structured content ready for review.",
    "",
    "Status: completed (mock)",
  ].join("\n");

  return {
    id: `mock-${Date.now()}`,
    taskName: form.taskName,
    agentLabel: `${member.emoji} ${member.name}`,
    modelLabel: profile ? `${profile.vendor} · ${profile.name}` : route.primaryModelId,
    outputPreview: preview,
    generatedAt: new Date().toISOString(),
  };
}

export const STUDIO_TASK_OPTIONS: AiTaskName[] = [
  "GenerateKnowledgeArticle",
  "GenerateRecipe",
  "GenerateVisual",
  "FactCheck",
  "ReviewContent",
  "ResearchTopic",
  "Summarize",
  "GenerateSEO",
  "ImproveWriting",
  "GenerateDiagram",
  "ScoreQuality",
];
