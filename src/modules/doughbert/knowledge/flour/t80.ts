import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

import { FRENCH_FLOUR_DOUGHBERT_ADVICE } from "./flourAdvice";

export const t80KnowledgeBite = defineKnowledgeBite({
  slug: "t80",
  categoryId: "meel-bloem",
  title: "T80",
  libraryOrder: 2,
  subcategory: "Franse bloem",
  status: "published",
  metadata: {
    subtitle: "De Franse bloem met meer smaak, karakter en voedingswaarde",
    difficulty: "beginner",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["T80", "Franse bloem", "Halfvolkoren", "Zuurdesem", "Pain de Campagne"],
    relatedRecipes: ["pain-de-campagne", "country-loaf", "meergranen"],
    relatedKnowledge: [
      "t65",
      "t130",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
      "stretch-and-fold",
      "coil-fold",
      "pain-de-campagne",
    ],
    relatedTips: ["brood-plakkerig-rusten", "plakken-natte-handen"],
  },
  content: {
    summary:
      "T80 is een Franse bloem die vaak wordt omschreven als een halfvolkoren bloem. In vergelijking met T65 bevat T80 meer delen van de buitenste lagen van de graankorrel. Hierdoor krijgt het deeg meer smaak, meer voedingsstoffen en een hogere wateropname.\n\nBroden gebakken met T80 hebben vaak een donkerdere kruim, een vollere graansmaak en een rustiek karakter. Tegelijkertijd vraagt T80 iets meer aandacht tijdens het bakken, omdat het deeg meer water opneemt en de glutenontwikkeling iets anders verloopt.\n\nVoor veel thuisbakkers is T80 de perfecte stap wanneer zij meer smaak willen zonder direct volledig volkoren te bakken.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "T80 is een Franse tarwebloem die wordt ingedeeld op basis van het mineraalgehalte (asgehalte). Het hogere typenummer betekent dat tijdens het malen meer delen van de oorspronkelijke graankorrel behouden zijn gebleven.\n\nHierdoor bevat T80 meer zemeldeeltjes, mineralen en natuurlijke enzymen dan T65.\n\nHoewel T80 vaak \"halfvolkoren\" wordt genoemd, is het geen officieel halfvolkorenmeel. Het bevindt zich qua samenstelling tussen witte broodbloem en volkorenmeel.\n\nDit maakt T80 bijzonder populair voor ambachtelijke zuurdesembroden.",
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor T80?",
        body:
          "T80 biedt een mooie balans tussen luchtigheid en smaak.\n\nDoor het hogere aandeel zemeldeeltjes ontstaat een brood met meer karakter en een diepere graansmaak dan een brood van uitsluitend T65.\n\nVeel thuisbakkers gebruiken T80 wanneer zij hun zuurdesembrood meer diepgang willen geven zonder direct volledig volkoren te bakken.\n\nEen veelgebruikte combinatie is:",
        keyPoints: [
          "50% T65",
          "40% T80",
          "10% T130",
          "Deze combinatie vormt ook de basis van een klassieke Pain de Campagne.",
        ],
        relatedKnowledge: ["pain-de-campagne"],
      }),
      createStandardSection("properties", {
        body: "Het exacte eiwitpercentage verschilt per molen en producent.",
        table: {
          caption: "Eigenschappen van T80",
          headers: ["Eigenschap", "T80"],
          rows: [
            ["Type", "Franse bloem"],
            ["Asgehalte", "± 0,75–0,90%"],
            ["Eiwitpercentage", "meestal 11–13%*"],
            ["Wateropname", "Hoog"],
            ["Glutenontwikkeling", "Goed"],
            ["Kleur", "Lichtbruin"],
            ["Smaak", "Vol, licht nootachtig"],
            ["Verwerking", "Iets uitdagender dan T65"],
          ],
        },
        keyPoints: [],
      }),
      createStandardSection("science", {
        body:
          "Doordat T80 meer delen van de graankorrel bevat, is het rijker aan enzymen, mineralen en vezels.\n\nDe extra enzymen helpen tijdens de fermentatie zetmeel af te breken tot eenvoudige suikers. Deze suikers dienen als voeding voor gisten en melkzuurbacteriën.\n\nDaarnaast nemen de aanwezige zemeldeeltjes meer water op.\n\nHierdoor voelt een T80-deeg vaak steviger aan tijdens het mengen, terwijl het uiteindelijk juist een hoger hydratatiepercentage aankan.\n\nEen belangrijk aandachtspunt is dat zemeldeeltjes het glutennetwerk enigszins kunnen verstoren. Daarom vraagt T80 vaak om een zorgvuldige glutenontwikkeling door voldoende rustmomenten en vouwtechnieken.",
        relatedKnowledge: ["glutenontwikkeling", "fermentatie"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "T80 neemt duidelijk meer water op dan T65.\n\nVoor de meeste zuurdesembroden ligt een hydratatie tussen 70% en 78% prettig.\n\nDe ideale hoeveelheid water hangt af van de gebruikte molen, het aandeel T80 in het recept, de omgevingstemperatuur en de gewenste kruim.\n\nVoeg water altijd geleidelijk toe en beoordeel het deeg tijdens het mengen.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "T80 is uitstekend geschikt voor:",
        keyPoints: [
          "Pain de Campagne",
          "Country Loaf",
          "Rustieke zuurdesembroden",
          "Meergranenbroden",
          "Ambachtelijke vloerbroden",
        ],
      }),
      createStandardSection("when-not-to-use", {
        body: "Hoewel T80 zeer veelzijdig is, is het niet altijd de beste keuze. Kies liever:",
        keyPoints: [
          "T65 wanneer je maximale luchtigheid wilt.",
          "T130 of volkorenmeel wanneer je een uitgesproken robuuste smaak zoekt.",
          "Tipo 00 voor Napolitaanse pizza.",
          "Tarwebloem voor sterke of verrijkte degen.",
        ],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk T80 met andere Franse bloemen om sneller de juiste keuze te maken.",
        comparisonTable: {
          caption: "T65 vs T80 vs T130",
          headers: ["Eigenschap", "T65", "T80", "T130"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Luchtigheid", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐"],
            ["Zemeldeeltjes", "Gemiddeld", "Meer", "Veel"],
            ["Geschikt voor beginners", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers voor het eerst met T80 werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Te weinig water gebruiken",
            cause:
              "Omdat T80 meer water opneemt dan T65, voelt het deeg in eerste instantie vaak steviger aan.",
            solution:
              "Geef het deeg voldoende tijd om het water volledig op te nemen voordat je extra bloem toevoegt.",
          },
          {
            mistake: "Te weinig rust geven",
            cause:
              "Door de aanwezige zemeldeeltjes ontwikkelt het glutennetwerk zich iets langzamer.",
            solution:
              "Voldoende rustmomenten en meerdere Stretch & Folds of Coil Folds helpen om een sterk deeg op te bouwen.",
          },
          {
            mistake: "Te veel T80 gebruiken",
            cause:
              "Een brood van 100% T80 is mogelijk, maar veel thuisbakkers vinden een combinatie met T65 prettiger.",
            solution:
              "Meng T80 met T65 voor een luchtiger brood met meer smaak — bijvoorbeeld 50% T65, 40% T80, 10% T130.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Wil je meer smaak in je brood zonder veel in te leveren op luchtigheid? Vervang dan ongeveer 30 tot 40% van je T65 door T80. Je zult direct merken dat het brood meer karakter krijgt, terwijl het deeg prettig blijft verwerken.",
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
            question: "Is T80 volkoren?",
            answer:
              "Nee. T80 bevat meer delen van de graankorrel dan T65, maar minder dan volkorenmeel.",
          },
          {
            question: "Waarom neemt T80 meer water op?",
            answer:
              "Door het hogere aandeel zemeldeeltjes en vezels kan T80 meer vocht vasthouden.",
          },
          {
            question: "Is T80 geschikt voor beginners?",
            answer:
              "Ja. Hoewel T80 iets meer aandacht vraagt dan T65, is het een uitstekende meelsoort om stap voor stap meer smaak aan je broden toe te voegen.",
          },
          {
            question: "Kan ik alleen T80 gebruiken?",
            answer:
              "Dat kan. Veel thuisbakkers kiezen echter voor een combinatie van T65 en T80 om een luchtiger brood te krijgen.",
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
            title: "T80 als smaakmaker",
            fact:
              "Veel Franse bakkers gebruiken T80 als smaakmaker in hun brood. Door slechts een deel van de T65 te vervangen door T80 krijgt een brood vaak al een duidelijk rijkere en vollere smaak.",
          },
        ],
      }),
    ],
    doughbertAdvice: FRENCH_FLOUR_DOUGHBERT_ADVICE,
  },
});
