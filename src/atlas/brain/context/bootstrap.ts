import {
  registerContextProvider,
  registerPlannedContextProviders,
  setActiveContextProviders,
} from "./ContextRegistry";
import type { ContextBuildInput, ContextBundle } from "./context.types";

function registerCoreContextProvider(): void {
  registerContextProvider({
    id: "core-context",
    label: "Core Context",
    description: "Goal, module, workspace, user, and environment sources",
    sourceIds: ["goal", "module", "workspace", "user", "environment"],
    contribute(input: ContextBuildInput, partial: Partial<ContextBundle>): Partial<ContextBundle> {
      return {
        goal: input.goal,
        module: partial.module,
        user: partial.user,
        workspace: partial.workspace,
        environment: partial.environment,
        sources: ["goal", "module", "workspace", "user", "environment"],
      };
    },
  });
}

function registerPlannerContextProvider(): void {
  registerContextProvider({
    id: "planner-context",
    label: "Planner Context",
    description: "Execution plan output from Atlas Planner",
    sourceIds: ["planner"],
    contribute(input: ContextBuildInput): Partial<ContextBundle> {
      return {
        plannerOutput: input.executionPlan ?? null,
        sources: ["planner"],
      };
    },
  });
}

function registerMemoryContextProvider(): void {
  registerContextProvider({
    id: "memory-context",
    label: "Memory Context",
    description: "Relevant Atlas memory entries for the active goal",
    sourceIds: ["memory"],
    contribute(): Partial<ContextBundle> {
      return { sources: ["memory"] };
    },
  });
}

function registerEntityContextProvider(): void {
  registerContextProvider({
    id: "entity-context",
    label: "Entity Context",
    description: "Relevant entities from the Atlas entity catalog",
    sourceIds: ["entity"],
    contribute(): Partial<ContextBundle> {
      return { sources: ["entity"] };
    },
  });
}

function registerWorkflowContextProvider(): void {
  registerContextProvider({
    id: "workflow-context",
    label: "Workflow Context",
    description: "Registered workflows and active workflow metadata",
    sourceIds: ["workflow"],
    contribute(): Partial<ContextBundle> {
      return { sources: ["workflow"] };
    },
  });
}

function registerProviderContextProvider(): void {
  registerContextProvider({
    id: "provider-context",
    label: "Provider Context",
    description: "Available AI and platform providers for execution",
    sourceIds: ["providers"],
    contribute(): Partial<ContextBundle> {
      return { sources: ["providers"] };
    },
  });
}

let bootstrapped = false;

export function bootstrapAtlasContext(): void {
  if (bootstrapped) return;

  registerCoreContextProvider();
  registerPlannerContextProvider();
  registerMemoryContextProvider();
  registerEntityContextProvider();
  registerWorkflowContextProvider();
  registerProviderContextProvider();

  setActiveContextProviders([
    "core-context",
    "planner-context",
    "memory-context",
    "entity-context",
    "workflow-context",
    "provider-context",
  ]);

  registerPlannedContextProviders();

  bootstrapped = true;
}

export function isAtlasContextBootstrapped(): boolean {
  return bootstrapped;
}
