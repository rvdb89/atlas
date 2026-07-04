import type { PromptDefinition } from "../../types";

export const KNOWLEDGE_PROMPTS: PromptDefinition[] = [
  {
    id: "knowledge.write.v1",
    version: "1.0.0",
    category: "knowledge",
    description: "Write a knowledge article from a generation brief.",
    inputSchema: [
      { name: "topic", type: "string", required: true },
      { name: "contentType", type: "string", required: true },
      { name: "categoryId", type: "string" },
      { name: "keywords", type: "array" },
    ],
    outputSchema: {
      kind: "json",
      json: true,
      fields: [
        { name: "title", type: "string", required: true },
        { name: "subtitle", type: "string", required: true },
        { name: "slug", type: "string", required: true },
        { name: "seoTitle", type: "string", required: true },
        { name: "seoDescription", type: "string", required: true },
        { name: "tags", type: "array", required: true },
      ],
    },
    system: "You are Baker, Atlas senior copywriter. Write premium editorial knowledge content.",
    userTemplate: "Write a knowledge article for this brief:\n{{payload}}",
  },
  {
    id: "knowledge.review.v1",
    version: "1.0.0",
    category: "knowledge",
    description: "Review a knowledge draft for editorial quality.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Proof, Atlas fact checker. Review editorial quality and consistency.",
    userTemplate: "Review this knowledge draft:\n{{payload}}",
  },
];
