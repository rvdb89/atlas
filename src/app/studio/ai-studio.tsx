import { useReducer } from "react";

import BulkGeneratePanel from "@/components/studio/BulkGeneratePanel";
import ModelOrchestrationPanel from "@/components/studio/ModelOrchestrationPanel";
import PipelineFlowBanner from "@/components/studio/PipelineFlowBanner";
import StudioLayout from "@/components/studio/StudioLayout";

export default function StudioAiStudioScreen() {
  const [, refresh] = useReducer((value) => value + 1, 0);

  return (
    <StudioLayout
      title="AI Studio"
      subtitle="Laat het AI Team complete categorieën produceren — jij reviewt als Editor-in-Chief."
    >
      <PipelineFlowBanner />
      <ModelOrchestrationPanel />
      <BulkGeneratePanel onGenerated={refresh} />
    </StudioLayout>
  );
}
