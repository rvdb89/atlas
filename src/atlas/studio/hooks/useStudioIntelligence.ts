import { useEffect, useState } from "react";

import { studioDataService } from "../services/studioDataService";
import type { StudioIntelligenceView } from "../types";

export function useStudioIntelligence() {
  const [data, setData] = useState<StudioIntelligenceView | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    studioDataService
      .getIntelligenceView()
      .then((view) => {
        if (mounted) setData(view);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, graph: data ? studioDataService.getKnowledgeGraphPlaceholder() : undefined };
}
