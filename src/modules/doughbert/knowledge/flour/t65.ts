import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

import { FRENCH_FLOUR_DOUGHBERT_ADVICE } from "./flourAdvice";

export const t65KnowledgeBite = defineKnowledgeBite({
  slug: "t65",
  categoryId: "meel-bloem",
  title: "T65",
  libraryOrder: 1,
  subcategory: "Franse bloem",
  status: "published",
  metadata: {
    subtitle: "De Franse basisbloem voor luchtig zuurdesembrood",
    difficulty: "beginner",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["T65", "Franse bloem", "Zuurdesem", "Baguette", "Pain de Campagne"],
    relatedRecipes: ["pain-de-campagne", "country-loaf", "baguette", "wit-busbrood"],
    relatedKnowledge: [
      "t80",
      "t130",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
      "stretch-and-fold",
      "pain-de-campagne",
    ],
    relatedTips: ["brood-koud-water", "brood-plakkerig-rusten"],
  },
  content: {
    summary:
      "T65 is de meest gebruikte Franse tarwebloem voor wit en licht brood. Het typenummer verwijst naar het mineraalgehalte van de bloem: T65 bevat relatief weinig delen van de buitenste lagen van de graankorrel, waardoor het deeg luchtig, soepel en voorspelbaar blijft.\n\nVoor thuisbakkers is T65 vaak het startpunt. Het levert een open kruim, een milde tarwesmaak en een deeg dat vergevingsgezind is tijdens autolyse, vouwen en rijzen.\n\nVeel Doughbert-recepten combineren T65 met T80 of T130 voor extra smaak — maar T65 blijft de betrouwbare basis waarop je kunt bouwen.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "T65 is een Franse tarwebloem die wordt ingedeeld op basis van het asgehalte (mineraalgehalte). Hoe lager het typenummer, hoe witter en lichter de bloem doorgaans is.\n\nIn vergelijking met T80 of T110 bevat T65 minder zemeldeeltjes. Daardoor ontwikkelt het deeg sneller een sterk glutennetwerk en voelt het tijdens het kneden vaak soepeler aan.\n\nT65 is geen patentbloem en geen bread flour — het is een eigen Franse classificatie. Elke molen kan T65 net iets anders malen, maar de rol in de keuken blijft hetzelfde: een veelzijdige basisbloem voor dagelijks zuurdesembrood.",
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor T65?",
        body:
          "T65 is populair omdat het vergevingsgezind is. Beginners krijgen sneller een deeg dat niet meteen plakt of scheurt, terwijl gevorderde bakkers T65 gebruiken als stabiele basis in blends.\n\nTypische toepassingen:",
        keyPoints: [
          "Baguette en wit brood",
          "Pain de Campagne (vaak 50% T65)",
          "Country loaf en lichte zuurdesembroden",
          "Blends met T80 of volkoren voor extra smaak",
        ],
        relatedKnowledge: ["pain-de-campagne", "baguette"],
      }),
      createStandardSection("properties", {
        body: "Het exacte eiwitpercentage verschilt per molen en producent.",
        table: {
          caption: "Eigenschappen van T65",
          headers: ["Eigenschap", "T65"],
          rows: [
            ["Type", "Franse tarwebloem"],
            ["Asgehalte", "± 0,55–0,65%"],
            ["Eiwitpercentage", "meestal 10–11%*"],
            ["Wateropname", "Gemiddeld"],
            ["Glutenontwikkeling", "Snel en voorspelbaar"],
            ["Kleur", "Licht / wit"],
            ["Smaak", "Mild tarwekarakter"],
            ["Verwerking", "Toegankelijk voor beginners"],
          ],
        },
        keyPoints: [],
      }),
      createStandardSection("science", {
        body:
          "Doordat T65 vooral uit het endosperm van de graankorrel bestaat, bevat het relatief veel zetmeel en eiwit in een evenwichtige verhouding. Dat maakt het deeg elastisch en makkelijk te vormen.\n\nT65 neemt minder water op dan T80 of T110. Hierdoor voelt een deeg met dezelfde hydratatiepercentage vaak steviger en droger aan dan bij hogere typenummers — ook al is het percentage identiek.\n\nT65 reageert snel op fermentatie: gisten en melkzuurbacteriën krijgen voldoende voeding zonder dat zemeldeeltjes het glutennetwerk verstoren. Dat maakt T65 ideaal voor open kruim en luchtige structuren.",
        relatedKnowledge: ["glutenontwikkeling", "fermentatie", "hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "T65 is uitstekend geschikt voor:",
        keyPoints: [
          "Luchtige zuurdesembroden",
          "Baguette en wit busbrood",
          "Pain de Campagne en country-style blends",
          "Recepten waarbij je maximale openheid wilt",
          "Eerste stappen met zuurdesem bakken",
        ],
      }),
      createStandardSection("when-not-to-use", {
        body: "T65 is niet altijd de beste keuze. Kies liever:",
        keyPoints: [
          "T80 of T110 wanneer je meer graansmaak wilt",
          "T130 of volkoren voor een robuust, vol karakter",
          "Tipo 00 voor Napolitaanse pizza",
          "Bread flour wanneer je een recept specifiek daarop baseert",
        ],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk T65 met andere Franse bloemen om sneller de juiste keuze te maken.",
        comparisonTable: {
          caption: "T65 vs T80 vs T130",
          headers: ["Eigenschap", "T65", "T80", "T130"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Luchtigheid", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
            ["Zemeldeeltjes", "Weinig", "Meer", "Veel"],
            ["Geschikt voor beginners", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met T65 werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Hydratatie van T80 of T110 kopiëren",
            cause:
              "T65 neemt minder water op. Een te hoge hydratatie maakt het deeg onnodig slap.",
            solution:
              "Start met het hydratatiepercentage uit je recept en pas geleidelijk aan op basis van je molen en keukentemperatuur.",
          },
          {
            mistake: "Te veel extra bloem toevoegen tijdens het kneden",
            cause:
              "T65-deeg voelt in eerste instantie vaak steviger dan je verwacht.",
            solution:
              "Geef autolyse en rustmomenten de tijd — het water wordt geleidelijk opgenomen.",
          },
          {
            mistake: "Alle T65 als identiek behandelen",
            cause:
              "Verschillende molens malen T65 met net andere eiwit- en absorptiewaarden.",
            solution:
              "Leer je deeg observeren in plaats van alleen het label te volgen.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Begin met 100% T65 als je zuurdesem nog onvoorspelbaar voelt. Zodra je deeg consistent rijst en vormt, vervang dan 20 tot 30% door T80 voor meer smaak zonder je techniek opnieuw te moeten leren.",
        keyPoints: [],
        relatedKnowledge: ["t80"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is T65 hetzelfde als patentbloem?",
            answer:
              "Nee. Patentbloem volgt een andere classificatie. T65 verwijst naar het Franse asgehalte en gedraagt zich anders qua absorptie en smaak.",
          },
          {
            question: "Kan ik T65 vervangen door bread flour?",
            answer:
              "Soms, maar smaak, wateropname en rijsing veranderen merkbaar. Pas hydratatie en rijtijd bewust aan.",
          },
          {
            question: "Is T65 geschikt voor beginners?",
            answer:
              "Ja. T65 is een van de meest toegankelijke meelsoorten om zuurdesem brood mee te leren bakken.",
          },
          {
            question: "Waarom staat T65 in zoveel Doughbert-recepten?",
            answer:
              "Omdat het een betrouwbare basis levert: luchtig, voorspelbaar en perfect te combineren met rijkere meelsoorten.",
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
            title: "Franse extractwaarden",
            fact:
              "Het T-getal verwijst naar het mineraalgehalte van de bloem, niet direct naar de kleur. T65 is daardoor witter dan T80, maar niet per se \"fijner\" gemalen.",
          },
          {
            title: "Blend power",
            fact:
              "Veel ambachtelijke bakkers gebruiken T65 nooit alleen — een mix met T80 of T130 geeft vaak het beste van beide werelden: luchtigheid én smaak.",
          },
        ],
      }),
    ],
    doughbertAdvice: FRENCH_FLOUR_DOUGHBERT_ADVICE,
  },
});
