import type {
  AgentResult,
  DomainValidationReport,
  PublicationDraft,
  QualitySeverity,
  ValidationDeviation,
  ValidationSubscores,
  ValidationSuggestion,
} from "@/atlas/publishing/types";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";
import { extractBakingMetrics } from "./contentAnalyzer";
import {
  BAKING_SCORE_PASS_THRESHOLD,
  BULK_HOURS_AT_24C,
  COLD_PROOF_HOURS,
  DOUGHBERT_STANDARDS_VERSION,
  FLOUR_HYDRATION_RANGES,
  REQUIRED_TERMINOLOGY,
  SALT_PERCENT,
  STARTER_PERCENT,
} from "./standards";

function deviation(
  id: string,
  severity: QualitySeverity,
  category: string,
  message: string,
  field?: string,
): ValidationDeviation {
  return { id, severity, category, message, field };
}

function suggestion(
  id: string,
  message: string,
  priority: ValidationSuggestion["priority"] = "medium",
): ValidationSuggestion {
  return { id, message, priority };
}

function scoreFromIssues(
  base: number,
  deviations: ValidationDeviation[],
  weight: QualitySeverity,
): number {
  let score = base;

  for (const item of deviations) {
    if (item.severity !== weight) {
      continue;
    }
    if (weight === "critical") score -= 20;
    if (weight === "warning") score -= 8;
    if (weight === "suggestion") score -= 3;
  }

  return Math.max(0, Math.min(100, score));
}

function validateHydration(
  metrics: ReturnType<typeof extractBakingMetrics>,
  deviations: ValidationDeviation[],
  suggestions: ValidationSuggestion[],
) {
  if (metrics.hydration === undefined) {
    deviations.push(
      deviation(
        "hydration-missing",
        "warning",
        "hydration",
        "Hydratatiepercentage niet duidelijk vermeld — voeg baker's percentages toe.",
        "hydration",
      ),
    );
    suggestions.push(
      suggestion("add-hydration", "Voeg een concreet hydratatiepercentage toe (bijv. 72%).", "high"),
    );
    return;
  }

  const flourKey = metrics.flourKeys[0] ?? "default";
  const range = FLOUR_HYDRATION_RANGES[flourKey] ?? FLOUR_HYDRATION_RANGES.default;

  if (metrics.hydration > 92) {
    deviations.push(
      deviation(
        "hydration-extreme",
        "critical",
        "hydration",
        `Hydratatie van ${metrics.hydration}% is waarschijnlijk te hoog voor de meeste thuisbakkers.`,
        "hydration",
      ),
    );
  } else if (metrics.hydration > range.max) {
    deviations.push(
      deviation(
        "hydration-high",
        "warning",
        "hydration",
        `Hydratatie van ${metrics.hydration}% ligt boven het gebruikelijke bereik voor ${range.label}.`,
        "hydration",
      ),
    );
  }

  if (
    metrics.difficulty === "beginner" &&
    metrics.hydration > range.beginnerMax
  ) {
    deviations.push(
      deviation(
        "hydration-beginner",
        "warning",
        "hydration",
        `Hydratatie van ${metrics.hydration}% is waarschijnlijk te hoog voor beginners.`,
        "hydration",
      ),
    );
  }

  if (metrics.hydration < range.min) {
    deviations.push(
      deviation(
        "hydration-low",
        "warning",
        "hydration",
        `Hydratatie van ${metrics.hydration}% lijkt laag voor ${range.label}.`,
        "hydration",
      ),
    );
  }

  if (flourKey === "t65" && metrics.hydration >= 72 && metrics.hydration <= 78) {
    // within ideal — no issue
  } else if (flourKey === "t65") {
    suggestions.push(
      suggestion(
        "t65-hydration-range",
        `${range.label} wordt normaal rond ${range.idealMin}-${range.idealMax}% gebruikt.`,
        "low",
      ),
    );
  }

  if (metrics.hydration < range.idealMax - 3 && metrics.hydration >= range.idealMin) {
    suggestions.push(
      suggestion("hydration-up", "Hydratatie kan iets omhoog voor een soepeler deeg.", "low"),
    );
  }
}

