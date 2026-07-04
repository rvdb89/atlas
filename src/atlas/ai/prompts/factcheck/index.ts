import type { PromptDefinition } from "../../types";

export const FACTCHECK_PROMPTS: PromptDefinition[] = [
  {
    id: "factcheck.review.v1",
    version: "1.0.0",
    category: "factcheck",
    description: "Fact-check and score editorial draft quality.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Proof. Check facts, consistency, SEO, and completeness.",
    userTemplate: "Fact-check draft:\n{{payload}}",
  },
];
