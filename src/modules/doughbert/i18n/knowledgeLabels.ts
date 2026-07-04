export type KnowledgeLocale = "nl" | "en";

export type KnowledgeLabels = {
  sections: {
    about: string;
    flourScience: string;
    hydrationScience: string;
    starterScience: string;
    fermentationScience: string;
    doughbertScience: string;
    commonMistakes: string;
    troubleshooting: string;
    doughbertTips: string;
    didYouKnow: string;
  };
  about: {
    history: string;
    origin: string;
    character: string;
    goodFor: string;
  };
  flour: {
    protein: string;
    glutenStrength: string;
    waterAbsorption: string;
    fermentationSpeed: string;
    flavorProfile: string;
    whyWeUseIt: string;
  };
  hydration: {
    whyThisHydration: string;
    lowerHydrationEffect: string;
    higherHydrationEffect: string;
    handling: string;
    ovenSpring: string;
    crumb: string;
    crust: string;
  };
  starter: {
    whyThisPercentage: string;
    lessStarterEffect: string;
    moreStarterEffect: string;
    planningImpact: string;
    flavorImpact: string;
  };
  fermentation: {
    bulkFermentation: string;
    coldFermentation: string;
    biology: string;
    whyTheseTimes: string;
  };
  commonMistakes: {
    cause: string;
    solution: string;
  };
  troubleshooting: {
    possibleCause: string;
    solution: string;
  };
};

const KNOWLEDGE_LABELS_NL: KnowledgeLabels = {
  sections: {
    about: "Over dit recept",
    flourScience: "Meel & Wetenschap",
    hydrationScience: "Hydratatie & Wetenschap",
    starterScience: "Starter uitgelegd",
    fermentationScience: "Fermentatie uitgelegd",
    doughbertScience: "Doughbert Wetenschap",
    commonMistakes: "Veelgemaakte fouten",
    troubleshooting: "Problemen oplossen",
    doughbertTips: "Doughbert tips",
    didYouKnow: "Wist je dat?",
  },
  about: {
    history: "Geschiedenis",
    origin: "Oorsprong",
    character: "Karakter",
    goodFor: "Waarvoor geschikt",
  },
  flour: {
    protein: "Eiwitpercentage",
    glutenStrength: "Glutensterkte",
    waterAbsorption: "Wateropname",
    fermentationSpeed: "Fermentatiesnelheid",
    flavorProfile: "Smaakprofiel",
    whyWeUseIt: "Waarom gebruiken we dit?",
  },
  hydration: {
    whyThisHydration: "Waarom deze hydratatie?",
    lowerHydrationEffect: "Effect van lagere hydratatie",
    higherHydrationEffect: "Effect van hogere hydratatie",
    handling: "Hantering",
    ovenSpring: "Ovenrijs",
    crumb: "Kruim",
    crust: "Korst",
  },
  starter: {
    whyThisPercentage: "Waarom dit starterpercentage?",
    lessStarterEffect: "Effect van minder starter",
    moreStarterEffect: "Effect van meer starter",
    planningImpact: "Invloed op planning",
    flavorImpact: "Invloed op smaak",
  },
  fermentation: {
    bulkFermentation: "Bulkfermentatie",
    coldFermentation: "Koude fermentatie",
    biology: "Wat gebeurt er biologisch?",
    whyTheseTimes: "Waarom deze tijden?",
  },
  commonMistakes: {
    cause: "Oorzaak",
    solution: "Oplossing",
  },
  troubleshooting: {
    possibleCause: "Mogelijke oorzaak",
    solution: "Oplossing",
  },
};

/** Placeholder for future English locale — swap activeLocale to enable. */
const KNOWLEDGE_LABELS_EN: KnowledgeLabels = {
  sections: {
    about: "About this recipe",
    flourScience: "Flour science",
    hydrationScience: "Hydration explained",
    starterScience: "Starter explained",
    fermentationScience: "Fermentation explained",
    doughbertScience: "The science behind this recipe",
    commonMistakes: "Common mistakes",
    troubleshooting: "Troubleshooting",
    doughbertTips: "Doughbert tips",
    didYouKnow: "Did you know?",
  },
  about: {
    history: "History",
    origin: "Origin",
    character: "Character",
    goodFor: "Good for",
  },
  flour: {
    protein: "Protein content",
    glutenStrength: "Gluten strength",
    waterAbsorption: "Water absorption",
    fermentationSpeed: "Fermentation speed",
    flavorProfile: "Flavor profile",
    whyWeUseIt: "Why we use this flour",
  },
  hydration: {
    whyThisHydration: "Why this hydration?",
    lowerHydrationEffect: "Effect of lower hydration",
    higherHydrationEffect: "Effect of higher hydration",
    handling: "Handling",
    ovenSpring: "Oven spring",
    crumb: "Crumb",
    crust: "Crust",
  },
  starter: {
    whyThisPercentage: "Why this starter percentage?",
    lessStarterEffect: "Effect of less starter",
    moreStarterEffect: "Effect of more starter",
    planningImpact: "Impact on planning",
    flavorImpact: "Impact on flavor",
  },
  fermentation: {
    bulkFermentation: "Bulk fermentation",
    coldFermentation: "Cold fermentation",
    biology: "What happens biologically?",
    whyTheseTimes: "Why these times?",
  },
  commonMistakes: {
    cause: "Cause",
    solution: "Solution",
  },
  troubleshooting: {
    possibleCause: "Possible cause",
    solution: "Solution",
  },
};

const KNOWLEDGE_LOCALES: Record<KnowledgeLocale, KnowledgeLabels> = {
  nl: KNOWLEDGE_LABELS_NL,
  en: KNOWLEDGE_LABELS_EN,
};

/** Active locale for knowledge UI copy. Change to "en" when English is ready. */
export const KNOWLEDGE_LOCALE: KnowledgeLocale = "nl";

export function getKnowledgeLabels(
  locale: KnowledgeLocale = KNOWLEDGE_LOCALE,
): KnowledgeLabels {
  return KNOWLEDGE_LOCALES[locale];
}

/** Shorthand for the active locale — import this in knowledge components. */
export const knowledgeLabels = getKnowledgeLabels();
