import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

export const PATENTBLOEM_DOUGHBERT_ADVICE = [
  { goal: "Wit brood", choice: "⭐ Uitstekende keuze" },
  { goal: "Beginners", choice: "⭐⭐⭐⭐⭐" },
  { goal: "Broodjes", choice: "⭐⭐⭐⭐⭐" },
  { goal: "Zuurdesem", choice: "⭐⭐⭐⭐" },
  { goal: "Veelzijdigheid", choice: "⭐⭐⭐⭐⭐" },
] as const;

export const patentbloemKnowledgeBite = defineKnowledgeBite({
  slug: "patentbloem",
  categoryId: "meel-bloem",
  title: "Patentbloem",
  libraryOrder: 6,
  subcategory: "Nederlandse meelsoort",
  status: "published",
  metadata: {
    subtitle:
      "De sterke Nederlandse witte bloem voor luchtige broden en krachtige degen",
    difficulty: "beginner",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["Patentbloem", "Broodbloem", "Tarwebloem", "Brood", "Zuurdesem"],
    relatedRecipes: ["wit-busbrood", "country-loaf", "baguette"],
    relatedKnowledge: [
      "tarwebloem",
      "t65",
      "volkorenmeel",
      "tipo-00",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
      "country-loaf",
      "baguette",
    ],
    relatedTips: ["plakken-deeg-rusten", "brood-plakkerig-rusten"],
  },
  content: {
    summary:
      "Patentbloem is een fijne, witte tarwebloem die bekendstaat om haar goede bakeigenschappen. Dankzij het relatief hoge eiwitgehalte en de sterke glutenontwikkeling is patentbloem bijzonder geschikt voor luchtige broden, broodjes en andere gistdegen.\n\nVeel thuisbakkers denken dat patentbloem hetzelfde is als gewone tarwebloem. Dat is niet helemaal juist. Patentbloem wordt doorgaans gemaakt van de meest hoogwaardige delen van de tarwekorrel en is speciaal geselecteerd voor toepassingen waarbij een sterk glutennetwerk gewenst is.\n\nVoor wie in Nederland brood bakt, is patentbloem een uitstekende basis. Toch kiezen veel zuurdesembakkers tegenwoordig ook voor Franse meelsoorten zoals T65 vanwege hun rijkere smaak en ambachtelijke karakter.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "Patentbloem is een witte tarwebloem die wordt gemalen uit het binnenste deel van de tarwekorrel: het endosperm.\n\nTijdens het malen worden vrijwel alle zemelen en de kiem verwijderd. Hierdoor ontstaat een lichte bloem die gemakkelijk gluten vormt en een luchtig bakresultaat geeft.\n\nIn Nederland wordt patentbloem vaak gebruikt voor brood, broodjes, pizzadeeg en luxe gistdegen.\n\nHoewel de naam \"patentbloem\" in Nederland veel voorkomt, is het geen internationale standaard zoals het Franse T-systeem of de Italiaanse Tipo-classificatie.",
        relatedKnowledge: ["tarwebloem"],
      }),
      createStandardSection("properties", {
        body: "",
        table: {
          caption: "Eigenschappen van patentbloem",
          headers: ["Eigenschap", "Patentbloem"],
          rows: [
            ["Type", "Nederlandse witte tarwebloem"],
            ["Wateropname", "Gemiddeld tot hoog"],
            ["Glutenontwikkeling", "Sterk"],
            ["Vezelgehalte", "Laag"],
            ["Kleur", "Wit"],
            ["Smaak", "Mild"],
            ["Verwerking", "Zeer gemakkelijk"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor patentbloem?",
        body:
          "Patentbloem is sterk, betrouwbaar en breed verkrijgbaar.\n\nDankzij de goede glutenontwikkeling levert patentbloem een mooie ovenspring, een luchtige kruim, een stevige deegstructuur en een deeg dat prettig verwerkt.\n\nDaardoor is patentbloem voor veel Nederlandse thuisbakkers jarenlang dé standaard geweest voor brood.",
        keyPoints: [],
        relatedKnowledge: [],
      }),
      createStandardSection("science", {
        body:
          "Patentbloem bevat voornamelijk het zetmeelrijke endosperm van de tarwekorrel.\n\nHier bevinden zich ook de eiwitten glutenine en gliadine.\n\nWanneer water wordt toegevoegd en het deeg wordt gemengd, vormen deze eiwitten samen gluten.\n\nDit glutennetwerk houdt tijdens de fermentatie koolstofdioxide vast.\n\nHoe sterker dit netwerk, hoe groter de kans op een luchtig brood met een mooie ovenspring.\n\nOmdat patentbloem weinig zemeldeeltjes bevat, wordt het glutennetwerk nauwelijks onderbroken.",
        relatedKnowledge: ["glutenontwikkeling", "fermentatie"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Patentbloem neemt gemiddeld tot veel water op.\n\nVoor de meeste broden ligt een hydratatie tussen 65% en 72% prettig.\n\nBij sterkere patentbloemen kan dit oplopen tot ongeveer 75%, afhankelijk van het eiwitgehalte en het recept.\n\nVoeg water altijd geleidelijk toe en laat het deeg voldoende rusten voordat je extra bloem toevoegt.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "Patentbloem is uitstekend geschikt voor:",
        keyPoints: [
          "Wit brood",
          "Sandwichbrood",
          "Baguettes",
          "Broodjes",
          "Focaccia",
          "Pizza",
          "Luxe gistdegen",
        ],
        relatedKnowledge: ["wit-busbrood", "country-loaf", "baguette", "focaccia"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "T65 wanneer je een klassiek Frans zuurdesembrood wilt met meer smaak.",
          "T80 voor een rustieker brood.",
          "Volkorenmeel wanneer je meer vezels en voedingswaarde zoekt.",
          "Tipo 00 voor authentieke Napolitaanse pizza.",
        ],
        relatedKnowledge: ["t65", "t80", "volkorenmeel", "tipo-00"],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk patentbloem met andere veelgebruikte witte bloemen.",
        comparisonTable: {
          caption: "Tarwebloem vs Patentbloem vs T65",
          headers: ["Eigenschap", "Tarwebloem", "Patentbloem", "T65"],
          rows: [
            ["Brood", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Smaak", "⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐"],
            ["Gluten", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐"],
            ["Luchtigheid", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐"],
            ["Beginners", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met patentbloem werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Denken dat patentbloem hetzelfde is als tarwebloem",
            cause:
              "Hoewel beide wit zijn, is patentbloem doorgaans sterker en beter geschikt voor brood.",
            solution:
              "Kies patentbloem voor brood en tarwebloem voor allround bakken.",
          },
          {
            mistake: "Alleen naar de naam kijken",
            cause:
              "Niet iedere patentbloem heeft dezelfde kwaliteit.",
            solution:
              "Controleer, als de fabrikant het vermeldt, ook het eiwitpercentage.",
          },
          {
            mistake: "Verwachten dat patentbloem hetzelfde smaakt als T65",
            cause:
              "Patentbloem levert vaak een neutralere smaak op.",
            solution:
              "Voor meer karakter kiezen veel zuurdesembakkers voor Franse bloemsoorten.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Wil je een brood dat zowel luchtig als smaakvol is? Meng dan eens 70% patentbloem met 30% T65. Je profiteert van de sterke glutenontwikkeling van patentbloem én de rijkere smaak van T65.",
        keyPoints: [],
        relatedKnowledge: ["t65", "tarwebloem"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is patentbloem hetzelfde als tarwebloem?",
            answer:
              "Niet helemaal. Patentbloem is meestal sterker en wordt specifiek gebruikt voor brood en andere degen die een goed glutennetwerk nodig hebben.",
          },
          {
            question: "Is patentbloem geschikt voor zuurdesem?",
            answer:
              "Ja. Veel thuisbakkers bakken uitstekende zuurdesembroden met patentbloem. Voor een klassiek Frans karakter wordt echter vaak T65 gebruikt.",
          },
          {
            question: "Kan ik patentbloem gebruiken voor pizza?",
            answer:
              "Ja. Voor veel pizzastijlen werkt patentbloem prima. Voor een authentieke Napolitaanse pizza kiezen de meeste bakkers voor Tipo 00.",
          },
          {
            question: "Is patentbloem beter dan T65?",
            answer:
              "Niet beter, maar anders. Patentbloem blinkt uit in luchtigheid en gebruiksgemak. T65 biedt doorgaans meer smaak en een ambachtelijker karakter.",
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
            title: "Oorsprong van de naam",
            fact:
              "De naam \"patentbloem\" komt oorspronkelijk uit de tijd waarin molens hun fijnste en zuiverste bloem als een kwaliteitsproduct op de markt brachten. Tegenwoordig blijft het een van de populairste bloemsoorten voor thuisbakkers in Nederland.",
          },
        ],
      }),
    ],
    doughbertAdvice: [...PATENTBLOEM_DOUGHBERT_ADVICE],
    doughbertAdviceHeaders: ["Doel", "Advies"],
    doughbertAdviceNote:
      "Wil je starten met brood bakken? Dan is patentbloem een veilige en vergevingsgezinde keuze. Zodra je meer ervaring hebt, kun je experimenteren met T65 of een combinatie van verschillende meelsoorten voor meer smaak.",
  },
});
