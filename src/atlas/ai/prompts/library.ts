import type { PromptDefinition } from "../types";
import { KNOWLEDGE_PROMPTS } from "./knowledge";
import { RECIPE_PROMPTS } from "./recipe";
import { VISUAL_PROMPTS } from "./visual";
import { RESEARCH_PROMPTS } from "./research";
import { FACTCHECK_PROMPTS } from "./factcheck";
import { TRANSLATION_PROMPTS } from "./translation";
import { SEO_PROMPTS } from "./seo";
import { LINK_PROMPTS } from "./link";
import { QUALITY_PROMPTS } from "./quality";
import { GENERIC_PROMPTS } from "./generic";

const PROMPT_LIBRARY: Record<string, PromptDefinition> = {};

function registerPrompts(prompts: PromptDefinition[]) {
  for (const prompt of prompts) {
    PROMPT_LIBRARY[prompt.id] = prompt;
  }
}

registerPrompts(KNOWLEDGE_PROMPTS);
registerPrompts(RECIPE_PROMPTS);
registerPrompts(VISUAL_PROMPTS);
registerPrompts(RESEARCH_PROMPTS);
registerPrompts(FACTCHECK_PROMPTS);
registerPrompts(TRANSLATION_PROMPTS);
registerPrompts(SEO_PROMPTS);
registerPrompts(LINK_PROMPTS);
registerPrompts(QUALITY_PROMPTS);
registerPrompts(GENERIC_PROMPTS);

export function registerPromptDefinition(prompt: PromptDefinition): void {
  PROMPT_LIBRARY[prompt.id] = prompt;
}

export function getPromptDefinition(promptId: string): PromptDefinition {
  const prompt = PROMPT_LIBRARY[promptId];
  if (!prompt) {
    throw new Error(`Prompt not found: ${promptId}`);
  }
  return prompt;
}

export function listPromptDefinitions(): PromptDefinition[] {
  return Object.values(PROMPT_LIBRARY);
}

export function resolvePrompt(promptId: string, payload: unknown): import("../types").ResolvedPrompt {
  const prompt = getPromptDefinition(promptId);
  const payloadJson = JSON.stringify(payload ?? {}, null, 2);

  return {
    ...prompt,
    systemRendered: prompt.system,
    userRendered: prompt.userTemplate.replace("{{payload}}", payloadJson),
  };
}

/** Default prompt id per Atlas task type. */
export const TASK_PROMPT_IDS: Record<import("../types").AtlasTaskType, string> = {
  "knowledge.write": "knowledge.write.v1",
  "knowledge.review": "knowledge.review.v1",
  "recipe.write": "recipe.write.v1",
  "recipe.review": "recipe.review.v1",
  "recipe.validate": "recipe.validate.v1",
  "visual.generate": "visual.generate.v1",
  "visual.diagram": "visual.diagram.v1",
  "visual.infographic": "visual.infographic.v1",
  "research.search": "research.search.v1",
  "research.summarize": "research.summarize.v1",
  "fact.check": "factcheck.review.v1",
  translate: "translation.prepare.v1",
  "seo.optimize": "seo.optimize.v1",
  "link.build": "link.build.v1",
  "quality.score": "quality.score.v1",
  "writing.improve": "writing.improve.v1",
  "prompt.generate": "prompt.generate.v1",
  "quiz.create": "quiz.create.v1",
};
