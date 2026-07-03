/** Modular knowledge model — each section is optional per recipe. */

export interface AboutKnowledge {
  history: string;
  origin: string;
  character: string;
  goodFor: string;
}

export interface FlourTypeKnowledge {
  id: string;
  name: string;
  percentage: number;
  protein: string;
  glutenStrength: string;
  waterAbsorption: string;
  fermentationSpeed: string;
  flavorProfile: string;
  whyWeUseIt: string;
}

export interface FlourScienceKnowledge {
  overview: string;
  flours: FlourTypeKnowledge[];
}

export interface HydrationScienceKnowledge {
  whyThisHydration: string;
  lowerHydrationEffect: string;
  higherHydrationEffect: string;
  handling: string;
  ovenSpring: string;
  crumb: string;
  crust: string;
}

export interface StarterScienceKnowledge {
  whyThisPercentage: string;
  lessStarterEffect: string;
  moreStarterEffect: string;
  planningImpact: string;
  flavorImpact: string;
}

export interface FermentationScienceKnowledge {
  bulkFermentation: string;
  coldFermentation: string;
  biology: string;
  whyTheseTimes: string;
}

export interface ScienceTopic {
  term: string;
  explanation: string;
}

export interface DoughbertScienceKnowledge {
  introduction: string;
  topics: ScienceTopic[];
}

export interface CommonMistake {
  mistake: string;
  cause: string;
  solution: string;
}

export interface TroubleshootingItem {
  problem: string;
  possibleCause: string;
  solution: string;
}

export interface DidYouKnowItem {
  title: string;
  fact: string;
}

/**
 * Extensible recipe knowledge container.
 * Recipes may include any subset of sections — the UI renders only what is present.
 */
export interface RecipeKnowledge {
  about?: AboutKnowledge;
  flourScience?: FlourScienceKnowledge;
  hydrationScience?: HydrationScienceKnowledge;
  starterScience?: StarterScienceKnowledge;
  fermentationScience?: FermentationScienceKnowledge;
  doughbertScience?: DoughbertScienceKnowledge;
  commonMistakes?: CommonMistake[];
  troubleshooting?: TroubleshootingItem[];
  doughbertTips?: string[];
  didYouKnow?: DidYouKnowItem[];
}
