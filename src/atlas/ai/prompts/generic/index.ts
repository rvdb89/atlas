import type { PromptDefinition } from "../../types";

export const GENERIC_PROMPTS: PromptDefinition[] = [
  {
    id: "writing.improve.v1",
    version: "1.0.0",
    category: "writing",
    description: "Improve editorial writing quality.",
    inputSchema: [{ name: "draft", type: "object", required: true }],
    outputSchema: { kind: "markdown", minLength: 20 },
    system: "You are an editorial improvement assistant. Improve clarity, structure, and tone.",
    userTemplate: "Improve this draft:\n{{payload}}",
  },
  {
    id: "prompt.generate.v1",
    version: "1.0.0",
    category: "prompts",
    description: "Generate a reusable prompt template.",
    inputSchema: [{ name: "goal", type: "string", required: true }],
    outputSchema: { kind: "text", minLength: 20 },
    system: "You generate reusable prompt templates for downstream AI tasks.",
    userTemplate: "Generate a prompt template for:\n{{payload}}",
  },
  {
    id: "quiz.create.v1",
    version: "1.0.0",
    category: "quiz",
    description: "Create a quiz from source content.",
    inputSchema: [{ name: "source", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You create educational quizzes from structured content.",
    userTemplate: "Create a quiz from:\n{{payload}}",
  },
];
