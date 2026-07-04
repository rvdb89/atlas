export * from "@/atlas/publishing/types";
export type {
  CopywriterOutput,
  FactCheckerInput,
  LinkEngineInput,
  TranslatorInput,
  DomainValidatorInput,
  CopywriterAgentContract,
  VisualDesignerAgentContract,
  FactCheckerAgentContract,
  LinkEngineAgentContract,
  TranslatorAgentContract,
  DomainValidatorAgentContract,
} from "@/atlas/publishing/agents/coreAgents";

/** @deprecated Use DomainValidatorAgentContract */
export type TestKitchenAgentContract = import("@/atlas/publishing/agents/coreAgents").DomainValidatorAgentContract;
