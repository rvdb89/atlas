import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

export const TARWEBLOEM_DOUGHBERT_ADVICE = [
  { goal: "Allround bakken", choice: "⭐ Uitstekende keuze" },
  { goal: "Brood", choice: "⭐⭐⭐⭐" },
  { goal: "Gebak", choice: "⭐⭐⭐⭐⭐" },
  { goal: "Beginners", choice: "⭐⭐⭐⭐⭐" },
  { goal: "Veelzijdigheid", choice: "⭐⭐⭐⭐⭐" },
] as const;

export const tarwebloemKnowledgeBite = defineKnowledgeBite({
  slug: "tarwebloem",
  categoryId: "meel-bloem",
  title: "Tarwebloem",
  libraryOrder: 7,
  subcategory: "Nederlandse meelsoort",
  status: "published",
  metadata: {
    subtitle:
      "De veelzijdige basis voor brood, pizza, gebak en talloze andere bakproducten",
    difficulty: "beginner",
    readingTimeMinutes: 7,
    lastUpdated: "2026-07-05",
    tags: ["Tarwebloem", "Bloem", "Brood", "Pizza", "Bakken"],
    relatedRecipes: ["wit-busbrood", "country-loaf", "focaccia", "napolitaanse-pizza"],
    relatedKnowledge: [
      "patentbloem",
      "t65",
      "volkorenmeel",
      "tipo-00",
      "hydratatie",
      "glutenontwikkeling",
      "fermentatie",
    ],
    relatedTips: ["plakken-deeg-rusten", "brood-plakkerig-rusten"],
  },
  content: {
    summary:
      "Tarwebloem is één van de meest gebruikte ingrediënten in de bakwereld. Vrijwel ieder brood, iedere pizza en veel soorten gebak beginnen met tarwebloem als basis.\n\nTarwebloem wordt gemaakt van de tarwekorrel waarbij de zemel en kiem grotendeels zijn verwijderd. Daardoor ontstaat een lichte bloem die gemakkelijk verwerkt en een luchtig eindresultaat geeft.\n\nNiet alle tarwebloem is hetzelfde. Het eiwitpercentage, de kwaliteit van de gluten en de manier waarop de bloem is gemalen bepalen uiteindelijk hoe een deeg zich gedraagt.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "Tarwebloem wordt gemaakt door de tarwekorrel te malen en vervolgens de meeste zemelen en de kiem uit te zeven.\n\nHierdoor blijft voornamelijk het endosperm over: het zetmeelrijke binnenste van de graankorrel.\n\nDit zorgt voor een lichte bloem die gemakkelijk een glutennetwerk kan vormen en daardoor geschikt is voor veel verschillende toepassingen.\n\nTarwebloem vormt de basis van een groot deel van de brood- en pizzabakkerij.",
      }),
      createStandardSection("properties", {
        body: "",
        table: {
          caption: "Eigenschappen van tarwebloem",
          headers: ["Eigenschap", "Tarwebloem"],
          rows: [
            ["Type", "Witte tarwebloem"],
            ["Wateropname", "Gemiddeld"],
            ["Glutenontwikkeling", "Goed"],
            ["Vezelgehalte", "Laag"],
            ["Kleur", "Wit tot licht crème"],
            ["Smaak", "Mild"],
            ["Verwerking", "Zeer gemakkelijk"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor tarwebloem?",
        body:
          "Tarwebloem is veelzijdig.\n\nHet laat zich gemakkelijk mengen, kneden en vormen.\n\nDaarnaast levert het een luchtig brood op met een zachte kruim en een mooie ovenspring.\n\nVoor beginnende thuisbakkers is tarwebloem daarom vaak de meest toegankelijke keuze.",
        keyPoints: [],
        relatedKnowledge: [],
      }),
      createStandardSection("science", {
        body:
          "Het endosperm van de tarwekorrel bevat veel zetmeel en de eiwitten glutenine en gliadine.\n\nWanneer water wordt toegevoegd en het deeg wordt gemengd, vormen deze eiwitten samen gluten.\n\nDit glutennetwerk houdt tijdens de fermentatie koolstofdioxide vast.\n\nDaardoor kan het deeg rijzen en ontstaat een luchtige broodstructuur.\n\nOmdat tarwebloem weinig zemeldeeltjes bevat, wordt het glutennetwerk nauwelijks verstoord.\n\nDat maakt tarwebloem zeer geschikt voor lichte en luchtige broden.",
        relatedKnowledge: ["glutenontwikkeling", "fermentatie"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Tarwebloem neemt gemiddeld water op.\n\nVoor de meeste broden ligt een hydratatie tussen 65% en 72% prettig.\n\nSterkere tarwebloemen kunnen vaak meer water opnemen.\n\nVoeg water altijd geleidelijk toe en beoordeel het deeg tijdens het mengen.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "Tarwebloem is geschikt voor:",
        keyPoints: [
          "Wit brood",
          "Sandwichbrood",
          "Pizza",
          "Focaccia",
          "Stokbrood",
          "Gebak",
          "Koekjes",
          "Pannenkoeken",
        ],
        relatedKnowledge: ["wit-busbrood", "country-loaf", "focaccia", "napolitaanse-pizza"],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "Patentbloem wanneer je een sterkere witte bloem voor brood zoekt.",
          "T65 voor klassieke Franse zuurdesembroden.",
          "Volkorenmeel wanneer je meer vezels en voedingswaarde wilt.",
          "Tipo 00 voor authentieke Napolitaanse pizza.",
        ],
        relatedKnowledge: ["patentbloem", "t65", "volkorenmeel", "tipo-00"],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk tarwebloem met andere veelgebruikte witte bloemen.",
        comparisonTable: {
          caption: "Tarwebloem vs Patentbloem vs T65",
          headers: ["Eigenschap", "Tarwebloem", "Patentbloem", "T65"],
          rows: [
            ["Veelzijdigheid", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Brood", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Pizza", "⭐⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Gebak", "⭐⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐"],
            ["Beginners", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers met tarwebloem werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Denken dat alle tarwebloem hetzelfde is",
            cause:
              "Tarwebloem verschilt per producent in eiwitpercentage en kwaliteit.",
            solution:
              "Daardoor kan hetzelfde recept bij een ander merk anders uitpakken.",
          },
          {
            mistake: "Te veel bloem toevoegen tijdens het kneden",
            cause:
              "Een plakkerig deeg betekent niet automatisch dat extra bloem nodig is.",
            solution:
              "Geef het deeg eerst de tijd om het water op te nemen.",
          },
          {
            mistake: "Tarwebloem verwarren met patentbloem",
            cause:
              "Hoewel beide wit zijn, is patentbloem doorgaans sterker en beter geschikt voor brood.",
            solution:
              "Kies patentbloem of T65 wanneer je serieuzer brood wilt bakken.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Kijk niet alleen naar de naam op de verpakking.\n\nControleer, als het vermeld staat, ook het eiwitpercentage. Dat geeft vaak een betere indicatie van hoe de bloem zich tijdens het bakken zal gedragen.",
        keyPoints: [],
        relatedKnowledge: ["patentbloem", "t65"],
      }),
      createKnowledgeBiteSection({
        id: "faq",
        title: "Veelgestelde vragen",
        body: "",
        keyPoints: [],
        relatedKnowledge: [],
        faq: [
          {
            question: "Is tarwebloem hetzelfde als patentbloem?",
            answer:
              "Nee. Patentbloem is doorgaans een sterkere witte bloem die beter geschikt is voor brood. Tarwebloem is een bredere benaming en kan verschillende eigenschappen hebben.",
          },
          {
            question: "Is tarwebloem geschikt voor zuurdesem?",
            answer:
              "Ja. Veel zuurdesembroden worden met tarwebloem gebakken. Voor een klassiek Frans brood kiezen veel bakkers echter voor T65.",
          },
          {
            question: "Kan ik pizza bakken met tarwebloem?",
            answer:
              "Ja. Voor authentieke Napolitaanse pizza wordt meestal Tipo 00 gebruikt, maar tarwebloem is prima geschikt voor veel andere pizzastijlen.",
          },
          {
            question: "Waarom verschilt de ene tarwebloem van de andere?",
            answer:
              "Iedere producent gebruikt andere tarwerassen en maalprocessen. Daardoor kunnen eiwitpercentage, wateropname en bakresultaat verschillen.",
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
            title: "Niet elke tarwebloem is gelijk",
            fact:
              "Niet iedere zak waarop \"tarwebloem\" staat bevat dezelfde bloem. Twee merken kunnen zich tijdens het bakken verrassend verschillend gedragen, ondanks dat ze dezelfde naam dragen.",
          },
        ],
      }),
    ],
    doughbertAdvice: [...TARWEBLOEM_DOUGHBERT_ADVICE],
    doughbertAdviceHeaders: ["Doel", "Advies"],
    doughbertAdviceNote:
      "Heb je maar één bloem in huis? Dan is tarwebloem de meest veelzijdige keuze. Wil je serieuzer brood bakken, stap dan over op een sterkere bloem zoals T65 of een goede patentbloem.",
  },
});
