import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

export const SEMOLA_DOUGHBERT_ADVICE = [
  { goal: "Pizza bestuiven", choice: "⭐ Uitstekende keuze" },
  { goal: "Verse pasta", choice: "⭐ Uitstekende keuze" },
  { goal: "Napolitaanse pizza", choice: "⭐⭐⭐⭐" },
  { goal: "Brood", choice: "⭐⭐⭐" },
  { goal: "Beginners", choice: "⭐⭐⭐⭐⭐" },
] as const;

export const semolaRimacinataKnowledgeBite = defineKnowledgeBite({
  slug: "semola-rimacinata",
  categoryId: "meel-bloem",
  title: "Semola Rimacinata",
  libraryOrder: 12,
  subcategory: "Italiaanse meelsoort",
  status: "published",
  metadata: {
    subtitle:
      "De fijn gemalen durumtarwe voor pizza, pasta en ambachtelijke Italiaanse broden",
    difficulty: "beginner",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["Semola Rimacinata", "Durum", "Pizza", "Pasta", "Italiaanse bloem"],
    relatedRecipes: ["napolitaanse-pizza", "focaccia"],
    relatedKnowledge: [
      "tipo-00",
      "hydratatie",
      "glutenontwikkeling",
      "napolitaanse-pizza",
      "focaccia",
      "pizza-lanceren",
    ],
    relatedTips: ["pizza-semola-schep", "plakken-semola-pizza", "pizza-niet-te-dun"],
  },
  content: {
    summary:
      "Semola Rimacinata is een fijn gemalen meel dat wordt gemaakt van durumtarwe. In tegenstelling tot gewone tarwe heeft durum een andere eiwitsamenstelling, een goudgele kleur en een karakteristieke volle smaak.\n\nSemola Rimacinata wordt veel gebruikt voor verse pasta, traditionele Italiaanse broden en als bestuiving bij het vormen en bakken van pizza's.\n\nBinnen Doughbert gebruiken we Semola Rimacinata vooral om pizzadeeg gemakkelijk te verwerken zonder dat het aan het werkblad of de pizzaschep blijft plakken.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "Semola Rimacinata wordt gemaakt van durumtarwe (Triticum durum).\n\nDurum is een andere tarwesoort dan de zachte tarwe waarvan T65 of Tipo 00 worden gemaakt.\n\nHet woord Semola betekent griesmeel. Rimacinata betekent letterlijk \"opnieuw gemalen\".\n\nDaardoor ontstaat een veel fijner meel dan gewone semola, waardoor het geschikt is voor brood, pizza en pasta.",
      }),
      createStandardSection("properties", {
        body: "",
        table: {
          caption: "Eigenschappen van Semola Rimacinata",
          headers: ["Eigenschap", "Semola Rimacinata"],
          rows: [
            ["Type", "Fijn gemalen durumtarwe"],
            ["Wateropname", "Gemiddeld"],
            ["Glutenontwikkeling", "Sterk maar minder rekbaar"],
            ["Kleur", "Goudgeel"],
            ["Smaak", "Vol, licht zoet en nootachtig"],
            ["Verwerking", "Prettig"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor Semola Rimacinata?",
        body:
          "Semola Rimacinata geeft deeg een unieke smaak en textuur.\n\nDaarnaast heeft het een belangrijke praktische eigenschap: het plakt veel minder snel dan gewone bloem.\n\nDaarom gebruiken veel pizzabakkers Semola Rimacinata om de pizzaschep te bestuiven, het werkblad te bestuiven en deeg uit te rekken.\n\nHierdoor schuift een pizza gemakkelijker van de schep de oven in.",
        keyPoints: [],
        relatedKnowledge: ["pizza-lanceren", "napolitaanse-pizza"],
      }),
      createStandardSection("science", {
        body:
          "Durumtarwe bevat sterke gluten, maar deze gedragen zich anders dan de gluten van gewone broodtarwe.\n\nHet deeg wordt stevig en elastisch, maar is vaak iets minder rekbaar.\n\nDaardoor wordt Semola Rimacinata zelden als enige meelsoort gebruikt voor Napolitaanse pizza. In plaats daarvan wordt het vaak gecombineerd met Tipo 00.\n\nOok de grovere structuur van de meelkorrels zorgt ervoor dat het deeg minder snel aan oppervlakken blijft kleven. Dat maakt Semola Rimacinata ideaal als bestuivingsmeel.",
        relatedKnowledge: ["tipo-00", "glutenontwikkeling"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Semola Rimacinata neemt gemiddeld water op.\n\nWanneer het wordt gemengd met Tipo 00 ligt een hydratatie tussen 60% en 70% vaak prettig.\n\nGebruik je een hoog percentage Semola? Dan kan iets meer water nodig zijn.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie", "tipo-00"],
      }),
      createStandardSection("when-to-use", {
        body: "Semola Rimacinata is ideaal voor:",
        keyPoints: [
          "Verse pasta",
          "Pizza",
          "Bestuiven van de pizzaschep",
          "Bestuiven van het werkblad",
          "Italiaanse vloerbroden",
          "Focaccia",
        ],
        relatedKnowledge: ["napolitaanse-pizza", "focaccia"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "Tipo 00 als hoofdbloem voor Napolitaanse pizza.",
          "T65 voor zuurdesembrood.",
          "Volkorenmeel wanneer voedingswaarde belangrijker is.",
          "Roggemeel voor een uitgesproken graansmaak.",
        ],
        relatedKnowledge: ["tipo-00", "t65", "volkorenmeel", "rogge"],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk Semola Rimacinata met andere veelgebruikte meelsoorten.",
        comparisonTable: {
          caption: "Tipo 00 vs Semola Rimacinata vs T65",
          headers: ["Eigenschap", "Tipo 00", "Semola Rimacinata", "T65"],
          rows: [
            ["Pizza", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
            ["Pasta", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐"],
            ["Brood", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Bestuiven", "⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐"],
            ["Smaak", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met Semola Rimacinata werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Denken dat Semola hetzelfde is als Tipo 00",
            cause:
              "Het zijn twee totaal verschillende meelsoorten met een andere oorsprong en andere eigenschappen.",
            solution:
              "Gebruik Tipo 00 als hoofdbloem en Semola vooral als bestuiving of aanvulling.",
          },
          {
            mistake: "Te veel Semola gebruiken op de pizzaschep",
            cause: "Een dun laagje is voldoende.",
            solution:
              "Te veel Semola kan tijdens het bakken verbranden en een bittere smaak geven.",
          },
          {
            mistake: "100% Semola gebruiken voor Napolitaanse pizza",
            cause:
              "Dat kan, maar levert een heel ander deeg op dan de klassieke Napolitaanse stijl.",
            solution:
              "Voor de meeste recepten is een hoogwaardige Tipo 00 geschikter als hoofdbloem.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Bestrooi je pizzaschep licht met Semola Rimacinata voordat je de pizza erop legt.\n\nDoor de grove structuur glijdt de pizza veel gemakkelijker de oven in dan wanneer je gewone bloem gebruikt.",
        keyPoints: [],
        relatedKnowledge: ["pizza-lanceren", "tipo-00"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is Semola hetzelfde als Semola Rimacinata?",
            answer:
              "Nee. Semola is grover gemalen. Semola Rimacinata is fijner gemalen en daardoor beter geschikt voor brood, pizza en pasta.",
          },
          {
            question: "Kan ik Semola vervangen door gewone bloem?",
            answer:
              "Ja, maar gewone bloem plakt sneller en geeft niet dezelfde smaak en textuur.",
          },
          {
            question: "Waarom gebruikt Doughbert Semola op de pizzaschep?",
            answer:
              "Omdat het deeg hierdoor gemakkelijker schuift en minder snel blijft plakken.",
          },
          {
            question: "Is Semola glutenvrij?",
            answer: "Nee. Semola wordt gemaakt van durumtarwe en bevat gluten.",
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
            title: "Pane di Altamura",
            fact:
              "De beroemde Pane di Altamura, een traditioneel Italiaans brood met een beschermde oorsprongsbenaming (DOP), wordt gemaakt van durumtarwe en staat bekend om zijn goudgele kruim en rijke smaak.",
          },
        ],
      }),
    ],
    doughbertAdvice: [...SEMOLA_DOUGHBERT_ADVICE],
    doughbertAdviceHeaders: ["Doel", "Advies"],
    doughbertAdviceNote:
      "Heb je maar één zak Semola Rimacinata in huis? Gebruik hem dan vooral om je pizzaschep en werkblad te bestuiven. Dat maakt het werken met pizzadeeg direct een stuk makkelijker.",
  },
});
