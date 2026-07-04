import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

export const TIPO_00_DOUGHBERT_ADVICE = [
  { goal: "Napolitaanse pizza", choice: "⭐ Uitstekende keuze" },
  { goal: "Brood", choice: "⭐ Goed" },
  { goal: "Beginners", choice: "⭐⭐⭐⭐⭐" },
  { goal: "Lange fermentatie", choice: "⭐⭐⭐⭐" },
  { goal: "Veelzijdigheid", choice: "⭐⭐⭐⭐" },
] as const;

export const tipo00KnowledgeBite = defineKnowledgeBite({
  slug: "tipo-00",
  categoryId: "meel-bloem",
  title: "Tipo 00",
  libraryOrder: 11,
  subcategory: "Italiaanse meelsoort",
  status: "published",
  metadata: {
    subtitle: "De fijn gemalen Italiaanse bloem voor pizza, pasta en verfijnde degen",
    difficulty: "beginner",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["Tipo 00", "Pizza", "Napolitaans", "Italiaanse bloem", "Zuurdesem"],
    relatedRecipes: ["napolitaanse-pizza", "new-york-style-pizza", "focaccia"],
    relatedKnowledge: [
      "tarwebloem",
      "semola-rimacinata",
      "hydratatie",
      "w-waarde",
      "glutenontwikkeling",
      "napolitaanse-pizza",
      "cold-proof",
    ],
    relatedTips: ["pizza-kamertemperatuur", "temperatuur-deeg-meten", "pizza-staal-voorverwarmen"],
  },
  content: {
    summary:
      "Tipo 00 is de bekendste Italiaanse bloem en wordt wereldwijd gebruikt voor pizza, pasta en verfijnde deegsoorten. Veel mensen denken dat \"00\" iets zegt over de sterkte van de bloem, maar dat is een misverstand.\n\nHet getal verwijst uitsluitend naar de fijnheid waarmee de bloem is gemalen. Hoe sterk de bloem werkelijk is, wordt bepaald door onder andere het eiwitgehalte en vooral de W-waarde.\n\nVoor Napolitaanse pizza is Tipo 00 met een passende W-waarde de standaard, omdat deze bloem een soepel deeg, een zachte cornicione en een luchtige structuur kan opleveren.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "Tipo 00 is de fijnste classificatie binnen het Italiaanse systeem voor tarwebloem.\n\nIn tegenstelling tot het Franse systeem (T65, T80 enz.) zegt Tipo 00 niets over het mineraalgehalte.\n\nOok zegt het niets over de sterkte van de bloem.\n\nHet betekent alleen dat de bloem zeer fijn is gemalen.\n\nDaardoor ontstaat een zijdezacht deeg dat prettig verwerkt en geschikt is voor uiteenlopende toepassingen.",
      }),
      createStandardSection("properties", {
        body: "",
        table: {
          caption: "Eigenschappen van Tipo 00",
          headers: ["Eigenschap", "Tipo 00"],
          rows: [
            ["Type", "Italiaanse tarwebloem"],
            ["Maling", "Zeer fijn"],
            ["Wateropname", "Gemiddeld"],
            ["Glutenontwikkeling", "Afhankelijk van de W-waarde"],
            ["Kleur", "Helder wit"],
            ["Smaak", "Mild"],
            ["Verwerking", "Zeer soepel"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen pizzabakkers voor Tipo 00?",
        body:
          "De fijne maling zorgt voor een zeer soepel deeg.\n\nHierdoor laat pizza zich gemakkelijk vormen zonder snel te scheuren.\n\nDaarnaast ontwikkelt een goede Tipo 00 tijdens een lange koude fermentatie een mooie balans tussen elasticiteit en rekbaarheid.\n\nDat maakt deze bloem ideaal voor Napolitaanse pizza.",
        keyPoints: [],
        relatedKnowledge: ["napolitaanse-pizza", "cold-proof"],
      }),
      createStandardSection("science", {
        body:
          "Een veelvoorkomend misverstand is dat Tipo 00 automatisch een sterke bloem is.\n\nDat klopt niet.\n\nDe aanduiding \"00\" zegt alleen iets over de maling.\n\nDe sterkte van de bloem wordt vooral bepaald door het eiwitpercentage, de kwaliteit van de gluten en de W-waarde.\n\nDaarom bestaan er zowel zwakke als zeer sterke Tipo 00-bloemen.\n\nVoor een lange fermentatie is een hogere W-waarde gewenst.",
        relatedKnowledge: ["w-waarde", "glutenontwikkeling"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Voor Napolitaanse pizza wordt vaak gewerkt tussen 60% en 70% hydratatie.\n\nBinnen Doughbert gebruiken we standaard:\n\n100% Tipo 00, 65% hydratatie, 10% actieve zuurdesemstarter en 2,7% zout.\n\nDeze verhouding levert een soepel deeg op dat prettig verwerkt en mooi rijst tijdens een lange koude fermentatie.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie", "napolitaanse-pizza"],
      }),
      createStandardSection("when-to-use", {
        body: "Tipo 00 is ideaal voor:",
        keyPoints: [
          "Napolitaanse pizza",
          "Pizza Napoletana Verace",
          "Verse pasta",
          "Focaccia",
          "Ciabatta",
          "Sommige zachte broodsoorten",
        ],
        relatedKnowledge: ["napolitaanse-pizza", "focaccia"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "Tarwebloem wanneer je een sterke bloem nodig hebt.",
          "T65 voor klassieke zuurdesembroden.",
          "Semola Rimacinata om deeg uit te rekken of voor bepaalde pastasoorten.",
          "T80 wanneer smaak belangrijker is dan een zeer fijne kruim.",
        ],
        relatedKnowledge: ["tarwebloem", "semola-rimacinata", "t65", "t80"],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk Tipo 00 met andere veelgebruikte bloemsoorten.",
        comparisonTable: {
          caption: "Tipo 00 vs T65 vs Tarwebloem",
          headers: ["Eigenschap", "Tipo 00", "T65", "Tarwebloem"],
          rows: [
            ["Maling", "Zeer fijn", "Gemiddeld", "Gemiddeld"],
            ["Smaak", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐"],
            ["Pizza", "⭐⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐"],
            ["Brood", "⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐"],
            ["Lange fermentatie", "⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met Tipo 00 werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Denken dat alle Tipo 00 hetzelfde is",
            cause:
              "De aanduiding \"00\" zegt alleen iets over de maling, niet over de sterkte.",
            solution:
              "Controleer altijd de W-waarde of de aanbevolen fermentatieduur van de producent.",
          },
          {
            mistake: "Alleen naar eiwitpercentage kijken",
            cause:
              "Het eiwitpercentage vertelt niet het hele verhaal over de deegsterkte.",
            solution:
              "Ook de kwaliteit van de gluten en de W-waarde bepalen hoe sterk een bloem is.",
          },
          {
            mistake: "Tipo 00 gebruiken voor ieder brood",
            cause:
              "Tipo 00 levert een mild deeg, maar minder graansmaak dan T65 of T80.",
            solution:
              "Hoewel het kan, kiezen veel zuurdesembakkers voor T65 of T80 vanwege de rijkere smaak.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Voor onze Napolitaanse pizza gebruiken we 100% Tipo 00, 65% hydratatie, 10% actieve starter en 2,7% zout.\n\nDeze combinatie geeft een soepel deeg met een mooie balans tussen elasticiteit, rekbaarheid en smaak.",
        keyPoints: [],
        relatedKnowledge: ["napolitaanse-pizza"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is Tipo 00 hetzelfde als patentbloem?",
            answer:
              "Nee. Tipo 00 is een Italiaanse classificatie op basis van maling. Patentbloem volgt een ander classificatiesysteem.",
          },
          {
            question: "Is Tipo 00 alleen geschikt voor pizza?",
            answer:
              "Nee. Ook pasta, focaccia en diverse Italiaanse broden worden vaak met Tipo 00 gemaakt.",
          },
          {
            question: "Waarom is de W-waarde belangrijk?",
            answer:
              "Omdat deze aangeeft hoeveel kracht de bloem heeft en hoe geschikt deze is voor lange fermentaties.",
          },
          {
            question: "Welke Tipo 00 gebruikt Doughbert?",
            answer:
              "Voor onze Napolitaanse pizza kiezen we een hoogwaardige Tipo 00 met een W-waarde die geschikt is voor een lange koude fermentatie.",
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
            title: "Niet elke Tipo 00 is gelijk",
            fact:
              "Twee zakken met \"Tipo 00\" kunnen zich compleet anders gedragen. De aanduiding zegt alleen iets over de maling, niet over de sterkte van de bloem. Daarom kijken professionele pizzabakkers altijd óók naar de W-waarde.",
          },
        ],
      }),
    ],
    doughbertAdvice: [...TIPO_00_DOUGHBERT_ADVICE],
    doughbertAdviceHeaders: ["Doel", "Advies"],
    doughbertAdviceNote:
      "Kijk niet alleen naar \"Tipo 00\", maar altijd ook naar de W-waarde van de bloem. Twee Tipo 00-bloemen kunnen zich totaal verschillend gedragen.",
  },
});
