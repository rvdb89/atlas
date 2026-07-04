import type { PromptDefinition } from "../../types";

export const LINK_PROMPTS: PromptDefinition[] = [
  {
    id: "link.build.v1",
    version: "1.0.0",
    category: "link",
    description: "Build internal link graph for a draft.",
    inputSchema: [
      { name: "slug", type: "string", required: true },
      { name: "title", type: "string", required: true },
      { name: "tags", type: "array", required: true },
    ],
    outputSchema: { kind: "json", json: true },
    system: "You are Atlas knowledge architect. Build internal links.",
    userTemplate: "Build link graph:\n{{payload}}",
  },
];
