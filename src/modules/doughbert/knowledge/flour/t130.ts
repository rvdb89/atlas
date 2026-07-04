import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

import { FRENCH_FLOUR_DOUGHBERT_ADVICE } from "./flourAdvice";

export const t130KnowledgeBite = defineKnowledgeBite({
  slug: "t130",
  categoryId: "meel-bloem",
  title: "T130",
  libraryOrder: 4,
  subcategory: "Franse bloem",
  status: "published",
  metadata: {
    subtitle: "De Franse complete bloem voor diepe smaak, donkere kruim en rustieke zuurdesembroden",
    difficulty: "intermediate",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["T130", "Franse bloem", "Complete bloem", "Volkoren", "Zuurdesem", "Pain de Campagne"],
    relatedRecipes: ["pain-de-campagne", "donker-volkoren", "meergranen"],
    relatedKnowledge: [
      "t65",
      "t80",
      "t110",
      "t150",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
      "pain-de-campagne",
      "donker-volkoren",
      "meergranen",
      "coil-fold",
    ],
    relatedTips: ["plakken-natte-handen", "brood-plakkerig-rusten", "plakken-deeg-rusten"],
  },
  content: {
    summary:
      "T130 is een Franse complete bloem met veel karakter. In vergelijking met T65, T80 en T110 bevat T130 meer delen van de oorspronkelijke graankorrel. Daardoor krijgt brood meer smaak, een donkerdere kruim, meer vezels en een uitgesproken rustiek karakter.\n\nT130 is krachtig, maar ook minder vergevingsgezind dan lichtere bloemsoorten. De extra zemeldeeltjes nemen veel water op en kunnen het glutennetwerk verstoren. Daarom wordt T130 vaak niet als enige bloem gebruikt, maar als onderdeel van een meelmix.\n\nIn Doughbert gebruiken we T130 bijvoorbeeld in Pain de Campagne als smaakmaker: genoeg om diepte en karakter te geven, maar niet zoveel dat het brood zwaar wordt.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "T130 is een Franse tarwebloem die wordt ingedeeld op basis van het mineraalgehalte, ook wel asgehalte genoemd.\n\nHoe hoger het typenummer, hoe meer delen van de graankorrel zijn mee vermalen.\n\nBij T130 zijn veel zemel- en aleurondeeltjes behouden gebleven. Hierdoor bevat de bloem meer vezels, mineralen en natuurlijke enzymen dan T65, T80 en T110.\n\nT130 zit dicht tegen volkorenmeel aan en wordt vaak gebruikt voor complete, donkere en rustieke broden.",
      }),
      createStandardSection("properties", {
        body: "Het exacte eiwitpercentage verschilt per molen en producent.",
        table: {
          caption: "Eigenschappen van T130",
          headers: ["Eigenschap", "T130"],
          rows: [
            ["Type", "Franse complete bloem"],
            ["Asgehalte", "± 1,20–1,40%"],
            ["Eiwitpercentage", "meestal 11–13%*"],
            ["Wateropname", "Zeer hoog"],
            ["Glutenontwikkeling", "Gemiddeld tot uitdagend"],
            ["Kleur", "Donker crème tot lichtbruin"],
            ["Smaak", "Diep, graanachtig, licht nootachtig"],
            ["Verwerking", "Uitdagender dan T65/T80"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor T130?",
        body:
          "T130 geeft brood een diepe, volle smaak.\n\nWaar T65 vooral zorgt voor luchtigheid en structuur, zorgt T130 voor karakter. Zelfs een klein percentage T130 kan een brood merkbaar meer diepte geven.\n\nDaarom gebruiken veel bakkers T130 als smaakmaker in een meelmix.\n\nBijvoorbeeld:",
        keyPoints: [
          "50% T65",
          "40% T80",
          "10% T130",
          "Deze verhouding geeft Pain de Campagne een rijke smaak zonder dat het brood te zwaar wordt.",
        ],
        relatedKnowledge: ["pain-de-campagne"],
      }),
      createStandardSection("science", {
        body:
          "T130 bevat veel meer delen van de buitenste graankorrel dan lichtere bloemsoorten.\n\nDie delen bevatten vezels, mineralen en enzymen.\n\nDe vezels nemen veel water op. Daardoor kan een deeg met T130 in het begin stevig aanvoelen, maar na rust juist zachter worden.\n\nDe enzymen helpen zetmeel af te breken tot suikers. Die suikers voeden de gisten en melkzuurbacteriën tijdens de fermentatie.\n\nTegelijkertijd kunnen zemeldeeltjes het glutennetwerk verstoren. Ze werken als kleine onderbrekingen in het deegnetwerk. Daardoor wordt het lastiger om een zeer open kruim te krijgen.\n\nDaarom vraagt T130 om voldoende hydratatie, voldoende rust, zorgvuldige glutenontwikkeling, zachte vouwtechnieken en realistische verwachtingen over kruim en volume.",
        relatedKnowledge: ["glutenontwikkeling", "fermentatie", "hydratatie", "coil-fold"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "T130 neemt veel water op.\n\nVoor broden waarin T130 een deel van de bloemmix is, ligt de hydratatie vaak tussen 74% en 82%.\n\nBij een hoog aandeel T130 kan nog meer water nodig zijn.\n\nLet op: voeg niet meteen al het water toe. Geef het deeg eerst tijd om het water op te nemen.\n\nEen deeg met T130 verandert vaak duidelijk tijdens de eerste 30 tot 60 minuten rust.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "T130 is uitstekend geschikt voor:",
        keyPoints: [
          "Pain de Campagne",
          "Donkere zuurdesembroden",
          "Meergranenbroden",
          "Volkorenachtige broden",
          "Rustieke vloerbroden",
          "Broden met diepe graansmaak",
        ],
        relatedKnowledge: ["pain-de-campagne", "donker-volkoren", "meergranen"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Kies liever:",
        keyPoints: [
          "T65 wanneer je maximale luchtigheid wilt.",
          "T80 wanneer je rustieke smaak wilt met betere verwerkbaarheid.",
          "T110 wanneer je meer karakter wilt, maar T130 nog te zwaar vindt.",
          "T150 wanneer je volledig integraal wilt bakken.",
          "Tipo 00 voor Napolitaanse pizza.",
          "Tarwebloem voor sterke of verrijkte degen.",
        ],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk T130 met andere Franse bloemen om sneller de juiste keuze te maken.",
        comparisonTable: {
          caption: "T80 vs T110 vs T130 vs T150",
          headers: ["Eigenschap", "T80", "T110", "T130", "T150"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Luchtigheid", "⭐⭐⭐", "⭐⭐", "⭐⭐", "⭐"],
            ["Zemeldeeltjes", "Meer", "Veel", "Zeer veel", "Maximaal"],
            ["Geschikt voor beginners", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met T130 werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Te veel T130 gebruiken",
            cause: "T130 geeft veel smaak, maar kan brood ook compact maken.",
            solution: "Begin daarom met 5 tot 15% T130 in een meelmix.",
          },
          {
            mistake: "Te weinig water gebruiken",
            cause:
              "Door de hoeveelheid vezels heeft T130 meer water nodig dan lichtere bloemsoorten.",
            solution:
              "Een deeg met T130 mag in het begin steviger aanvoelen, maar moet na rust soepeler worden.",
          },
          {
            mistake: "Te hard behandelen",
            cause: "Omdat het glutennetwerk kwetsbaarder is, werkt een zachte aanpak vaak beter.",
            solution:
              "Coil folds zijn bij nattere of donkerdere degen vaak prettiger dan agressieve stretch & folds.",
          },
          {
            mistake: "Een open witte kruim verwachten",
            cause:
              "T130 geeft meer smaak en voedingswaarde, maar meestal minder luchtigheid dan T65.",
            solution: "Dat is geen fout, maar een eigenschap van deze bloem.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Gebruik T130 als smaakmaker.\n\nVoor een klassiek Pain de Campagne is 10% T130 vaak genoeg om meer diepte, kleur en karakter te geven zonder dat het brood zwaar wordt.\n\nWil je meer experimenteren? Verhoog langzaam naar 15 of 20%, maar verhoog dan ook je hydratatie en geef het deeg meer rust.",
        keyPoints: [],
        relatedKnowledge: ["pain-de-campagne", "hydratatie"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is T130 hetzelfde als volkorenmeel?",
            answer:
              "Niet helemaal. T130 bevat veel delen van de graankorrel en komt dicht bij volkorenmeel, maar T150 wordt meestal gezien als de meest integrale Franse bloem.",
          },
          {
            question: "Waarom maakt T130 mijn deeg plakkeriger?",
            answer:
              "T130 bevat meer vezels en zemeldeeltjes. Die nemen veel water op en beïnvloeden de glutenontwikkeling. Daardoor voelt het deeg anders aan dan een deeg met T65.",
          },
          {
            question: "Kan ik 100% T130 gebruiken?",
            answer:
              "Dat kan, maar verwacht een compacter brood met een stevigere kruim en minder ovenspring. Voor beginners is een mix met T65 of T80 vaak prettiger.",
          },
          {
            question: "Waarom gebruiken we maar 10% T130 in Pain de Campagne?",
            answer:
              "Omdat 10% genoeg is om extra smaak, kleur en diepte te geven zonder de kruim te zwaar te maken.",
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
            title: "Klein percentage, groot effect",
            fact:
              "Een klein percentage donkere bloem kan een brood veel meer karakter geven dan je verwacht. Soms verandert 10% T130 een mild brood al in een echt rustiek zuurdesembrood.",
          },
        ],
      }),
    ],
    doughbertAdvice: FRENCH_FLOUR_DOUGHBERT_ADVICE,
  },
});
