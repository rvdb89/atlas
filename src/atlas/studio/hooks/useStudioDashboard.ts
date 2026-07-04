import { useEffect, useMemo, useState } from "react";

import { publicationStore } from "../store/publicationStore";
import { studioDataService } from "../services/studioDataService";
import { loadStudioIntelligence } from "../core/mockData";
import type { StudioDashboardStats } from "../types";

export function useStudioDashboard() {
  const [stats, setStats] = useState<StudioDashboardStats>(() => studioDataService.getDashboardStats());
  const [gapCount, setGapCount] = useState(0);
  const module = useMemo(() => studioDataService.getActiveModule(), []);

  useEffect(() => {
    const refresh = () => setStats(studioDataService.getDashboardStats());
    refresh();

    const unsub = publicationStore.subscribe(refresh);
    loadStudioIntelligence().then((run) => {
      const gapResult = run.results.find((entry) => entry.category === "content-gaps");
      const gaps = (gapResult?.data as { gaps?: unknown[] })?.gaps ?? [];
      setGapCount(gaps.length);
      setStats({ ...studioDataService.getDashboardStats(), contentGaps: gaps.length });
    });

    return () => {
      unsub();
    };
  }, []);

  return { stats, module, gapCount };
}
