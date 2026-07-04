import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

export const VOLKORENMEEL_DOUGHBERT_ADVICE = [
  { goal: "Meest voedzame brood", choice: "⭐ Uitstekende keuze" },
  { goal: "Beginners", choice: "⭐⭐ Eerst combineren met T65" },
  { goal: "Smaak", choice: "⭐⭐⭐⭐⭐" },
  { goal: "Luchtigheid", choice: "⭐⭐" },
  { goal: "Veelzijdigheid", choice: "⭐⭐⭐⭐" },
] as const;

export const volkorenmeelKnowledgeBite = defineKnowledgeBite({
  slug: "volkorenmeel",
  categoryId: "meel-bloem",
  title: "Volkorenmeel",
  libraryOrder: 8,
  subcategory: "Nederlandse meelsoort",
  status: "published",
  metadata: {
    subtitle: "Het meest complete meel voor voedzame en smaakvolle broden",
    difficulty: "beginner",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["Volkoren", "Volkorenmeel", "Gezond brood", "Zuurdesem", "Tarwe"],
    relatedRecipes: ["donker-volkoren", "meergranen", "pain-de-campagne"],
    relatedKnowledge: [
      "t150",
      "t130",
      "t110",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
      "autolyse",
      "stretch-and-fold",
    ],
    relatedTips: ["plakken-natte-handen", "brood-plakkerig-rusten", "plakken-deeg-rusten"],
  },
  content: {
    summary:
      "Volkorenmeel wordt gemaakt van de volledige tarwekorrel. In tegenstelling tot witte bloem blijven de zemel, de kiem en het endosperm volledig behouden. Hierdoor bevat volkorenmeel meer vezels, vitamines, mineralen en smaakstoffen.\n\nDoor de aanwezigheid van zemeldeeltjes neemt volkorenmeel meer water op en ontwikkelt het glutennetwerk zich anders dan bij witte bloem. Het resultaat is een voedzaam brood met een volle graansmaak en een compactere kruim.\n\nVoor thuisbakkers is volkorenmeel dé keuze wanneer gezondheid, voedingswaarde en een rijke smaak belangrijk zijn.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "Volkorenmeel bestaat uit de volledige tarwekorrel.\n\nTijdens het malen worden geen onderdelen verwijderd. Daardoor bevat volkorenmeel de zemel, de kiem en het endosperm.\n\nJuist deze combinatie zorgt ervoor dat alle natuurlijke voedingsstoffen behouden blijven.\n\nIn Frankrijk komt T150 het dichtst in de buurt van volkorenmeel, maar de exacte samenstelling kan per molen verschillen.",
        relatedKnowledge: ["t150"],
      }),
      createStandardSection("properties", {
        body: "",
        table: {
          caption: "Eigenschappen van volkorenmeel",
          headers: ["Eigenschap", "Volkorenmeel"],
          rows: [
            ["Type", "Volledig gemalen tarwe"],
            ["Wateropname", "Zeer hoog"],
            ["Glutenontwikkeling", "Uitdagend"],
            ["Vezelgehalte", "Zeer hoog"],
            ["Kleur", "Bruin"],
            ["Smaak", "Vol, krachtig en graanachtig"],
            ["Verwerking", "Gemiddeld tot gevorderd"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor volkorenmeel?",
        body:
          "Volkorenmeel biedt de hoogste voedingswaarde van alle gangbare tarwebloemen.\n\nDoordat de volledige graankorrel behouden blijft, bevat het meer vezels, vitamines en mineralen dan witte bloem.\n\nDaarnaast geeft volkorenmeel een diepe graansmaak die veel thuisbakkers waarderen.\n\nHet is daarom een uitstekende keuze voor voedzame zuurdesembroden.",
        keyPoints: [],
        relatedKnowledge: [],
      }),
      createStandardSection("science", {
        body:
          "De zemel en kiem bevatten veel vezels en mineralen.\n\nDeze vezels nemen veel water op en beïnvloeden de structuur van het deeg.\n\nDaarnaast kunnen zemeldeeltjes het glutennetwerk gedeeltelijk onderbreken. Hierdoor ontstaat meestal een compactere kruim dan bij witte bloem.\n\nTegelijkertijd bevatten de buitenste lagen van de graankorrel veel enzymen. Deze ondersteunen de fermentatie en dragen bij aan de ontwikkeling van aroma's tijdens een lange zuurdesemfermentatie.",
        relatedKnowledge: ["glutenontwikkeling", "fermentatie"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Volkorenmeel neemt aanzienlijk meer water op dan witte bloem.\n\nVoor de meeste volkoren zuurdesembroden ligt een hydratatie tussen 75% en 90% prettig.\n\nHoe fijner het meel gemalen is, hoe anders het deeg zich kan gedragen.\n\nLaat het deeg daarom voldoende rusten zodat de vezels het water volledig kunnen opnemen.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "Volkorenmeel is uitstekend geschikt voor:",
        keyPoints: [
          "Volkoren zuurdesembrood",
          "Meergranenbrood",
          "Gezonde desembroden",
          "Rustieke vloerbroden",
          "Broden met zaden en pitten",
        ],
        relatedKnowledge: ["donker-volkoren", "meergranen"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "T65 wanneer je een luchtig brood wilt.",
          "T80 wanneer je een balans zoekt tussen smaak en luchtigheid.",
          "T130 wanneer je een rustiek brood wilt met iets meer luchtigheid dan volledig volkoren.",
          "Tipo 00 voor pizza.",
        ],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk volkorenmeel met andere tarwebloemen.",
        comparisonTable: {
          caption: "T65 vs T80 vs T150 vs Volkoren",
          headers: ["Eigenschap", "T65", "T80", "T150", "Volkoren"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Voedingswaarde", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Luchtigheid", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐", "⭐⭐"],
            ["Moeilijkheid", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met volkorenmeel werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Te weinig water gebruiken",
            cause: "Volkorenmeel heeft meer tijd én meer water nodig.",
            solution:
              "Verhoog je hydratatie geleidelijk en geef het deeg voldoende rust.",
          },
          {
            mistake: "Geen autolyse toepassen",
            cause:
              "Vezels nemen water langzaam op en maken het deeg in eerste instantie stug.",
            solution:
              "Een autolyse helpt de vezels om water op te nemen en maakt het deeg beter verwerkbaar.",
          },
          {
            mistake: "Een open witte kruim verwachten",
            cause:
              "Volkorenbrood is van nature compacter door zemeldeeltjes in het glutennetwerk.",
            solution: "Dat is geen fout, maar een eigenschap van volkorenmeel.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Gebruik volkorenmeel niet alleen vanwege de gezondheid, maar ook voor de smaak. Zelfs 15 tot 20% volkoren in een wit brood geeft al merkbaar meer diepgang en aroma.",
        keyPoints: [],
        relatedKnowledge: [],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is volkoren gezonder dan witte bloem?",
            answer:
              "Ja. Doordat de volledige graankorrel behouden blijft, bevat volkorenmeel meer vezels, vitamines en mineralen.",
          },
          {
            question: "Waarom is mijn volkorenbrood compacter?",
            answer:
              "De zemeldeeltjes verstoren het glutennetwerk en nemen veel water op. Daardoor ontstaat meestal een stevigere kruim.",
          },
          {
            question: "Kan ik 100% volkoren bakken?",
            answer:
              "Ja, maar houd rekening met een hoger hydratatiepercentage en een compacter eindresultaat.",
          },
          {
            question: "Is T150 hetzelfde als volkoren?",
            answer:
              "T150 komt zeer dicht in de buurt van volkorenmeel, maar de exacte samenstelling kan per molen verschillen.",
          },
        ],
      }),
      createKnowledgeBiteSection({
        id: "did-you-know",
        title: "Wist je dat?",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        didYouKnow: [
          {
            title: "Graankiem en houdbaarheid",
            fact:
              "Volkorenmeel bevat de kiem van de tarwekorrel. Deze is rijk aan natuurlijke oliën, waardoor volkorenmeel sneller veroudert dan witte bloem. Bewaar het daarom koel, droog en goed afgesloten.",
          },
        ],
      }),
    ],
    doughbertAdvice: [...VOLKORENMEEL_DOUGHBERT_ADVICE],
    doughbertAdviceHeaders: ["Doel", "Advies"],
    doughbertAdviceNote:
      "Wil je beginnen met volkoren? Start dan met 20 tot 30% volkorenmeel en vul de rest aan met T65. Zo leer je hoe volkoren zich gedraagt zonder direct een zwaar deeg te krijgen.",
  },
});
