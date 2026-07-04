import type { IntelligenceContext } from "../types";
import type { AnalyzerResult } from "../types";
import type { IntelligenceAnalyzer } from "../engine/types";
import { listMetricDefinitions, recordMetricSnapshot } from "./store";
import type { MetricsSummary } from "./types";

function countSignals(context: IntelligenceContext, type: string): number {
  return context.signals.filter((signal) => signal.type === type).length;
}

export const metricsAnalyzer: IntelligenceAnalyzer<MetricsSummary> = {
  id: "metrics.collector",
  category: "metrics",
  label: "Metrics Collector",

  analyze(context): AnalyzerResult<MetricsSummary> {
    const totals = {
      signals: context.signals.length,
      contentViews: countSignals(context, "content.view"),
      aiExecutions: countSignals(context, "ai.execution"),
      qualityReports: countSignals(context, "quality.report"),
    };

    const metrics = [
      recordMetricSnapshot({ metricId: "signals.total", value: totals.signals, moduleId: context.scope.moduleId }),
      recordMetricSnapshot({ metricId: "content.views", value: totals.contentViews, moduleId: context.scope.moduleId }),
      recordMetricSnapshot({ metricId: "ai.executions", value: totals.aiExecutions, moduleId: context.scope.moduleId }),
      recordMetricSnapshot({ metricId: "quality.reports", value: totals.qualityReports, moduleId: context.scope.moduleId }),
    ];

    return {
      analyzerId: "metrics.collector",
      category: "metrics",
      generatedAt: context.now,
      confidence: context.signals.length > 0 ? 0.9 : 0.3,
      data: {
        generatedAt: context.now,
        metrics,
        totals,
      },
      metadata: {
        registeredMetrics: listMetricDefinitions().length,
      },
    };
  },
};
