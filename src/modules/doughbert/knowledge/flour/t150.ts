import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

import { FRENCH_FLOUR_DOUGHBERT_ADVICE } from "./flourAdvice";

export const t150KnowledgeBite = defineKnowledgeBite({
  slug: "t150",
  categoryId: "meel-bloem",
  title: "T150",
  libraryOrder: 5,
  subcategory: "Franse bloem",
  status: "published",
  metadata: {
    subtitle: "De meest complete Franse volkorenbloem voor voedzame en karaktervolle zuurdesembroden",
    difficulty: "advanced",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["T150", "Volkoren", "Franse bloem", "Zuurdesem", "Gezond brood"],
    relatedRecipes: ["volkoren", "meergranen", "pain-de-campagne"],
    relatedKnowledge: [
      "t65",
      "t80",
      "t110",
      "t130",
      "volkoren",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
      "autolyse",
      "coil-fold",
    ],
    relatedTips: ["brood-plakkerig-rusten", "plakken-natte-handen", "brood-koude-keuken"],
  },
  content: {
    summary:
      "T150 is de meest complete Franse tarwebloem. Vrijwel de volledige graankorrel wordt mee vermalen, waardoor alle zemelen, kiem en voedingsstoffen behouden blijven.\n\nHierdoor levert T150 voedzame broden op met veel vezels, een diepe graansmaak en een donkere kruim. Tegelijkertijd is het één van de meest uitdagende meelsoorten om mee te werken. Het deeg neemt veel water op, ontwikkelt minder gemakkelijk een sterk glutennetwerk en vraagt meer tijd tijdens de fermentatie.\n\nVoor bakkers die een écht volkoren zuurdesembrood willen maken is T150 de ultieme keuze.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "T150 is een Franse volkorenbloem die wordt ingedeeld op basis van het mineraalgehalte (asgehalte).\n\nHet typenummer 150 betekent dat vrijwel de volledige graankorrel behouden blijft tijdens het malen.\n\nIn tegenstelling tot lichtere bloemsoorten bevat T150 de zemel, de kiem en het endosperm. Daardoor is T150 rijk aan voedingsstoffen, vezels, vitaminen en mineralen.\n\nBinnen het Franse classificatiesysteem wordt T150 beschouwd als de meest complete tarwebloem.",
      }),
      createStandardSection("properties", {
        body: "Het eiwitpercentage verschilt per molen en zegt niet alles over de sterkte van het deeg.",
        table: {
          caption: "Eigenschappen van T150",
          headers: ["Eigenschap", "T150"],
          rows: [
            ["Type", "Franse volkorenbloem"],
            ["Asgehalte", "± 1,40–1,70%"],
            ["Eiwitpercentage", "meestal 11–14%*"],
            ["Wateropname", "Zeer hoog"],
            ["Glutenontwikkeling", "Uitdagend"],
            ["Kleur", "Donkerbruin"],
            ["Smaak", "Vol, krachtig en uitgesproken graanachtig"],
            ["Verwerking", "Gevorderd"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor T150?",
        body:
          "T150 wordt gekozen vanwege de smaak én de voedingswaarde.\n\nDoordat vrijwel de hele graankorrel behouden blijft, bevat T150 aanzienlijk meer vezels, mineralen en vitamines dan lichtere bloemsoorten.\n\nVeel thuisbakkers gebruiken T150 om voedzamere broden te bakken, een diepe graansmaak te creëren en een stevig rustiek brood te maken.\n\nVaak wordt T150 gecombineerd met T65 of T80 om een betere balans tussen luchtigheid en smaak te krijgen.",
        keyPoints: [],
        relatedKnowledge: ["volkoren", "t65", "t80"],
      }),
      createStandardSection("science", {
        body:
          "T150 bevat de grootste hoeveelheid zemeldeeltjes van alle Franse tarwebloemen.\n\nDeze zemeldeeltjes nemen veel water op en bevatten veel enzymen en voedingsstoffen.\n\nTegelijkertijd werken de scherpe zemeldeeltjes als kleine onderbrekingen in het glutennetwerk. Hierdoor ontwikkelt gluten zich langzamer, blijft minder gas gevangen en ontstaat een compactere kruim.\n\nDaarnaast fermenteren volkorenbroden vaak sneller doordat er meer voedingsstoffen beschikbaar zijn voor gisten en melkzuurbacteriën.\n\nDe uitdaging is daarom niet alleen voldoende gluten ontwikkelen, maar ook de fermentatie goed onder controle houden.",
        relatedKnowledge: ["glutenontwikkeling", "fermentatie"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "T150 behoort tot de bloemsoorten met de hoogste wateropname.\n\nVoor de meeste zuurdesembroden ligt een hydratatie tussen 78% en 90%.\n\nLaat het deeg voldoende rusten zodat de zemeldeeltjes het water volledig kunnen opnemen.\n\nEen autolyse van 30 tot 60 minuten is hierbij sterk aan te raden.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie", "autolyse"],
      }),
      createStandardSection("when-to-use", {
        body: "T150 is ideaal voor:",
        keyPoints: [
          "Volkoren zuurdesembrood",
          "Gezonde desembroden",
          "Meergranenbrood",
          "Rustieke vloerbroden",
          "Broden met veel zaden en pitten",
        ],
        relatedKnowledge: ["volkoren", "meergranen"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "T65 wanneer je een luchtig brood wilt.",
          "T80 wanneer je meer smaak zoekt zonder veel luchtigheid te verliezen.",
          "T110 wanneer je een mild volkoren karakter wilt.",
          "T130 wanneer je veel smaak wilt maar nog niet volledig volkoren wilt bakken.",
        ],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk T150 met andere donkere Franse bloemen.",
        comparisonTable: {
          caption: "T110 vs T130 vs T150",
          headers: ["Eigenschap", "T110", "T130", "T150"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Voedingswaarde", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Luchtigheid", "⭐⭐", "⭐⭐", "⭐"],
            ["Moeilijkheid", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met T150 werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Te weinig water gebruiken",
            cause: "Volkorenbloem neemt veel meer water op dan witte bloem.",
            solution: "Een droog deeg leidt vaak tot een compact eindresultaat.",
          },
          {
            mistake: "Geen autolyse toepassen",
            cause:
              "Door het hoge vezelgehalte profiteert T150 enorm van een autolyse.",
            solution:
              "Hierdoor kunnen de vezels alvast water opnemen voordat de fermentatie begint.",
          },
          {
            mistake: "Te veel kneden",
            cause:
              "Een langdurige intensieve kneedbeurt levert bij T150 vaak weinig extra glutenvorming op.",
            solution: "Rustmomenten en vouwtechnieken zijn meestal effectiever.",
          },
          {
            mistake: "Een extreem open kruim verwachten",
            cause:
              "Volkorenbrood zal vrijwel altijd compacter zijn dan een wit zuurdesembrood.",
            solution: "Dat hoort bij de eigenschappen van T150.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Wil je profiteren van de voedingswaarde van T150 zonder een zwaar brood te bakken?\n\nBegin met 10 tot 20% T150 in combinatie met T65 of T80.\n\nZo leer je hoe het deeg reageert en bouw je ervaring op voordat je volledig volkoren gaat bakken.",
        keyPoints: [],
        relatedKnowledge: ["t65", "t80"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is T150 hetzelfde als volkorenmeel?",
            answer:
              "Ja, T150 wordt binnen het Franse classificatiesysteem beschouwd als volkorenbloem.",
          },
          {
            question: "Waarom rijst mijn deeg minder goed?",
            answer:
              "De zemeldeeltjes verstoren het glutennetwerk waardoor minder gas wordt vastgehouden. Dat is een normale eigenschap van volkorenbrood.",
          },
          {
            question: "Kan ik 100% T150 gebruiken?",
            answer:
              "Ja. Houd er wel rekening mee dat het deeg meer water, meer rust en meer aandacht nodig heeft.",
          },
          {
            question: "Waarom wordt T150 vaak gemengd met T65?",
            answer:
              "Omdat T65 extra glutensterkte toevoegt waardoor het brood luchtiger wordt terwijl T150 zorgt voor smaak en voedingswaarde.",
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
              "De graankiem in T150 bevat natuurlijke oliën die bijdragen aan smaak en voedingswaarde. Daardoor bederft volkorenbloem ook sneller dan witte bloem. Bewaar T150 daarom koel, droog en goed afgesloten.",
          },
        ],
      }),
    ],
    doughbertAdvice: FRENCH_FLOUR_DOUGHBERT_ADVICE,
  },
});