function validateSalt(metrics: ReturnType<typeof extractBakingMetrics>, deviations: ValidationDeviation[]) {
  if (metrics.saltPercent === undefined) {
    return;
  }

  if (metrics.saltPercent < SALT_PERCENT.warnMin || metrics.saltPercent > SALT_PERCENT.warnMax) {
    deviations.push(
      deviation(
        "salt-range",
        "warning",
        "salt",
        `Zoutpercentage van ${metrics.saltPercent}% valt buiten het gebruikelijke bereik (${SALT_PERCENT.idealMin}-${SALT_PERCENT.idealMax}%).`,
        "saltPercent",
      ),
    );
  }
}

function validateStarter(metrics: ReturnType<typeof extractBakingMetrics>, deviations: ValidationDeviation[]) {
  if (metrics.starterPercent === undefined) {
    return;
  }

  if (metrics.starterPercent < STARTER_PERCENT.warnMin) {
    deviations.push(
      deviation(
        "starter-low",
        "warning",
        "starter",
        `Starterpercentage van ${metrics.starterPercent}% lijkt erg laag voor zuurdesem.`,
        "starterPercent",
      ),
    );
  }

  if (metrics.starterPercent > STARTER_PERCENT.warnMax) {
    deviations.push(
      deviation(
        "starter-high",
        "warning",
        "starter",
        `Starterpercentage van ${metrics.starterPercent}% is ongebruikelijk hoog.`,
        "starterPercent",
      ),
    );
  }
}

function validateFermentation(
  metrics: ReturnType<typeof extractBakingMetrics>,
  deviations: ValidationDeviation[],
  suggestions: ValidationSuggestion[],
) {
  if (metrics.bulkHours !== undefined && metrics.bulkHours < BULK_HOURS_AT_24C.min) {
    deviations.push(
      deviation(
        "bulk-short",
        "warning",
        "fermentation",
        `Bulk fermentatie lijkt te kort (${metrics.bulkHours} uur) bij kamertemperatuur (~24°C).`,
        "bulkHours",
      ),
    );
  }

  if (!metrics.hasBulkFermentation && metrics.linkedRecipe) {
    deviations.push(
      deviation(
        "bulk-missing",
        "suggestion",
        "fermentation",
        "Bulkfermentatie wordt niet expliciet genoemd in de stappen.",
      ),
    );
  }

  if (
    metrics.coldProofHours !== undefined &&
    metrics.coldProofHours < COLD_PROOF_HOURS.min
  ) {
    deviations.push(
      deviation(
        "cold-proof-short",
        "warning",
        "fermentation",
        `Cold proof van ${metrics.coldProofHours} uur is kort — overweeg minimaal ${COLD_PROOF_HOURS.idealMin} uur.`,
        "coldProofHours",
      ),
    );
  }

  if (!metrics.hasColdProof && metrics.linkedRecipe?.category === "Brood") {
    suggestions.push(
      suggestion("add-cold-proof", "Overweeg een cold proof voor extra smaak en structuur.", "low"),
    );
  }
}

function validateTechniques(
  metrics: ReturnType<typeof extractBakingMetrics>,
  deviations: ValidationDeviation[],
  suggestions: ValidationSuggestion[],
) {
  const highHydration = (metrics.hydration ?? 0) >= 75;

  if (highHydration && !metrics.hasAutolyse) {
    deviations.push(
      deviation(
        "autolyse-missing",
        "suggestion",
        "technique",
        "Autolyse ontbreekt terwijl het recept hier waarschijnlijk van profiteert.",
      ),
    );
    suggestions.push(
      suggestion(
        "add-autolyse",
        "Autolyse zou de glutenontwikkeling verbeteren bij deze hydratatie.",
        "medium",
      ),
    );
  }

  if (highHydration && !metrics.hasStretchAndFold && !metrics.hasCoilFold) {
    suggestions.push(
      suggestion("add-coil-fold", "Overweeg een Coil Fold toe te voegen.", "medium"),
    );
  }

  if (!metrics.hasTemperatureAdvice) {
    suggestions.push(
      suggestion("add-temperature", "Temperatuuradvies ontbreekt — voeg DDT of kamertemperatuur toe.", "high"),
    );
  }

  if (metrics.stepCount > 0 && metrics.stepCount < 3) {
    deviations.push(
      deviation(
        "steps-few",
        "suggestion",
        "steps",
        "Stapvolgorde lijkt erg kort — beginners hebben meer begeleiding nodig.",
      ),
    );
    suggestions.push(suggestion("add-rest", "Voeg een rustmoment toe tussen de stappen.", "medium"));
  }
}

