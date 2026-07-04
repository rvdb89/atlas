import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

export const ROGGE_DOUGHBERT_ADVICE = [
  { goal: "Actieve starter", choice: "⭐ Uitstekende keuze" },
  { goal: "Meer smaak", choice: "⭐⭐⭐⭐⭐" },
  { goal: "Luchtig brood", choice: "⭐⭐" },
  { goal: "Beginners", choice: "⭐⭐⭐⭐" },
  { goal: "Veelzijdigheid", choice: "⭐⭐⭐⭐" },
] as const;

export const roggeKnowledgeBite = defineKnowledgeBite({
  slug: "rogge",
  categoryId: "meel-bloem",
  title: "Roggemeel",
  libraryOrder: 9,
  subcategory: "Nederlandse meelsoort",
  status: "published",
  metadata: {
    subtitle:
      "Het karaktervolle meel dat zorgt voor diepe smaak, krachtige fermentatie en een unieke broodstructuur",
    difficulty: "intermediate",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["Roggemeel", "Rogge", "Zuurdesem", "Volkoren", "Starter"],
    relatedRecipes: ["meergranen", "pain-de-campagne", "donker-volkoren"],
    relatedKnowledge: [
      "volkorenmeel",
      "t130",
      "t150",
      "wat-is-een-starter",
      "starter-voeden",
      "fermentatie",
      "hydratatie",
      "glutenontwikkeling",
      "pain-de-campagne",
    ],
    relatedTips: ["starter-op-piek", "starter-slapp", "brood-plakkerig-rusten"],
  },
  content: {
    summary:
      "Roggemeel is een van de oudste meelsoorten ter wereld en staat bekend om zijn diepe smaak, hoge voedingswaarde en uitstekende fermentatie-eigenschappen. In tegenstelling tot tarwe vormt rogge nauwelijks een sterk glutennetwerk. Daardoor levert het compacte, sappige broden op met een rijke graansmaak.\n\nVeel thuisbakkers gebruiken roggemeel niet alleen voor brood, maar ook om hun zuurdesemstarter krachtiger en actiever te maken. Zelfs een klein percentage rogge kan de activiteit van een starter merkbaar verhogen.\n\nRoggemeel is daarom geen vervanger van tarwebloem, maar een waardevolle aanvulling die smaak, karakter en fermentatie naar een hoger niveau tilt.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "Roggemeel wordt gemalen van rogge, een graansoort die nauw verwant is aan tarwe maar zich tijdens het bakken heel anders gedraagt.\n\nRogge bevat minder glutenvormende eiwitten dan tarwe. Hierdoor ontstaat geen sterk glutennetwerk zoals bij een klassiek zuurdesembrood.\n\nIn plaats daarvan zorgen andere natuurlijke stoffen, zoals pentosanen, ervoor dat rogge veel water vasthoudt. Dit geeft roggebrood zijn kenmerkende sappige en compacte structuur.",
      }),
      createStandardSection("properties", {
        body: "",
        table: {
          caption: "Eigenschappen van roggemeel",
          headers: ["Eigenschap", "Roggemeel"],
          rows: [
            ["Type", "Meel van rogge"],
            ["Wateropname", "Zeer hoog"],
            ["Glutenontwikkeling", "Zeer beperkt"],
            ["Vezelgehalte", "Hoog"],
            ["Kleur", "Lichtgrijs tot donkergrijs"],
            ["Smaak", "Aards, licht zuur en vol"],
            ["Verwerking", "Anders dan tarwe"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor roggemeel?",
        body:
          "Roggemeel geeft brood een uitgesproken karakter.\n\nZelfs een kleine hoeveelheid zorgt al voor meer smaak, een donkerdere kruim, een sappiger brood en een actievere zuurdesemstarter.\n\nDaarom wordt rogge vaak gebruikt als aanvulling op tarwebloem.",
        keyPoints: [],
        relatedKnowledge: ["starter-voeden"],
      }),
      createStandardSection("science", {
        body:
          "Waar tarwe vooral afhankelijk is van gluten, speelt bij rogge een andere groep koolhydraten een belangrijke rol: pentosanen.\n\nPentosanen nemen grote hoeveelheden water op en zorgen voor structuur in het deeg.\n\nDaarnaast bevat rogge relatief veel natuurlijke enzymen. Hierdoor verloopt de fermentatie vaak sneller en wordt een zuurdesemstarter actiever.\n\nJuist daarom kiezen veel thuisbakkers ervoor om hun starter gedeeltelijk of volledig met roggemeel te voeden.",
        relatedKnowledge: ["fermentatie", "wat-is-een-starter"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Roggemeel neemt zeer veel water op.\n\nBij een kleine toevoeging aan een tarwedeeg hoef je meestal weinig aan te passen.\n\nBij een hoog percentage rogge kan een hydratatie van 80% tot 95% of zelfs hoger nodig zijn.\n\nLaat rogge altijd voldoende tijd krijgen om water op te nemen voordat je het deeg beoordeelt.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "Roggemeel is ideaal voor:",
        keyPoints: [
          "Roggebrood",
          "Donker zuurdesembrood",
          "Pain de Campagne",
          "Meergranenbrood",
          "Het voeden van een zuurdesemstarter",
        ],
        relatedKnowledge: ["pain-de-campagne", "meergranen", "starter-voeden"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "T65 wanneer je een luchtig brood wilt.",
          "T80 voor een rustiek brood met meer glutensterkte.",
          "Volkorenmeel wanneer je een klassiek volkorenbrood wilt.",
          "Tipo 00 voor pizza.",
        ],
        relatedKnowledge: ["volkorenmeel", "t65", "t80", "tipo-00"],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk rogge met tarwebloemen.",
        comparisonTable: {
          caption: "T65 vs Volkoren vs Rogge",
          headers: ["Eigenschap", "T65", "Volkoren", "Rogge"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Gluten", "⭐⭐⭐⭐⭐", "⭐⭐⭐", "⭐"],
            ["Starteractiviteit", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Moeilijkheid", "⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met roggemeel werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Denken dat rogge zich gedraagt als tarwe",
            cause: "Rogge vormt nauwelijks een glutennetwerk.",
            solution: "Behandel rogge als een eigen meelsoort met andere verwachtingen.",
          },
          {
            mistake: "Te weinig water gebruiken",
            cause: "Rogge neemt veel meer water op dan tarwebloem.",
            solution:
              "Een droog roggebeslag leidt vaak tot een zwaar en compact brood — verhoog hydratatie geleidelijk.",
          },
          {
            mistake: "Geen zuurdesem gebruiken",
            cause:
              "Rogge komt het beste tot zijn recht in combinatie met zuurdesem.",
            solution:
              "De zuren uit de starter helpen de structuur van het brood te verbeteren.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Voed je starter eens met 100% roggemeel.\n\nJe zult merken dat de starter vaak sneller actief wordt en krachtiger rijst. Veel ervaren thuisbakkers gebruiken daarom standaard een beetje rogge in hun voedingsschema.",
        keyPoints: [],
        relatedKnowledge: ["starter-voeden", "wat-is-een-starter"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is roggemeel hetzelfde als volkorenmeel?",
            answer:
              "Nee. Volkorenmeel wordt gemaakt van tarwe. Roggemeel wordt gemaakt van rogge en heeft totaal andere bakeigenschappen.",
          },
          {
            question: "Waarom wordt mijn starter actiever van rogge?",
            answer:
              "Rogge bevat veel enzymen en voedingsstoffen die de micro-organismen in je starter ondersteunen.",
          },
          {
            question: "Kan ik 100% roggebrood bakken?",
            answer:
              "Ja. Houd er wel rekening mee dat het resultaat compact en vochtig is en heel anders dan een tarwebrood.",
          },
          {
            question: "Waarom gebruiken we rogge in kleine hoeveelheden?",
            answer:
              "Een klein percentage rogge geeft al veel smaak en stimuleert de fermentatie, terwijl het deeg prettig verwerkbaar blijft.",
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
            title: "De roggestarter",
            fact:
              "Veel professionele zuurdesembakkers bewaren naast hun gewone starter ook een aparte roggestarter. Rogge fermenteert snel en helpt een starter krachtig en stabiel te houden.",
          },
        ],
      }),
    ],
    doughbertAdvice: [...ROGGE_DOUGHBERT_ADVICE],
    doughbertAdviceHeaders: ["Doel", "Advies"],
    doughbertAdviceNote:
      "Wij adviseren iedere thuisbakker om altijd een klein zakje roggemeel in huis te hebben. Niet alleen voor brood, maar vooral om je zuurdesemstarter extra kracht te geven.",
  },
});
