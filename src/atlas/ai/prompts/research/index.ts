import type { PromptDefinition } from "../../types";

export const RESEARCH_PROMPTS: PromptDefinition[] = [
  {
    id: "research.search.v1",
    version: "1.0.0",
    category: "research",
    description: "Search and collect sources for a topic.",
    inputSchema: [{ name: "topic", type: "string", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Atlas research agent. Find authoritative sources.",
    userTemplate: "Research topic:\n{{payload}}",
  },
  {
    id: "research.summarize.v1",
    version: "1.0.0",
    category: "research",
    description: "Summarize research findings.",
    inputSchema: [{ name: "sources", type: "array", required: true }],
    outputSchema: { kind: "markdown", minLength: 40 },
    system: "You are Atlas research agent. Summarize findings clearly.",
    userTemplate: "Summarize research:\n{{payload}}",
  },
];
