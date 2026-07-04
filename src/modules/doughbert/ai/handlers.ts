import { getActiveModule } from "@/atlas/publishing/plugin/registry";
import { factCheckerAgent, linkEngineAgent, translatorAgent } from "@/atlas/publishing/agents/coreAgents";
import type { GenerationBrief, PublicationDraft, SupportedLocale } from "@/atlas/publishing/types";
import { registerTaskHandler } from "@/atlas/ai/tasks/handlerRegistry";
import type { AiProviderRequest } from "@/atlas/ai/providers/types";
import { buildCopywriterOutput } from "./copywriterOutput";
import { doughbertDomainValidatorAgent } from "../agents/domain-validator/DomainValidatorAgent";
import { doughbertVisualDesignerAgent } from "../agents/visual-designer/VisualDesignerAgent";

async function handlerResponse<T>(output: T) {
  return { output, metadata: { source: "doughbert-stub-handler" } };
}

export function registerDoughbertAiHandlers(): void {
  registerTaskHandler("knowledge.write", async (request: AiProviderRequest) => {
    const { brief } = request.payload as { brief: GenerationBrief };
    return handlerResponse(buildCopywriterOutput(brief));
  });

  registerTaskHandler("recipe.write", async (request: AiProviderRequest) => {
    const { brief } = request.payload as { brief: GenerationBrief };
    return handlerResponse(buildCopywriterOutput(brief));
  });

  registerTaskHandler("visual.generate", async (request: AiProviderRequest) => {
    const payload = request.payload as {
      brief: GenerationBrief;
      title: string;
      slug: string;
      contentType: GenerationBrief["contentType"];
    };
    const result = await doughbertVisualDesignerAgent.generateAssets(payload);
    return handlerResponse(result.output);
  });

  registerTaskHandler("visual.diagram", async () => handlerResponse([]));
  registerTaskHandler("visual.infographic", async () => handlerResponse([]));

  registerTaskHandler("research.search", async (request) => {
    const { topic, keywords } = request.payload as { topic: string; keywords?: string[] };
    return handlerResponse({ topic, keywords: keywords ?? [topic], sources: [] });
  });

  registerTaskHandler("research.summarize", async () => handlerResponse("Research summary stub."));

  registerTaskHandler("fact.check", async (request) => {
    const { draft } = request.payload as { draft: PublicationDraft };
    const result = await factCheckerAgent.review({ draft });
    return handlerResponse(result.output);
  });

  registerTaskHandler("knowledge.review", async () => handlerResponse({ validated: true }));

  registerTaskHandler("seo.optimize", async (request) => {
    const { draft } = request.payload as { draft: PublicationDraft };
    return handlerResponse({
      title: draft.seo.title,
      description: draft.seo.description,
      tags: draft.seo.tags,
    });
  });

  registerTaskHandler("link.build", async (request) => {
    const module = getActiveModule();
    const payload = request.payload as {
      slug: string;
      title: string;
      tags: string[];
      categoryId?: string;
    };
    const result = await linkEngineAgent.buildGraph({
      ...payload,
      existingArticles: module.getArticleCatalog(),
    });
    return handlerResponse(result.output);
  });

  registerTaskHandler("translate", async (request) => {
    const payload = request.payload as {
      draft: PublicationDraft;
      targetLocales: SupportedLocale[];
    };
    const result = await translatorAgent.prepareTranslations(payload);
    return handlerResponse(result.output);
  });

  registerTaskHandler("recipe.validate", async (request) => {
    const { draft } = request.payload as { draft: PublicationDraft };
    const result = await doughbertDomainValidatorAgent.validate({ draft });
    return handlerResponse(result.output);
  });

  registerTaskHandler("recipe.review", async () => handlerResponse({ reviewed: true }));
  registerTaskHandler("quality.score", async () => handlerResponse({ score: 85, passed: true }));
  registerTaskHandler("writing.improve", async () => handlerResponse({ improved: true }));
  registerTaskHandler("prompt.generate", async () => handlerResponse({ prompt: "Generated prompt stub" }));
  registerTaskHandler("quiz.create", async () => handlerResponse({ questions: [] }));
}