function getKnowledgePayload(draft: PublicationDraft): KnowledgeArticleInput | undefined {
  return draft.contentPayload as KnowledgeArticleInput | undefined;
}

function validateStandards(draft: PublicationDraft, deviations: ValidationDeviation[]) {
  const summary = getKnowledgePayload(draft)?.content?.summary ?? "";
  const text = [draft.title, draft.subtitle, summary].join(" ").toLowerCase();

  for (const term of REQUIRED_TERMINOLOGY) {
    if (draft.contentType === "tip") {
      continue;
    }
    if (!text.includes(term) && !summary.toLowerCase().includes(term)) {
      // only warn for recipe/knowledge with baking focus
      if (draft.contentType === "recipe" || draft.brief.categoryId === "brood") {
        deviations.push(
          deviation(
            `terminology-${term}`,
            "suggestion",
            "standards",
            `Doughbert-terminologie: overweeg '${term}' expliciet te noemen.`,
          ),
        );
      }
    }
  }
}

function buildSubscores(deviations: ValidationDeviation[]): ValidationSubscores {
  return {
    accuracy: scoreFromIssues(98, deviations, "critical"),
    technicalAccuracy: scoreFromIssues(97, deviations, "warning"),
    accessibility: scoreFromIssues(91, deviations, "warning"),
    consistency: scoreFromIssues(100, deviations, "critical"),
    clarity: scoreFromIssues(95, deviations, "suggestion"),
  };
}

function overallScore(subscores: ValidationSubscores): number {
  const values = Object.values(subscores);
  return Math.round(values.reduce((sum: number, value: number) => sum + value, 0) / values.length);
}

/** Doughbert Test Kitchen — domain validator for baking content. */
export class DoughbertDomainValidatorAgent {
  id = "domain-validator-v1";

  async validate(input: { draft: PublicationDraft }): Promise<AgentResult<DomainValidationReport>> {
    const started = Date.now();
    const metrics = extractBakingMetrics(input.draft);
    const deviations: ValidationDeviation[] = [];
    const suggestions: ValidationSuggestion[] = [];

    validateHydration(metrics, deviations, suggestions);
    validateSalt(metrics, deviations);
    validateStarter(metrics, deviations);
    validateFermentation(metrics, deviations, suggestions);
    validateTechniques(metrics, deviations, suggestions);
    validateStandards(input.draft, deviations);

    if (metrics.flourKeys.length === 0 && input.draft.contentType !== "tip") {
      suggestions.push(
        suggestion("flour-choice", "Specificeer een meelkeuze (bijv. T65 of Tipo 00).", "medium"),
      );
    }

    const subscores = buildSubscores(deviations);
    const overall = overallScore(subscores);
    const hasCritical = deviations.some((d) => d.severity === "critical");

    const report: DomainValidationReport = {
      overallScore: overall,
      subscores,
      passed: overall >= BAKING_SCORE_PASS_THRESHOLD && !hasCritical,
      deviations,
      suggestions,
      checkedAt: new Date().toISOString(),
      standardsVersion: DOUGHBERT_STANDARDS_VERSION,
    };

    return {
      agent: this.id,
      durationMs: Date.now() - started,
      output: report,
      warnings: report.passed
        ? []
        : ["Validatiescore onder drempel — technische review vereist voor publicatie."],
    };
  }
}

export const doughbertDomainValidatorAgent = new DoughbertDomainValidatorAgent();
