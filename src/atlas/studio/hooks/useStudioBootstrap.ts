import { useEffect, useState } from "react";

import { bootstrapAtlasStudio } from "../core/bootstrap";

export function useStudioBootstrap() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    bootstrapAtlasStudio();
    setReady(true);
  }, []);

  return ready;
}
