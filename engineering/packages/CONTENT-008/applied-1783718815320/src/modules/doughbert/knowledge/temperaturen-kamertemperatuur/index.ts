import { defineKnowledgeBite } from "../helpers";
import { definitionToArticleInput } from "../import/articleNormalizer";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

export const kamertemperatuurKnowledgeBite = defineKnowledgeBite({
  "slug": "kamertemperatuur",
  "categoryId": "temperaturen",
  "title": "Kamertemperatuur",
  "libraryOrder": 5,
  "status": "published",
  "metadata": {
    "subtitle": "Hoe de temperatuur van je ingrediënten bepaalt of een beslag glad opklopt of juist schift, en wanneer je bewust van de regel moet afwijken",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "kamertemperatuur",
      "ingrediënten",
      "boter",
      "eieren",
      "baktechniek"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Kamertemperatuur is een van die instructies die in bijna elk recept terugkomt, maar die vaak onderschat wordt. Het gaat niet om een vaag gevoel van 'niet koud uit de koelkast', maar om een concrete temperatuurzone die bepaalt hoe boter, eieren en zuivel zich gedragen tijdens het mengen en bakken. Wie dit begrijpt, voorkomt geschifte beslagen, plat gebak en ongelijkmatige structuren.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat betekent kamertemperatuur precies",
        "body": "Kamertemperatuur klinkt als een huishoudelijke aanduiding, maar in de bakkerij is het een technische term met een vrij nauwkeurige bandbreedte. In de meeste recepten wordt hiermee een temperatuur tussen de 18 en 22°C bedoeld, met 20-21°C als praktisch ideaal. Dat is de temperatuur die de meeste Nederlandse en Belgische woonkamers en keukens in het voor- en najaar hebben, maar allerminst wat je in een verwarmde keuken in de winter of een broeierige zomeravond aantreft.\n\nHet probleem is dat 'kamertemperatuur' als begrip subjectief aanvoelt, terwijl de fysieke reactie van boter, eieren en room helemaal niet subjectief is. Boter die op 24°C ligt gedraagt zich structureel anders dan boter op 19°C, ook al voelen beide 'zacht' aan bij het aanraken. Daarom is een keukenthermometer voor serieuze bakkers geen overbodige luxe, maar eigenlijk het enige objectieve hulpmiddel om deze instructie goed uit te voeren.",
        "keyPoints": [
          "Kamertemperatuur ligt in de praktijk tussen 18 en 22°C, met 20-21°C als ideaal",
          "De term is subjectief in taal, maar objectief in fysiek gedrag van ingrediënten",
          "Omgevingstemperatuur in de keuken kan sterk afwijken van wat een recept veronderstelt"
        ],
        "relatedKnowledge": [
          "Boter op kamertemperatuur brengen",
          "Emulsie in beslag",
          "Keukenthermometer gebruiken"
        ]
      },
      {
        "id": "properties",
        "title": "Welke ingrediënten zijn temperatuurgevoelig",
        "body": "Niet elk ingrediënt is even kritisch als het om temperatuur gaat. Boter, eieren, roomkaas en zuivelproducten zijn de grootste boosdovers en profiteurs tegelijk: te koud en ze mengen niet homogeen, te warm en de structuur die je nodig hebt voor luchtigheid verdwijnt. Hieronder een overzicht van de belangrijkste ingrediënten en hun optimale zone.",
        "keyPoints": [],
        "relatedKnowledge": [
          "Boter romig kloppen",
          "Eieren toevoegen aan beslag",
          "Roomkaastaart bereiden"
        ],
        "table": {
          "caption": "Ideale temperatuur per ingrediënt voor de meeste bereidingen",
          "headers": [
            "Ingrediënt",
            "Ideale temperatuur",
            "Effect bij afwijking"
          ],
          "rows": [
            [
              "Boter (voor cake/koekjes)",
              "19-21°C, licht indeukbaar",
              "Te koud: klontert; te warm: beslag wordt vettig en plat"
            ],
            [
              "Eieren",
              "18-20°C",
              "Koude eieren doen boterbeslag schiften en klonteren"
            ],
            [
              "Roomkaas",
              "20-22°C",
              "Koude roomkaas geeft een klonterige, korrelige vulling"
            ],
            [
              "Melk/room voor beslag",
              "18-20°C",
              "Koude zuivel vertraagt de emulsie en kan boter laten stollen"
            ],
            [
              "Eiwitten voor meringue",
              "Kamertemperatuur, niet koud",
              "Koude eiwitten klutsen minder stabiel en volumineus op"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De wetenschap achter een goede emulsie",
        "body": "Het draait bij kamertemperatuur eigenlijk om vetkristallen en emulsievorming. Boter is een emulsie van vet, water en melkeiwitten. Bij koelkasttemperatuur (rond 4°C) zijn de vetkristallen hard en star, waardoor lucht er nauwelijks in geklopt kan worden. Bij kamertemperatuur worden de vetkristallen plooibaar genoeg om lucht vast te houden zonder helemaal te smelten — precies het venster waarin je romig kunt kloppen en een stabiel schuim van luchtbelletjes creëert dat later in de oven expandeert.\n\nBij eieren speelt iets vergelijkbaars, maar dan met eiwitten. Koude eiwitten zijn stugger en emulgeren minder makkelijk met vet. Voeg je een koud ei toe aan romig geklopte boter, dan kan het mengsel plotseling schiften: de vetdruppeltjes vallen als het ware uit elkaar omdat de temperatuur van boter en ei te ver uit elkaar liggen. Dat schifte beslag oogt korrelig en verliest een deel van zijn luchtcapaciteit, wat direct invloed heeft op het volume van het eindresultaat.",
        "keyPoints": [
          "Vetkristallen in boter worden bij kamertemperatuur plooibaar zonder te smelten",
          "Dit maakt het mogelijk om lucht in te kloppen die later in de oven expandeert",
          "Een te groot temperatuurverschil tussen boter en eieren veroorzaakt schiften"
        ],
        "relatedKnowledge": [
          "Emulsie in beslag",
          "Waarom beslag schift",
          "Romig kloppen van boter en suiker"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer kamertemperatuur echt het verschil maakt",
        "body": "Bij taartbeslagen, cakes, cookies op basis van romig geklopte boter en room- of botercrèmes is kamertemperatuur vrijwel altijd essentieel. De reden is steeds dezelfde: je bouwt lucht in via het kloppen van boter en suiker, en die luchtstructuur is het fundament van de uiteindelijke kruim. Ook bij ganache, bepaalde chocolademousses en Franse boterdeegjes waar boter en room gecombineerd worden, voorkomt een gelijke temperatuur dat het mengsel breekt of korrelig wordt.\n\nGistdegen profiteert er eveneens van, zij het om een andere reden: gist werkt het efficiëntst bij een omgevingstemperatuur rond 24-27°C, en ingrediënten op kamertemperatuur helpen voorkomen dat het deeg tijdens het kneden te veel afkoelt, wat de rijstijd onnodig verlengt.",
        "keyPoints": [
          "Cruciaal bij cakes, cookies en botercrèmes waar lucht wordt ingeklopt",
          "Belangrijk bij ganache en mousses om schiften te voorkomen",
          "Helpt gistdeeg op temperatuur te blijven tijdens het kneden"
        ],
        "relatedKnowledge": [
          "Botercrème maken",
          "Ganache bereiden",
          "Gistdeeg kneden"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer je juist koud moet blijven werken",
        "body": "Niet elk baksel is gebaat bij kamertemperatuur — sterker nog, voor sommige technieken is het regelrecht funest. Bladerdeeg, korstdeeg (pâte brisée/sucrée) en scones zijn hier het klassieke voorbeeld. Bij deze bereidingen wil je juist dat de boter in koude, vaste stukjes blijft zitten totdat het deeg de oven ingaat. De boter smelt dan pas in de oven, waarbij het vocht verdampt en stoom de lagen deeg uit elkaar duwt — dat is precies het mechanisme achter een luchtig, bladerig resultaat.\n\nWerk je hier per ongeluk met boter op kamertemperatuur, dan mengt het vet zich te snel met het bloem, verdwijnt de gelaagdheid en krijg je een dicht, taai product in plaats van knapperige lagen. Dezelfde logica geldt voor roomsoezen en bepaalde korstdegen: koude ingrediënten en een koude werkomgeving zijn hier de sleutel, niet kamertemperatuur.",
        "keyPoints": [
          "Bladerdeeg en korstdeeg vereisen juist koude, vaste boter",
          "Warme boter laat lagen versmelten en vernietigt de bladerige structuur",
          "Werk in een koele ruimte en koel het deeg tussentijds indien nodig"
        ],
        "relatedKnowledge": [
          "Bladerdeeg maken",
          "Korstdeeg (pâte brisée)",
          "Vetten in deeg verwerken"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "mistakes": [
          {
            "mistake": "Boter in de magnetron zacht maken",
            "cause": "Ongeduld of te weinig voorbereidingstijd, waardoor de boter lokaal smelt",
            "solution": "Snijd boter in blokjes en laat 30-60 minuten op het aanrecht liggen; dit verdeelt de temperatuur gelijkmatig"
          },
          {
            "mistake": "Koude eieren direct aan romig geklopte boter toevoegen",
            "cause": "Eieren rechtstreeks uit de koelkast gebruiken zonder op te warmen",
            "solution": "Leg eieren 20-30 minuten in lauwwarm water of laat ze op kamertemperatuur komen voordat je ze toevoegt"
          },
          {
            "mistake": "Aannemen dat 'zacht aanvoelen' hetzelfde is als kamertemperatuur",
            "cause": "Visuele of tactiele inschatting in plaats van meten",
            "solution": "Gebruik een keukenthermometer en streef naar 19-21°C voor boter"
          },
          {
            "mistake": "Bladerdeeg maken met boter op kamertemperatuur",
            "cause": "Verwarring tussen recepten die juist warme versus koude ingrediënten vragen",
            "solution": "Lees het recepttype goed: laminaged degen vragen altijd koude boter, geen kamertemperatuur"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's tip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "doughbertTip": "Heb je geen tijd om boter langzaam op temperatuur te laten komen? Snijd het blokje in kleine, gelijke dobbelsteentjes van ongeveer 1 centimeter. Door het oppervlak te vergroten, warmt de boter binnen 10-15 minuten gelijkmatig op tot kamertemperatuur, zonder dat je het risico loopt op gedeeltelijk gesmolten randjes zoals bij de magnetron."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "faq": [
          {
            "question": "Hoe controleer ik of boter echt op kamertemperatuur is zonder thermometer?",
            "answer": "Duw zachtjes met je vinger in het blokje: bij de juiste temperatuur laat het een duidelijke afdruk achter zonder dat je vinger er doorheen zakt of er vet aan blijft plakken. Voelt het glad en glimmend aan, dan is de boter waarschijnlijk al te warm."
          },
          {
            "question": "Kan ik eieren snel op kamertemperatuur brengen?",
            "answer": "Ja, leg de eieren in de schaal 15-20 minuten in een kom met lauwwarm (geen heet) water. Dit is aanzienlijk sneller dan wachten op natuurlijke opwarming en werkt goed als vervanging voor vooraf plannen."
          },
          {
            "question": "Waarom schift mijn cakebeslag ondanks boter op kamertemperatuur?",
            "answer": "Vaak ligt de oorzaak bij eieren die nog koud zijn of te snel in één keer worden toegevoegd. Voeg eieren in kleine porties toe en klop steeds goed door voordat je de volgende toevoegt, en zorg dat ook de eieren op kamertemperatuur zijn."
          },
          {
            "question": "Geldt kamertemperatuur ook voor bloem en suiker?",
            "answer": "Voor droge ingrediënten als bloem en suiker maakt de temperatuur nauwelijks verschil, omdat zij geen vetkristallen of emulgerende eiwitten bevatten. De instructie 'kamertemperatuur' in recepten heeft vrijwel altijd betrekking op zuivel en eieren."
          }
        ]
      },
      {
        "id": "did-you-know",
        "title": "Wist je dat?",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "didYouKnow": [
          {
            "title": "Franse patissiers meten letterlijk",
            "fact": "In professionele patisserieopleidingen wordt 'kamertemperatuur' vaak niet als vage aanduiding gebruikt maar als concreet cijfer: beurre pommade (smeerbare boter) wordt doorgaans gedefinieerd als boter tussen 18 en 20°C."
          },
          {
            "title": "De term komt uit een tijd zonder centrale verwarming",
            "fact": "Het begrip kamertemperatuur ontstond in een periode waarin huizen aanzienlijk koeler waren dan nu, rond de 15-18°C. Moderne, goed verwarmde keukens liggen daardoor vaak al boven wat oorspronkelijk bedoeld werd."
          }
        ]
      }
    ]
  }
});

/** All temperaturen articles — generated by Atlas' real content pipeline (see
 * scripts/atlas/contentGenerationEngine.ts), reviewed and approved via the CEO Inbox.
 * Add new articles in this category here, not in bulk/catalogArticles.ts. */
export const kamertemperatuurArticles: KnowledgeArticleInput[] = [
  definitionToArticleInput(kamertemperatuurKnowledgeBite),
];
