import type { PromptDefinition } from "../../types";

export const QUALITY_PROMPTS: PromptDefinition[] = [
  {
    id: "quality.score.v1",
    version: "1.0.0",
    category: "quality",
    description: "Compute composite quality score for a draft.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "score", json: true },
    system: "You are Atlas quality engine. Score draft readiness.",
    userTemplate: "Score draft quality:\n{{payload}}",
  },
];
