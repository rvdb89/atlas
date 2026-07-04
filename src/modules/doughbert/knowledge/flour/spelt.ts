import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

export const SPELT_DOUGHBERT_ADVICE = [
  { goal: "Ambachtelijke smaak", choice: "⭐ Uitstekende keuze" },
  { goal: "Beginners", choice: "⭐⭐⭐⭐" },
  { goal: "Luchtige broden", choice: "⭐⭐⭐⭐" },
  { goal: "Lange fermentatie", choice: "⭐⭐⭐" },
  { goal: "Veelzijdigheid", choice: "⭐⭐⭐⭐" },
] as const;

export const speltKnowledgeBite = defineKnowledgeBite({
  slug: "spelt",
  categoryId: "meel-bloem",
  title: "Speltmeel",
  libraryOrder: 10,
  subcategory: "Nederlandse meelsoort",
  status: "published",
  metadata: {
    subtitle: "Het oeroude graan met een zachte nootachtige smaak en unieke bakeigenschappen",
    difficulty: "intermediate",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["Spelt", "Speltmeel", "Oergraan", "Zuurdesem", "Brood"],
    relatedRecipes: ["meergranen", "pain-de-campagne", "country-loaf"],
    relatedKnowledge: [
      "volkorenmeel",
      "t65",
      "rogge",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
      "autolyse",
      "stretch-and-fold",
      "coil-fold",
    ],
    relatedTips: ["plakken-natte-handen", "brood-plakkerig-rusten", "plakken-deeg-rusten"],
  },
  content: {
    summary:
      "Spelt is een oud graan dat al duizenden jaren wordt verbouwd. Het staat bekend om zijn milde, licht nootachtige smaak en wordt veel gebruikt voor ambachtelijke broden.\n\nHoewel spelt gluten bevat, gedragen deze gluten zich anders dan die van moderne tarwe. Speltdeeg ontwikkelt sneller een glutennetwerk, maar breekt ook sneller af wanneer het te intensief wordt gekneed.\n\nDaardoor vraagt spelt om een zachtere aanpak tijdens het bakken. Met de juiste techniek levert het prachtige broden op met een dunne krokante korst, een zachte kruim en een karakteristieke smaak.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "Spelt is een oude tarwesoort die al duizenden jaren wordt verbouwd.\n\nHoewel spelt familie is van moderne tarwe, heeft het een andere samenstelling en andere bakeigenschappen.\n\nSpeltmeel kan zowel wit als volkoren worden gemalen. Beide varianten behouden de kenmerkende milde smaak waar spelt om bekend staat.\n\nDoor zijn unieke eigenschappen is spelt populair bij thuisbakkers die willen experimenteren met traditionele granen.",
      }),
      createStandardSection("properties", {
        body: "",
        table: {
          caption: "Eigenschappen van speltmeel",
          headers: ["Eigenschap", "Speltmeel"],
          rows: [
            ["Type", "Oergraan"],
            ["Wateropname", "Gemiddeld"],
            ["Glutenontwikkeling", "Snel maar kwetsbaar"],
            ["Vezelgehalte", "Gemiddeld tot hoog"],
            ["Kleur", "Licht crème tot lichtbruin"],
            ["Smaak", "Mild, licht zoet en nootachtig"],
            ["Verwerking", "Gevoelig voor overkneden"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor spelt?",
        body:
          "Spelt geeft brood een unieke smaak die moeilijk met andere granen te vergelijken is.\n\nVeel thuisbakkers waarderen de zachte nootachtige aroma's, de dunne krokante korst, de lichte en luchtige kruim en de ambachtelijke uitstraling.\n\nDaarnaast is spelt een mooie afwisseling voor wie eens iets anders wil bakken dan een klassiek tarwebrood.",
        keyPoints: [],
        relatedKnowledge: [],
      }),
      createStandardSection("science", {
        body:
          "Spelt bevat, net als tarwe, de eiwitten glutenine en gliadine.\n\nToch vormen deze een glutennetwerk dat minder stabiel is dan bij moderne broodtarwe.\n\nDaardoor ontwikkelt speltdeeg snel elasticiteit, maar kan het bij te lang of te intensief kneden juist weer instorten.\n\nEen zachtere behandeling en voldoende rustmomenten zijn daarom belangrijker dan lang kneden.\n\nVeel speltdegen profiteren van een autolyse en enkele rustige Stretch & Folds of Coil Folds.",
        relatedKnowledge: ["glutenontwikkeling", "autolyse", "stretch-and-fold", "coil-fold"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Spelt neemt gemiddeld iets minder water op dan veel sterke tarwebloemen.\n\nVoor de meeste spelt zuurdesembroden ligt een hydratatie tussen 68% en 75% prettig.\n\nVoeg water geleidelijk toe.\n\nEen te nat speltdeeg kan snel slap worden en moeilijk zijn vorm behouden.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "Spelt is uitstekend geschikt voor:",
        keyPoints: [
          "Spelt zuurdesembrood",
          "Rustieke vloerbroden",
          "Meergranenbroden",
          "Sandwichbrood",
          "Crackers",
          "Pannenkoeken",
        ],
        relatedKnowledge: ["meergranen", "t65"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "T65 wanneer maximale glutensterkte gewenst is.",
          "Volkorenmeel wanneer voedingswaarde voorop staat.",
          "Roggemeel wanneer je een krachtige fermentatie en diepe smaak zoekt.",
          "Tipo 00 voor pizza.",
        ],
        relatedKnowledge: ["t65", "volkorenmeel", "rogge", "tipo-00"],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk spelt met andere veelgebruikte meelsoorten.",
        comparisonTable: {
          caption: "T65 vs Spelt vs Rogge",
          headers: ["Eigenschap", "T65", "Spelt", "Rogge"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Gluten", "⭐⭐⭐⭐⭐", "⭐⭐⭐", "⭐"],
            ["Luchtigheid", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐"],
            ["Moeilijkheid", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met speltmeel werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Te lang kneden",
            cause: "Spelt ontwikkelt snel gluten.",
            solution: "Lang doorkneden maakt het deeg vaak juist slapper.",
          },
          {
            mistake: "Te veel water gebruiken",
            cause:
              "Spelt voelt tijdens het mengen soms stevig aan, maar kan later snel zachter worden.",
            solution: "Voeg daarom water stap voor stap toe.",
          },
          {
            mistake: "Moderne tarwe verwachten",
            cause: "Spelt gedraagt zich anders dan gewone tarwe.",
            solution: "Pas je techniek aan en werk rustiger.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Behandel speltdeeg met beleid.\n\nWerk met korte mengtijden, voldoende rust en enkele rustige Stretch & Folds. Vaak levert dat een sterker deeg op dan intensief kneden.",
        keyPoints: [],
        relatedKnowledge: ["stretch-and-fold", "coil-fold"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Bevat spelt gluten?",
            answer:
              "Ja. Spelt bevat gluten en is daarom niet geschikt voor mensen met coeliakie.",
          },
          {
            question: "Is spelt gezonder dan tarwe?",
            answer:
              "Spelt en tarwe hebben allebei hun eigen voedingswaarde. Spelt wordt vaak gekozen vanwege de smaak en de traditionele eigenschappen, maar is niet automatisch gezonder dan moderne tarwe.",
          },
          {
            question: "Waarom voelt mijn speltdeeg slap aan?",
            answer:
              "Het glutennetwerk van spelt is kwetsbaarder en breekt sneller af bij intensief kneden.",
          },
          {
            question: "Kan ik 100% speltbrood bakken?",
            answer:
              "Ja. Houd er rekening mee dat het deeg gevoeliger is en een zachtere behandeling nodig heeft dan een tarwedeeg.",
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
            title: "Oergraan",
            fact:
              "Spelt wordt vaak een \"oergraan\" genoemd. Hoewel moderne spelt in de loop der eeuwen is doorontwikkeld, behoort het nog steeds tot de oudste graansoorten die op grote schaal worden verbouwd.",
          },
        ],
      }),
    ],
    doughbertAdvice: [...SPELT_DOUGHBERT_ADVICE],
    doughbertAdviceHeaders: ["Doel", "Advies"],
    doughbertAdviceNote:
      "Wil je voor het eerst met spelt bakken? Begin dan met een mengsel van ongeveer 30% spelt en 70% T65. Zo leer je de eigenschappen van spelt kennen zonder dat het deeg te kwetsbaar wordt.",
  },
});
