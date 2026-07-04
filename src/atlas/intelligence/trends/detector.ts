import type { IntelligenceAnalyzer } from "../engine/types";
import type { AnalyzerResult, IntelligenceContext } from "../types";
import { listMetricSnapshots } from "../metrics/store";
import { storeTrend } from "./store";
import type { TrendDetectionReport, TrendDirection } from "./types";

function detectDirection(recent: number, previous: number): { direction: TrendDirection; changePercent: number } {
  if (previous === 0 && recent === 0) return { direction: "stable", changePercent: 0 };
  if (previous === 0) return { direction: "up", changePercent: 100 };
  const changePercent = Math.round(((recent - previous) / previous) * 100);
  if (Math.abs(changePercent) < 5) return { direction: "stable", changePercent };
  return { direction: changePercent > 0 ? "up" : "down", changePercent };
}

export const trendDetectionAnalyzer: IntelligenceAnalyzer<TrendDetectionReport> = {
  id: "trends.detector",
  category: "trends",
  label: "Trend Detector",

  analyze(context): AnalyzerResult<TrendDetectionReport> {
    const moduleId = context.scope.moduleId;
    const metricIds = ["signals.total", "content.views", "ai.executions", "quality.reports"];
    const detected: TrendDetectionReport["trends"] = [];

    for (const metricId of metricIds) {
      const snapshots = listMetricSnapshots({ metricId, moduleId, limit: 10 });
      if (snapshots.length < 2) continue;

      const recent = snapshots[0]?.value ?? 0;
      const previous = snapshots[1]?.value ?? 0;
      const { direction, changePercent } = detectDirection(recent, previous);

      detected.push(
        storeTrend({
          metricId,
          direction,
          changePercent,
          windowLabel: "latest vs previous snapshot",
          detectedAt: context.now,
          moduleId,
        }),
      );
    }

    const rising = detected.filter((entry) => entry.direction === "up").length;
    const summary =
      detected.length === 0
        ? "Onvoldoende metriekgeschiedenis voor trenddetectie."
        : `${rising} van ${detected.length} metrics stijgen in de huidige scope.`;

    return {
      analyzerId: "trends.detector",
      category: "trends",
      generatedAt: context.now,
      confidence: detected.length > 0 ? 0.7 : 0.25,
      data: {
        generatedAt: context.now,
        trends: detected,
        summary,
      },
    };
  },
};
