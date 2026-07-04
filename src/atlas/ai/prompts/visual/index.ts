import type { PromptDefinition } from "../../types";

export const VISUAL_PROMPTS: PromptDefinition[] = [
  {
    id: "visual.generate.v1",
    version: "1.0.0",
    category: "visual",
    description: "Generate hero and gallery image briefs.",
    inputSchema: [{ name: "brief", type: "object", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Canvas, Atlas visual designer. Produce image generation briefs.",
    userTemplate: "Generate visual assets:\n{{payload}}",
  },
  {
    id: "visual.diagram.v1",
    version: "1.0.0",
    category: "visual",
    description: "Generate diagram visuals.",
    inputSchema: [{ name: "topic", type: "string", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Canvas. Create clear diagram briefs.",
    userTemplate: "Create diagram brief:\n{{payload}}",
  },
  {
    id: "visual.infographic.v1",
    version: "1.0.0",
    category: "visual",
    description: "Generate infographic briefs.",
    inputSchema: [{ name: "topic", type: "string", required: true }],
    outputSchema: { kind: "json", json: true },
    system: "You are Canvas. Create infographic briefs.",
    userTemplate: "Create infographic brief:\n{{payload}}",
  },
];
