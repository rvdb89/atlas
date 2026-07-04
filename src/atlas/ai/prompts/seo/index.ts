import type { PromptDefinition } from "../../types";

export const SEO_PROMPTS: PromptDefinition[] = [
  {
    id: "seo.optimize.v1",
    version: "1.0.0",
    category: "seo",
    description: "Optimize SEO metadata for a draft.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Proof. Optimize SEO title, description, and tags.",
    userTemplate: "Optimize SEO:\n{{payload}}",
  },
];
