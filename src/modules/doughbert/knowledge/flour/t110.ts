import {
  createKnowledgeBiteSection,
  createStandardSection,
} from "@/data/knowledgeBiteContent";

import { defineKnowledgeBite } from "../helpers";

import { FRENCH_FLOUR_DOUGHBERT_ADVICE } from "./flourAdvice";

export const t110KnowledgeBite = defineKnowledgeBite({
  slug: "t110",
  categoryId: "meel-bloem",
  title: "T110",
  libraryOrder: 3,
  subcategory: "Franse bloem",
  status: "published",
  metadata: {
    subtitle: "De Franse volkorenachtige bloem met een krachtige graansmaak",
    difficulty: "intermediate",
    readingTimeMinutes: 8,
    lastUpdated: "2026-07-05",
    tags: ["T110", "Franse bloem", "Bruin brood", "Zuurdesem", "Volkoren"],
    relatedRecipes: ["donker-volkoren", "meergranen", "country-loaf"],
    relatedKnowledge: [
      "t80",
      "t130",
      "volkoren",
      "hydratatie",
      "fermentatie",
      "autolyse",
      "stretch-and-fold",
      "meergranen",
    ],
    relatedTips: ["brood-plakkerig-rusten", "plakken-natte-handen"],
  },
  content: {
    summary:
      "T110 is een Franse bloem die veel dichter bij volkorenmeel ligt dan T80. Tijdens het malen blijft een groter deel van de graankorrel behouden, waardoor T110 rijk is aan vezels, mineralen en smaakstoffen.\n\nBroden gebakken met T110 hebben een donkere kruim, een uitgesproken graansmaak en een hogere voedingswaarde. Door de grotere hoeveelheid zemeldeeltjes vraagt T110 meer water en een zorgvuldige glutenontwikkeling.\n\nT110 is ideaal voor thuisbakkers die een voedzaam, rustiek zuurdesembrood willen bakken met veel karakter.",
    sections: [
      createStandardSection("what-is-it", {
        body:
          "T110 is een Franse tarwebloem waarvan het typenummer verwijst naar het mineraalgehalte (asgehalte). Hoe hoger dit getal, hoe meer delen van de oorspronkelijke graankorrel zijn behouden tijdens het malen.\n\nBij T110 zijn aanzienlijk meer zemel- en aleurondeeltjes aanwezig dan bij T65 of T80. Hierdoor bevat de bloem meer vezels, vitamines, mineralen en natuurlijke enzymen.\n\nHoewel T110 soms als \"bruin meel\" wordt omschreven, bevindt het zich tussen T80 en volledig volkorenmeel.",
      }),
      createKnowledgeBiteSection({
        title: "Waarom kiezen thuisbakkers voor T110?",
        body:
          "T110 geeft een brood veel meer karakter dan T65 of T80.\n\nDe extra zemeldeeltjes zorgen voor een diepe graansmaak, een stevigere kruim en een hogere voedingswaarde. Veel thuisbakkers gebruiken T110 als onderdeel van een meelmix om een brood meer diepgang te geven zonder volledig volkoren te bakken.",
        keyPoints: [],
        relatedKnowledge: [],
      }),
      createStandardSection("properties", {
        body: "Het exacte eiwitpercentage verschilt per molen en producent.",
        table: {
          caption: "Eigenschappen van T110",
          headers: ["Eigenschap", "T110"],
          rows: [
            ["Type", "Franse bloem"],
            ["Asgehalte", "± 1,00–1,20%"],
            ["Eiwitpercentage", "meestal 11–13%*"],
            ["Wateropname", "Hoog"],
            ["Glutenontwikkeling", "Gemiddeld"],
            ["Kleur", "Licht tot donkerbruin"],
            ["Smaak", "Vol, rijk en graanachtig"],
            ["Verwerking", "Gemiddeld uitdagend"],
          ],
        },
        keyPoints: [],
      }),
      createStandardSection("science", {
        body:
          "T110 bevat een aanzienlijk groter deel van de oorspronkelijke graankorrel. Hierdoor zijn er meer vezels en zemeldeeltjes aanwezig.\n\nDeze nemen veel water op en bevatten extra enzymen die de fermentatie ondersteunen.\n\nTegelijkertijd snijden de zemeldeeltjes deels door het glutennetwerk heen. Hierdoor wordt het moeilijker om een zeer open kruim te ontwikkelen.\n\nOm dit te compenseren zijn voldoende rustmomenten, een goede autolyse en meerdere Stretch & Folds of Coil Folds belangrijk.",
        relatedKnowledge: ["autolyse", "stretch-and-fold", "fermentatie"],
      }),
      createKnowledgeBiteSection({
        title: "Hydratatie",
        body:
          "Door het hoge vezelgehalte neemt T110 veel water op.\n\nVoor de meeste zuurdesembroden ligt een hydratatie tussen 72% en 80% prettig.\n\nLaat het deeg voldoende rusten zodat de vezels het water volledig kunnen opnemen voordat je extra bloem toevoegt.",
        keyPoints: [],
        relatedKnowledge: ["hydratatie"],
      }),
      createStandardSection("when-to-use", {
        body: "T110 is uitstekend geschikt voor:",
        keyPoints: [
          "Rustieke zuurdesembroden",
          "Bruine vloerbroden",
          "Meergranenbroden",
          "Donker volkorenbrood",
          "Ambachtelijke desembroden",
        ],
      }),
      createStandardSection("when-not-to-use", {
        body: "Gebruik liever:",
        keyPoints: [
          "T65 voor luchtige broden.",
          "T80 voor een milder rustiek karakter.",
          "T130 wanneer je nóg meer vezels en een intensere smaak wilt.",
          "Tipo 00 voor pizza.",
          "Tarwebloem voor sterke of verrijkte degen.",
        ],
      }),
      createStandardSection("comparison", {
        body: "Vergelijk T110 met andere Franse bloemen om sneller de juiste keuze te maken.",
        comparisonTable: {
          caption: "T80 vs T110 vs T130",
          headers: ["Eigenschap", "T80", "T110", "T130"],
          rows: [
            ["Smaak", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Wateropname", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
            ["Luchtigheid", "⭐⭐⭐", "⭐⭐", "⭐⭐"],
            ["Zemeldeeltjes", "Meer", "Veel", "Zeer veel"],
            ["Geschikt voor beginners", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐"],
          ],
        },
        keyPoints: [],
      }),
      createKnowledgeBiteSection({
        id: "common-mistakes",
        title: "Veelgemaakte fouten",
        body: "Deze fouten zien we vaak wanneer thuisbakkers voor het eerst met T110 werken.",
        keyPoints: [],
        relatedKnowledge: [],
        mistakes: [
          {
            mistake: "Te weinig hydratatie",
            cause:
              "Door de grote hoeveelheid vezels heeft T110 meer water nodig dan veel thuisbakkers verwachten.",
            solution:
              "Reken op 72–80% hydratatie en voeg water geleidelijk toe tijdens het mengen.",
          },
          {
            mistake: "Onvoldoende glutenontwikkeling",
            cause:
              "Omdat zemeldeeltjes het glutennetwerk verstoren, is een goede glutenontwikkeling essentieel.",
            solution:
              "Autolyse en meerdere vouwrondes helpen hierbij.",
          },
          {
            mistake: "Alleen T110 gebruiken",
            cause:
              "Een brood van 100% T110 kan compact worden.",
            solution:
              "Veel thuisbakkers kiezen daarom voor een combinatie met T65 of T80.",
          },
        ],
      }),
      createStandardSection("doughbert-tip", {
        body: "",
        doughbertTip:
          "Wil je een brood met meer voedingswaarde en een rijkere graansmaak? Vervang dan 20 tot 40% van je T65 door T110. Je behoudt een prettige verwerking, terwijl het brood duidelijk meer karakter krijgt.",
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
            question: "Is T110 hetzelfde als volkoren?",
            answer:
              "Nee. T110 bevat veel delen van de graankorrel, maar is nog geen volledig volkorenmeel.",
          },
          {
            question: "Waarom voelt T110 droger aan tijdens het mengen?",
            answer:
              "De aanwezige vezels nemen langzaam veel water op. Geef het deeg voldoende tijd voordat je extra bloem toevoegt.",
          },
          {
            question: "Is T110 geschikt voor beginners?",
            answer:
              "Ja, maar iets minder vergevingsgezind dan T65 of T80. Een combinatie met T65 is vaak een goede eerste stap.",
          },
          {
            question: "Kan ik uitsluitend T110 gebruiken?",
            answer:
              "Dat kan, maar verwacht een compacter brood met een stevigere kruim.",
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
            title: "T110 in Franse bakkerijen",
            fact:
              "Veel Franse bakkers gebruiken T110 om traditionele landelijke broden meer smaak en voedingswaarde te geven zonder volledig volkoren te bakken.",
          },
        ],
      }),
    ],
    doughbertAdvice: FRENCH_FLOUR_DOUGHBERT_ADVICE,
  },
});
