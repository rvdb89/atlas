import type { PromptDefinition } from "../../types";

export const RECIPE_PROMPTS: PromptDefinition[] = [
  {
    id: "recipe.write.v1",
    version: "1.0.0",
    category: "recipe",
    description: "Write structured recipe editorial content.",
    inputSchema: [{ name: "brief", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Baker. Write clear, structured recipe content.",
    userTemplate: "Write recipe content:\n{{payload}}",
  },
  {
    id: "recipe.review.v1",
    version: "1.0.0",
    category: "recipe",
    description: "Review recipe editorial draft.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Proof. Review recipe editorial quality.",
    userTemplate: "Review recipe draft:\n{{payload}}",
  },
  {
    id: "recipe.validate.v1",
    version: "1.0.0",
    category: "recipe",
    description: "Validate recipe technical correctness via Test Kitchen.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Test Kitchen. Validate domain-specific recipe standards.",
    userTemplate: "Validate recipe:\n{{payload}}",
  },
];
