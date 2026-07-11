import { defineKnowledgeBite } from "../helpers";
import { definitionToArticleInput } from "../import/articleNormalizer";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

export const zureStarterKnowledgeBite = defineKnowledgeBite({
  "slug": "zure-starter",
  "categoryId": "starter",
  "title": "Zure starter",
  "libraryOrder": 8,
  "status": "published",
  "metadata": {
    "subtitle": "Hoe melkzuur en azijnzuur samen de smaak van je zuurdesembrood bepalen — en hoe je die balans naar je hand zet",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "zuurdesem",
      "starter",
      "fermentatie",
      "zuurgraad",
      "melkzuur",
      "azijnzuur",
      "broodtechniek"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Een zure starter is een zuurdesemstarter die door de tijd en de juiste omstandigheden een uitgesproken, scherpe zuurgraad heeft ontwikkeld. De mate van zuurheid wordt niet bepaald door toeval, maar door een subtiel samenspel van temperatuur, hydratatie en voedingsritme dat de balans tussen melkzuur en azijnzuur stuurt. Wie deze balans begrijpt, kan de smaak van zijn zuurdesembrood bewust richting mild en romig of juist scherp en uitgesproken sturen.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is een zure starter?",
        "body": "Een zure starter is in essentie hetzelfde als elke andere zuurdesemstarter: een levend mengsel van bloem en water waarin wilde gisten en melkzuurbacteriën in symbiose leven. Het verschil zit in de mate van rijping en de manier waarop de starter is opgebouwd en onderhouden. Een jonge, net gestarte cultuur ruikt meestal mild, licht zoetig en soms een beetje naar yoghurt. Naarmate een starter ouder wordt en regelmatig op een bepaald ritme wordt gevoed, ontwikkelt zich een stabieler microbioom waarin de zuurproducerende bacteriën dominanter worden. Het resultaat is een starter die duidelijk zuur ruikt en proeft — vaak omschreven als scherp, azijnachtig of juist yoghurtachtig romig, afhankelijk van welk type zuur overheerst.\n\nDe term 'zure starter' wordt in de praktijk gebruikt voor twee verschillende situaties: enerzijds een gezonde, actieve starter die bewust op scherpte is gestuurd voor een uitgesproken zuurdesemsmaak, en anderzijds een verwaarloosde of uit balans geraakte starter die overmatig zuur is geworden zonder nog voldoende rijskracht te hebben. Het is belangrijk deze twee te onderscheiden: de eerste is een teken van vakmanschap, de tweede een teken dat de starter aandacht nodig heeft.",
        "keyPoints": [
          "Zuurheid is een teken van een actief microbioom, geen toeval",
          "Een zure starter kan zowel gewenst als een signaal van onbalans zijn",
          "De geur en smaak verraden welk type zuur overheerst"
        ],
        "relatedKnowledge": [
          "zuurdesemstarter-onderhoud",
          "starter-voeden",
          "wilde-gist"
        ]
      },
      {
        "id": "science",
        "title": "De wetenschap achter zuurvorming",
        "body": "De zuurgraad van een starter wordt grotendeels bepaald door twee soorten organische zuren: melkzuur en azijnzuur. Beide worden geproduceerd door melkzuurbacteriën, maar via verschillende metabolische routes. Homofermentatieve bacteriën zetten suikers vrijwel uitsluitend om in melkzuur, wat een zachte, romige, yoghurtachtige zuurheid geeft. Heterofermentatieve bacteriën produceren daarnaast ook azijnzuur, kooldioxide en ethanol, wat resulteert in een scherpere, prikkende zuurheid die doet denken aan azijn.\n\nWelke route de overhand krijgt, hangt sterk af van temperatuur en hydratatie. Bij een warmere omgeving en een vloeibaardere starter (hogere hydratatie) krijgen melkzuurbacteriën de overhand, wat resulteert in een mildere, ronde zuurheid. Bij een koelere omgeving en een stijvere starter (lagere hydratatie) ontstaat juist meer azijnzuur, wat een scherpere, uitgesprokener zure noot geeft. Dit principe — vaak toegeschreven aan onderzoek naar zuurdesemmicrobiologie van onder meer Debra Wink — vormt de basis van vrijwel elke bewuste sturing van zuurgraad in het bakkersvak.",
        "keyPoints": [
          "Melkzuur geeft een zachte, romige zuurheid",
          "Azijnzuur geeft een scherpe, prikkende zuurheid",
          "Temperatuur en hydratatie bepalen welk zuur domineert"
        ],
        "relatedKnowledge": [
          "hydratatie-starter",
          "fermentatietemperatuur",
          "melkzuurbacterien"
        ]
      },
      {
        "id": "properties",
        "title": "Eigenschappen en herkenning van een zure starter",
        "body": "Een gezonde zure starter herken je aan een aantal duidelijke kenmerken: een uitgesproken geur die kan variëren van yoghurtachtig tot scherp azijnachtig, een actieve bellenstructuur en nog altijd voldoende rijskracht om deeg te laten rijzen. Een starter die alléén zuur ruikt maar niet meer rijst, is uit balans en heeft waarschijnlijk te weinig voeding of te lang gewacht tussen voedingen gehad.",
        "keyPoints": [
          "Actieve bellen en rijskracht duiden op een gezonde starter",
          "Alleen zuurgeur zonder rijskracht wijst op onbalans",
          "De vier stuurfactoren zijn temperatuur, hydratatie, voedingsritme en dikte"
        ],
        "relatedKnowledge": [
          "starter-gezondheid-herkennen",
          "voedingsritme-starter"
        ],
        "table": {
          "caption": "Invloed van omstandigheden op het type zuur",
          "headers": [
            "Factor",
            "Meer melkzuur (mild)",
            "Meer azijnzuur (scherp)"
          ],
          "rows": [
            [
              "Temperatuur",
              "Warmer (24-30°C)",
              "Kouder (15-20°C)"
            ],
            [
              "Hydratatie",
              "Hoger (vloeibaarder)",
              "Lager (stijver)"
            ],
            [
              "Voedingsritme",
              "Vaker gevoed",
              "Langer laten staan"
            ],
            [
              "Zuurstof",
              "Meer beweging/lucht",
              "Minder beweging, dikker beslag"
            ]
          ]
        }
      },
      {
        "id": "when-to-use",
        "title": "Wanneer kies je bewust voor een zure starter?",
        "body": "Een uitgesproken zure starter is de sleutel tot brood met een herkenbare, robuuste zuurdesemsmaak — denk aan Zuid-Duits of Scandinavisch roggebrood, San Francisco-stijl zuurdesem of rustieke landbroden waarin de zuurheid een integraal onderdeel van het smaakprofiel vormt. Ook bij roggemeel is een zurdere starter functioneel: het extra zuur helpt de enzymatische activiteit in rogge te temperen, wat een stabielere kruim geeft. Voor bakkers die juist experimenteren met langere, koude fermentaties in de koelkast ontstaat vanzelf meer scherpte, en dat kan bewust worden ingezet als smaakkenmerk van een specifiek brood.",
        "keyPoints": [
          "Ideaal voor rogge- en landbroden met een uitgesproken smaakprofiel",
          "Extra zuur helpt bij het temperen van enzymactiviteit in roggemeel",
          "Koude, lange fermentaties versterken de zuurheid van nature"
        ],
        "relatedKnowledge": [
          "roggebrood-techniek",
          "koude-vertraging-deeg",
          "san-francisco-zuurdesem"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer een zure starter minder geschikt is",
        "body": "Niet elk brood is gebaat bij een uitgesproken zure smaak. Voor lichte, verfijnde broden zoals baguette, focaccia of verrijkte deegwaren zoals brioche en zuurdesem-panettone werkt een mildere, jongere starter vaak beter — de subtiele, licht zoetige ondertoon laat andere smaken zoals boter, olijfolie of vanille beter tot hun recht komen. Ook bij beginnende bakkers kan een te scherpe starter verwarrend zijn: een sterk zure geur wordt soms ten onrechte aangezien voor bederf, terwijl het juist een teken van gezonde activiteit kan zijn. In die gevallen is het verstandig de starter eerst een aantal voedingen op kamertemperatuur en met hogere hydratatie te geven om de scherpte te temperen voordat je verder bakt.",
        "keyPoints": [
          "Milde starters passen beter bij verfijnde of verrijkte gebakken producten",
          "Te scherpe zuurheid kan andere smaken overheersen",
          "Overmatige scherpte is te corrigeren met warmere, vaker gevoede cycli"
        ],
        "relatedKnowledge": [
          "brioche-zuurdesem",
          "starter-milder-maken",
          "focaccia-techniek"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten bij het beheren van zuurgraad",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "mistakes": [
          {
            "mistake": "De starter te lang niet voeden en verwachten dat hij nog krachtig rijst",
            "cause": "Uitgehongerde bacteriën produceren vooral zuur en nauwelijks nog gas, waardoor rijskracht afneemt terwijl de zuurheid juist toeneemt",
            "solution": "Voed de starter op een consistent ritme dat past bij de gekozen temperatuur en hydratatie, en gebruik hem op zijn piekmoment"
          },
          {
            "mistake": "Een starter permanent koud bewaren en toch scherpe zuurheid verwachten mee te nemen naar het brood",
            "cause": "Koude vertraagt juist de melkzuurproductie relatief meer dan de azijnzuurproductie op de korte termijn, waardoor het effect anders uitpakt dan verwacht",
            "solution": "Bouw gerichte temperatuurwisselingen in: koeler voor de uiteindelijke deegfermentatie, maar de starter zelf regelmatig op kamertemperatuur actief houden"
          },
          {
            "mistake": "Scherpe zuurgeur verwarren met bederf en de starter weggooien",
            "cause": "Onbekendheid met het verschil tussen azijnzuurgeur (normaal bij een actieve starter) en werkelijk bedorven, rotte of schimmelige geuren",
            "solution": "Leer de geursignalen herkennen: fris-zuur en azijnachtig is gezond, terwijl rottend, naar aceton ruikend of verkleurd met roze/oranje vlekken op bederf wijst"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's tip voor het sturen van zuurgraad",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "doughbertTip": "Wil je meer scherpte in je starter? Maak hem stijver (lagere hydratatie, richting 50%), voed hem minder vaak en bewaar hem iets koeler. Wil je juist een mildere, romigere zuurheid? Ga naar een vloeibaardere consistentie (100% hydratatie of hoger), voed hem vaker en houd hem op een warmere plek rond 26-28°C. Verander steeds maar één variabele tegelijk en geef de starter minimaal drie tot vier voedingscycli de tijd om zich aan te passen — zuurdesem reageert traag maar betrouwbaar op consistente aanpassingen."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over zure starters",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "faq": [
          {
            "question": "Is een zeer zure starter nog wel bruikbaar om brood mee te bakken?",
            "answer": "Ja, mits hij nog voldoende rijskracht heeft. Test dit met de drijftest: een klein klontje starter dat blijft drijven in water, duidt op voldoende gasproductie om deeg te laten rijzen, ook als de geur scherp is."
          },
          {
            "question": "Waarom ruikt mijn starter soms naar nagellakremover of aceton?",
            "answer": "Dit duidt meestal op honger: de starter heeft te lang zonder voeding gestaan en produceert naast zuren ook meer ethanol en bijproducten. Een frisse voeding met vers meel en water lost dit doorgaans snel op."
          },
          {
            "question": "Kan ik de zuurgraad van mijn starter permanent veranderen?",
            "answer": "Ja, door consequent een ander voedingsritme, hydratatie en temperatuur aan te houden, verschuift de microbiële samenstelling geleidelijk. Dit is geen kwestie van één voeding, maar van een aangehouden patroon over meerdere dagen tot weken."
          },
          {
            "question": "Heeft roggebloem invloed op de zuurgraad?",
            "answer": "Roggemeel bevat van nature meer voedingsstoffen en enzymen die melkzuurbacteriën goed gedijen, waardoor een starter op basis van rogge vaak sneller en uitgesprokener zuur wordt dan een starter op tarwebloem."
          }
        ]
      },
      {
        "id": "did-you-know",
        "title": "Wist je dat...",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "didYouKnow": [
          {
            "title": "De naam verraadt de chemie",
            "fact": "Het woord 'zuurdesem' verwijst letterlijk naar het zure karakter van het deeg, veroorzaakt door dezelfde melkzuur- en azijnzuurbacteriën die ook in yoghurt en augurken werken."
          },
          {
            "title": "San Francisco dankt zijn naam aan een bacterie",
            "fact": "De bacterie Lactobacillus sanfranciscensis, vernoemd naar de stad waar zuurdesembrood een culinaire traditie is, draagt sterk bij aan het kenmerkende, scherpe zuurprofiel van dat brood."
          },
          {
            "title": "Zuurgraad is meetbaar",
            "fact": "Professionele bakkerijen meten de zuurgraad van hun starter en deeg soms met een pH-meter of titreerbare zuurgraad (TTA), waarbij een lagere pH duidt op meer zuurheid."
          }
        ]
      }
    ]
  }
});

/** All starter articles — generated by Atlas' real content pipeline (see
 * scripts/atlas/contentGenerationEngine.ts), reviewed and approved via the CEO Inbox.
 * Add new articles in this category here, not in bulk/catalogArticles.ts. */
export const zureStarterArticles: KnowledgeArticleInput[] = [
  definitionToArticleInput(zureStarterKnowledgeBite),
];
