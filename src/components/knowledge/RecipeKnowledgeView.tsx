import type { RecipeKnowledge } from "@/types/knowledge";

import AboutSection from "./AboutSection";
import CommonMistakesSection from "./CommonMistakesSection";
import DidYouKnowSection from "./DidYouKnowSection";
import FermentationSection from "./FermentationSection";
import FlourScienceSection from "./FlourScienceSection";
import HydrationSection from "./HydrationSection";
import ScienceSection from "./ScienceSection";
import StarterSection from "./StarterSection";
import TipsSection from "./TipsSection";
import TroubleshootingSection from "./TroubleshootingSection";

type RecipeKnowledgeViewProps = {
  knowledge: RecipeKnowledge;
};

export default function RecipeKnowledgeView({ knowledge }: RecipeKnowledgeViewProps) {
  return (
    <>
      {knowledge.about ? <AboutSection data={knowledge.about} /> : null}
      {knowledge.flourScience ? (
        <FlourScienceSection data={knowledge.flourScience} />
      ) : null}
      {knowledge.hydrationScience ? (
        <HydrationSection data={knowledge.hydrationScience} />
      ) : null}
      {knowledge.starterScience ? (
        <StarterSection data={knowledge.starterScience} />
      ) : null}
      {knowledge.fermentationScience ? (
        <FermentationSection data={knowledge.fermentationScience} />
      ) : null}
      {knowledge.doughbertScience ? (
        <ScienceSection data={knowledge.doughbertScience} />
      ) : null}
      {knowledge.commonMistakes?.length ? (
        <CommonMistakesSection items={knowledge.commonMistakes} />
      ) : null}
      {knowledge.troubleshooting?.length ? (
        <TroubleshootingSection items={knowledge.troubleshooting} />
      ) : null}
      {knowledge.doughbertTips?.length ? (
        <TipsSection tips={knowledge.doughbertTips} />
      ) : null}
      {knowledge.didYouKnow?.length ? (
        <DidYouKnowSection items={knowledge.didYouKnow} />
      ) : null}
    </>
  );
}
