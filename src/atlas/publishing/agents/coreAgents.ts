import type {
  AgentResult,
  ArticleCatalogEntry,
  GenerationBrief,
  LinkGraph,
  LinkGraphNode,
  PublicationDraft,
  QualityIssue,
  QualityReport,
  SupportedLocale,
  TranslationBundle,
} from "../types";
import { getActiveModule } from "../plugin/registry";
import { SUPPORTED_LOCALES } from "../types";

export type CopywriterOutput = {
  title: string;
  subtitle: string;
  slug: string;
  contentPayload?: unknown;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
};

export type FactCheckerInput = {
  draft: PublicationDraft;
};

export type LinkEngineInput = {
  slug: string;
  title: string;
  tags: string[];
  categoryId?: string;
  existingArticles: ArticleCatalogEntry[];
};

export type TranslatorInput = {
  draft: PublicationDraft;
  targetLocales: SupportedLocale[];
};

export type DomainValidatorInput = {
  draft: PublicationDraft;
};

export type CopywriterAgentContract = {
  id: string;
  generate(brief: GenerationBrief): Promise<AgentResult<CopywriterOutput>>;
};

export type VisualDesignerAgentContract = {
  id: string;
  generateAssets(input: {
    brief: GenerationBrief;
    title: string;
    slug: string;
    contentType: GenerationBrief["contentType"];
  }): Promise<AgentResult<import("../types").VisualAssetBrief[]>>;
};

export type FactCheckerAgentContract = {
  id: string;
  review(input: FactCheckerInput): Promise<AgentResult<QualityReport>>;
};

export type LinkEngineAgentContract = {
  id: string;
  buildGraph(input: LinkEngineInput): Promise<AgentResult<LinkGraph>>;
};

export type TranslatorAgentContract = {
  id: string;
  prepareTranslations(input: TranslatorInput): Promise<AgentResult<TranslationBundle>>;
};

export type DomainValidatorAgentContract = {
  id: string;
  validate(input: DomainValidatorInput): Promise<AgentResult<import("../types").DomainValidationReport>>;
};

function getPayloadSummary(draft: PublicationDraft): string | undefined {
  const payload = draft.contentPayload as { content?: { summary?: string } } | undefined;
  return payload?.content?.summary;
}

function checkCompleteness(draft: PublicationDraft): QualityIssue[] {
  const issues: QualityIssue[] = [];

  if (!draft.title.trim()) {
    issues.push({
      id: "missing-title",
      severity: "critical",
      category: "completeness",
      message: "Title is missing.",
      field: "title",
    });
  }

  if (!draft.subtitle.trim()) {
    issues.push({
      id: "missing-subtitle",
      severity: "warning",
      category: "completeness",
      message: "Subtitle is missing.",
      field: "subtitle",
    });
  }

  const summary = getPayloadSummary(draft);
  if (draft.contentPayload && (summary?.trim().length ?? 0) === 0) {
    issues.push({
      id: "missing-summary",
      severity: "warning",
      category: "completeness",
      message: "Summary is empty.",
      field: "content.summary",
    });
  }

  if (draft.visuals.length === 0) {
    issues.push({
      id: "missing-visuals",
      severity: "warning",
      category: "completeness",
      message: "No visual briefs generated.",
    });
  }

  return issues;
}

function checkSeo(draft: PublicationDraft): QualityIssue[] {
  const issues: QualityIssue[] = [];

  if (draft.seo.tags.length < 2) {
    issues.push({
      id: "seo-tags",
      severity: "suggestion",
      category: "seo",
      message: "Add at least 2 tags for discoverability.",
      field: "seo.tags",
    });
  }

  if (draft.seo.description.length < 40) {
    issues.push({
      id: "seo-description",
      severity: "suggestion",
      category: "seo",
      message: "Meta description is short — aim for 120–160 characters.",
      field: "seo.description",
    });
  }

  return issues;
}

function checkLinks(draft: PublicationDraft): QualityIssue[] {
  if (!draft.linkGraph || draft.linkGraph.nodes.length === 0) {
    return [
      {
        id: "no-links",
        severity: "warning",
        category: "links",
        message: "No internal links found.",
      },
    ];
  }

  return [];
}

function scoreFromIssues(issues: QualityIssue[]): number {
  let score = 100;

  for (const issue of issues) {
    if (issue.severity === "critical") score -= 25;
    if (issue.severity === "warning") score -= 8;
    if (issue.severity === "suggestion") score -= 3;
  }

  return Math.max(0, Math.min(100, score));
}

export class FactCheckerAgent implements FactCheckerAgentContract {
  id = "fact-checker-v1";

  async review(input: FactCheckerInput) {
    const started = Date.now();
    const issues = [
      ...checkCompleteness(input.draft),
      ...checkSeo(input.draft),
      ...checkLinks(input.draft),
    ];

    const score = scoreFromIssues(issues);
    const report: QualityReport = {
      score,
      passed: score >= 75 && !issues.some((i) => i.severity === "critical"),
      issues,
      checkedAt: new Date().toISOString(),
    };

    return {
      agent: this.id,
      durationMs: Date.now() - started,
      output: report,
      warnings: score < 75 ? ["Quality score below threshold."] : [],
    };
  }
}

export const factCheckerAgent = new FactCheckerAgent();

export class TranslatorAgent implements TranslatorAgentContract {
  id = "translator-v1";

  async prepareTranslations(input: TranslatorInput) {
    const started = Date.now();
    const bundle: TranslationBundle = {
      nl: {
        status: "ready",
        title: input.draft.title,
        summary: getPayloadSummary(input.draft) ?? input.draft.subtitle,
      },
    };

    for (const locale of input.targetLocales) {
      if (locale === "nl") {
        continue;
      }

      bundle[locale] = {
        status: "pending",
        title: `[${locale.toUpperCase()}] ${input.draft.title}`,
        summary: `[${locale.toUpperCase()}] ${input.draft.subtitle}`,
      };
    }

    return {
      agent: this.id,
      durationMs: Date.now() - started,
      output: bundle,
      warnings: ["Stub translator — connect TextGenerationProvider per locale."],
    };
  }
}

export const translatorAgent = new TranslatorAgent();

export function defaultTranslationTargets(): SupportedLocale[] {
  return SUPPORTED_LOCALES.filter((locale) => locale !== "nl");
}

export class LinkEngineAgent implements LinkEngineAgentContract {
  id = "link-engine-v1";

  async buildGraph(input: LinkEngineInput) {
    const started = Date.now();
    const module = getActiveModule();
    const catalog = input.existingArticles.length
      ? input.existingArticles
      : module.getArticleCatalog();

    const source: ArticleCatalogEntry = {
      slug: input.slug,
      title: input.title,
      categoryId: input.categoryId ?? module.defaultLinkCategoryId,
      tags: input.tags,
      relationTags: input.tags,
    };

    const slugs = module.resolveRelatedSlugs(source, catalog);

    const nodes: LinkGraphNode[] = slugs.map((slug) => {
      const match = catalog.find((article) => article.slug === slug);
      return {
        slug,
        title: match?.title ?? slug,
        score: 1,
        reason: "Shared tags and terminology",
      };
    });

    return {
      agent: this.id,
      durationMs: Date.now() - started,
      output: {
        nodes,
        generatedAt: new Date().toISOString(),
      } satisfies LinkGraph,
      warnings: [],
    };
  }
}

export const linkEngineAgent = new LinkEngineAgent();
