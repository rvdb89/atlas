import { defineKnowledgeBite } from "../helpers";
import { definitionToArticleInput } from "../import/articleNormalizer";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

export const machinaalKnedenKnowledgeBite = defineKnowledgeBite({
  "slug": "machinaal-kneden",
  "categoryId": "technieken",
  "title": "Machinaal kneden",
  "libraryOrder": 2,
  "status": "published",
  "metadata": {
    "subtitle": "Hoe kneedmachines het deegproces versnellen, verbeteren en soms ook compliceren",
    "difficulty": "beginner",
    "readingTimeMinutes": 5,
    "tags": [
      "machinaal kneden",
      "deegbereiding",
      "glutenontwikkeling",
      "kneedmachine",
      "broodbakken"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Machinaal kneden heeft de bakkerij ingrijpend veranderd door glutenontwikkeling sneller, consistenter en fysiek minder belastend te maken. Toch vraagt het gebruik van een kneedmachine om een ander soort vakmanschap dan handmatig kneden: kennis van snelheden, kneedtijden en de signalen van een goed ontwikkeld deeg blijft onmisbaar. Dit artikel behandelt de techniek, de wetenschap erachter en de valkuilen waar zowel thuisbakkers als professionals tegenaan lopen.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is machinaal kneden?",
        "body": "Machinaal kneden is het proces waarbij een mechanische mixer of kneder de functie van de menselijke hand overneemt bij het mengen van bloem, water, gist of zuurdesem en overige ingrediënten tot een samenhangend deeg. De machine oefent via rotatie, kneedhaken of spiraalarmen krachten uit op het deeg die vergelijkbaar zijn met de rek-, druk- en vouwbewegingen die een bakker met de hand zou maken, maar dan met een veel hogere frequentie en constantere kracht. Het resultaat is een snellere en gelijkmatiger ontwikkeling van het glutennetwerk, wat essentieel is voor de structuur en textuur van brood, gebak en deegwaren. In professionele bakkerijen is machinaal kneden vandaag de norm; spiraalmixers en planetaire mixers vormen er het hart van elke productielijn.",
        "keyPoints": [
          "Vervangt de handmatige kneedbeweging door mechanische kracht",
          "Ontwikkelt gluten sneller en gelijkmatiger dan handkneden",
          "Standaard in professionele bakkerijen, steeds gangbaarder thuis",
          "Vereist kennis van snelheid, tijd en degtemperatuur"
        ],
        "relatedKnowledge": [
          "Glutenontwikkeling",
          "Autolyse",
          "Windowpane-test",
          "Deegtemperatuur"
        ]
      },
      {
        "id": "properties",
        "title": "Machines en hun kneedkarakter",
        "body": "Niet elke kneedmachine kneedt op dezelfde manier, en dat verschil is bepalend voor het eindresultaat. De spiraalmixer, veelgebruikt in professionele broodbakkerijen, heeft een vaste of draaiende kuip met een spiraalvormige haak die het deeg met een rollende, vouwende beweging bewerkt. Deze methode ontwikkelt gluten grondig zonder overmatige warmteopbouw, wat spiraalmixers geschikt maakt voor zware, stevige broodtypes zoals volkoren- en meergranenbrood. De planetaire mixer, met zijn kenmerkende ronddraaiende kneedhaak die tegelijk om de eigen as en door de kuip beweegt, is veelzijdiger maar minder krachtig; hij wordt vaak gebruikt voor kleinere hoeveelheden, verfijnd gebak en deeg met een hoger botergehalte, zoals brioche of croissantdeeg. Daarnaast bestaan er horizontale kneders met dubbele armen, geschikt voor grote industriële volumes en stugge deegsoorten zoals pizzadeeg of pasta. Elke machine heeft een eigen 'kneedkarakter': de snelheid waarmee lucht wordt ingeslagen, de mate van wrijvingswarmte en de manier waarop het deeg zich losmaakt van de kuipwand verschillen sterk per type.",
        "keyPoints": [
          "Spiraalmixer: rollende beweging, geschikt voor stevige broden",
          "Planetaire mixer: veelzijdig, geschikt voor verfijnd deeg en gebak",
          "Horizontale kneder: voor grote volumes en stugge deegsoorten",
          "Elke machine ontwikkelt warmte en lucht op een eigen manier"
        ],
        "relatedKnowledge": [
          "Spiraalmixer",
          "Planetaire mixer",
          "Deegtemperatuurbeheer"
        ]
      },
      {
        "id": "comparison",
        "title": "Machinaal versus handmatig kneden",
        "body": "De keuze tussen machinaal en handmatig kneden is niet alleen een kwestie van gemak, maar raakt de kern van hoe een deeg zich ontwikkelt. Handmatig kneden geeft de bakker directe tactiele feedback: elke verandering in elasticiteit en plakkerigheid is voelbaar, wat het makkelijker maakt om het proces op gevoel te sturen. Machinaal kneden mist die directe feedback, maar maakt het proces reproduceerbaar en tijdsefficiënt, vooral bij grotere hoeveelheden deeg waarbij handmatig kneden fysiek onhaalbaar wordt.",
        "keyPoints": [],
        "relatedKnowledge": [
          "Handmatig kneden",
          "Deegconsistentie"
        ],
        "comparisonTable": {
          "caption": "Machinaal versus handmatig kneden",
          "headers": [
            "Aspect",
            "Machinaal kneden",
            "Handmatig kneden"
          ],
          "rows": [
            [
              "Tijdsduur",
              "5-15 minuten, afhankelijk van machine en deeg",
              "15-25 minuten, fysiek intensiever"
            ],
            [
              "Consistentie",
              "Zeer consistent, reproduceerbaar recept na recept",
              "Wisselend, afhankelijk van ervaring en vermoeidheid"
            ],
            [
              "Feedback",
              "Beperkt, vereist visuele en tactiele controle tussendoor",
              "Direct en continu voelbaar"
            ],
            [
              "Warmteontwikkeling",
              "Kan hoger zijn door wrijving, vooral bij lange kneedtijd",
              "Meestal lager door lagere snelheid"
            ],
            [
              "Geschiktheid grote volumes",
              "Zeer geschikt",
              "Fysiek beperkt"
            ],
            [
              "Risico op overkneden",
              "Reëel, vooral bij hoge snelheid",
              "Zeldzaam, vermoeidheid remt vanzelf af"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De wetenschap achter machinaal kneden",
        "body": "Kneden, machinaal of niet, draait om het uitlijnen en verknopen van gluteneiwitten: gliadine en glutenine. Wanneer bloem met water in contact komt, hydrateren deze eiwitten en beginnen ze zich, onder invloed van mechanische energie, te ordenen tot een elastisch netwerk dat gas kan vasthouden tijdens de rijs. Een kneedmachine levert deze mechanische energie sneller en met meer herhaling dan een hand ooit zou kunnen, waardoor het glutennetwerk in een fractie van de tijd kan worden opgebouwd. Maar snelheid heeft een prijs: de wrijving tussen deeg, kuip en kneedhaak wekt warmte op. Bij langdurig of te snel kneden kan de degtemperatuur oplopen tot een niveau waarbij de gistactiviteit versnelt en de smaakontwikkeling uit balans raakt, of waarbij het glutennetwerk juist beschadigd raakt door overmatige mechanische stress — een fenomeen dat bakkers 'overkneden' noemen. Machines met variabele snelheden bieden hier een oplossing: langzaam mengen tot alle ingrediënten homogeen zijn, gevolgd door een fase op hogere snelheid om het glutennetwerk gericht te ontwikkelen, houdt de warmteopbouw beheersbaar.",
        "keyPoints": [
          "Kneden ordent gliadine en glutenine tot een elastisch netwerk",
          "Machines leveren mechanische energie sneller dan handkneden",
          "Wrijving verhoogt de degtemperatuur, met risico op te snelle gisting",
          "Variabele snelheden helpen warmteopbouw te beperken"
        ],
        "relatedKnowledge": [
          "Gliadine en glutenine",
          "Degtemperatuur",
          "Overkneden"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer machinaal kneden de beste keuze is",
        "body": "Machinaal kneden loont vooral wanneer consistentie, tijd of volume een rol spelen. Bij het bakken van grote hoeveelheden brood, zoals in een professionele bakkerij, is machinaal kneden vrijwel onvermijdelijk: geen mens houdt het fysiek volhoudbaar om dagelijks tientallen kilo's deeg met de hand te bewerken. Ook bij deegsoorten die een lange, intensieve glutenontwikkeling vereisen — denk aan bagels, pretzels of stevig volkorenbrood — biedt een machine de kracht en het uithoudingsvermogen om het netwerk grondig op te bouwen zonder dat de bakker uitgeput raakt. Voor thuisbakkers is machinaal kneden een uitkomst bij deeg met een hoog vochtgehalte of veel toevoegingen zoals noten en vruchten, waarbij handmatig kneden lastig en plakkerig werk is. Ten slotte is een machine ideaal wanneer reproduceerbaarheid telt: wie hetzelfde recept keer op keer met identiek resultaat wil bakken, profiteert van de standaardisatie die een machine biedt.",
        "keyPoints": [
          "Onmisbaar bij grote productievolumes",
          "Geschikt voor deeg dat intensieve glutenontwikkeling vereist",
          "Handig bij natte of ingrediëntrijke degen",
          "Zorgt voor reproduceerbare resultaten"
        ],
        "relatedKnowledge": [
          "Bagels kneden",
          "Volkorenbrood",
          "Natte degen"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer machinaal kneden minder geschikt is",
        "body": "Niet elk deeg is gebaat bij de kracht van een machine. Bij zeer delicate degen, zoals sommige zuurdesembroden met een hoog hydratatieniveau, wordt vaak bewust gekozen voor handmatige technieken zoals 'stretch and fold', omdat deze het luchtige, open kruim beter behouden dan de intensieve mechanische actie van een mixer. Ook bij kleine hoeveelheden deeg, zoals een enkel brood voor thuisgebruik, kan een grote professionele mixer al snel te grof en te krachtig werken: de kneedhaak grijpt het deeg dan niet goed vast, waardoor het langs de kuipwand blijft plakken zonder goed bewerkt te worden. Verder is machinaal kneden minder geschikt bij deeg waarin men bewust weinig glutenontwikkeling wil, zoals bij bepaalde koekjes- of taartdeeg, waar te veel gluten juist voor een taaie textuur zorgt in plaats van de gewenste kruimeligheid.",
        "keyPoints": [
          "Delicate, hoog-gehydrateerde zuurdesembroden profiteren vaak van handtechnieken",
          "Kleine deeghoeveelheden worden slecht gegrepen door grote machines",
          "Bij laag-glutendeeg zoals koekjesdeeg is machinaal kneden ongewenst",
          "Overmatig mechanisch werk kan luchtige structuren juist verstoren"
        ],
        "relatedKnowledge": [
          "Stretch and fold",
          "Koekjesdeeg",
          "Hoge hydratatie"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten bij machinaal kneden",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Windowpane-test",
          "Autolyse"
        ],
        "mistakes": [
          {
            "mistake": "Te lang kneden op hoge snelheid",
            "cause": "De bakker vertrouwt op een vaste kneedtijd uit een recept zonder te controleren op de daadwerkelijke gluten-ontwikkeling",
            "solution": "Controleer regelmatig met de windowpane-test en pas de kneedtijd aan op basis van het gedrag van het deeg, niet alleen op de klok"
          },
          {
            "mistake": "Alle ingrediënten in één keer op hoge snelheid toevoegen",
            "cause": "Haast of onbekendheid met de juiste opbouw van snelheden tijdens het kneedproces",
            "solution": "Start altijd op lage snelheid om te mengen, verhoog daarna geleidelijk om het glutennetwerk gecontroleerd op te bouwen"
          },
          {
            "mistake": "Geen rekening houden met warmteopbouw door de machine",
            "cause": "Wrijving tussen deeg en kneedhaak verhoogt de degtemperatuur, wat de gisting kan versnellen",
            "solution": "Gebruik gekoeld water of laat het deeg tussentijds rusten in de koeling, en meet de degtemperatuur na het kneden"
          },
          {
            "mistake": "Een te grote of te kleine machine gebruiken voor de hoeveelheid deeg",
            "cause": "De kneedhaak kan het deeg niet goed grijpen als de hoeveelheid niet overeenkomt met de kuipgrootte",
            "solution": "Kies een machine met een kuipvolume dat past bij de deeghoeveelheid, of pas de receptgrootte aan"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's advies",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "doughbertTip": "Vertrouw nooit blindelings op de kneedtijd uit een recept. Machines verschillen enorm in kracht en snelheid, dus gebruik de klok als richtlijn en de windowpane-test als waarheid: trek een klein stukje deeg voorzichtig uit tot een dun vlies. Is dit vlies elastisch en breekt het pas bij verdere rek met een rond gaatje, dan is het glutennetwerk goed ontwikkeld — onafhankelijk van hoe lang de machine precies heeft gedraaid."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "faq": [
          {
            "question": "Hoe lang moet ik machinaal kneden?",
            "answer": "Dat verschilt per machine en deegsoort, maar gemiddeld duurt machinaal kneden tussen de 5 en 15 minuten. Een spiraalmixer werkt vaak langer maar zachter, terwijl een krachtige planetaire mixer op hoge snelheid het glutennetwerk sneller opbouwt. Gebruik altijd de windowpane-test om het resultaat te controleren in plaats van uitsluitend op tijd te vertrouwen."
          },
          {
            "question": "Kan machinaal kneden mijn deeg beschadigen?",
            "answer": "Ja, dit heet overkneden. Bij te lang of te snel kneden breekt het glutennetwerk juist af in plaats van dat het zich verder ontwikkelt, wat leidt tot een plakkerig, slap deeg dat zijn structuur verliest tijdens het rijzen en bakken."
          },
          {
            "question": "Moet ik autolyse toepassen als ik machinaal knee?",
            "answer": "Autolyse, het laten rusten van bloem en water vóór het toevoegen van zout en gist, kan ook bij machinaal kneden waardevol zijn. Het versnelt de hydratatie van de gluten, waardoor de daadwerkelijke kneedtijd in de machine korter kan zijn en het risico op overkneden afneemt."
          },
          {
            "question": "Welke snelheid moet ik gebruiken op mijn kneedmachine?",
            "answer": "Begin altijd op de laagste snelheid om de ingrediënten te mengen tot een samenhangend deeg. Verhoog daarna geleidelijk naar een middelhoge snelheid om het glutennetwerk te ontwikkelen. Zeer hoge snelheden zijn meestal alleen nodig bij specifieke deegsoorten en brengen een verhoogd risico op overkneden en warmteopbouw met zich mee."
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
            "title": "De eerste kneedmachines waren stoomaangedreven",
            "fact": "Al aan het einde van de negentiende eeuw experimenteerden bakkerijen met mechanische kneders aangedreven door stoommachines, decennia vóór de introductie van elektrische mixers in de huishoudelijke keuken."
          },
          {
            "title": "Spiraalmixers zijn ontwikkeld om warmte te beperken",
            "fact": "De kenmerkende spiraalvorm van de kneedhaak in professionele mixers is specifiek ontworpen om het deeg met een rollende beweging te bewerken, wat minder wrijvingswarmte genereert dan andere kneedmethoden bij vergelijkbare intensiteit."
          }
        ]
      }
    ]
  }
});

export const autolyseKnowledgeBite = defineKnowledgeBite({
  "slug": "autolyse",
  "categoryId": "technieken",
  "title": "Autolyse",
  "libraryOrder": 3,
  "status": "published",
  "metadata": {
    "subtitle": "Hoe een simpele wachttijd tussen bloem en water je brood structuur, smaak en werkbaarheid geeft",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "Autolyse",
      "Broodbaktechniek",
      "Deegbereiding",
      "Gluten",
      "Hydratatie"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Autolyse is een van de meest invloedrijke technieken in het moderne broodbakken: je mengt alleen bloem en water en laat dit mengsel een tijdje met rust voordat je zout, gist of desem toevoegt. Deze schijnbaar passieve stap doet ontzettend veel achter de schermen — van gluidvorming tot enzymwerking — en verandert daarmee zowel de textuur van het deeg als de kwaliteit van het uiteindelijke brood. In dit artikel leggen we uit wat er precies gebeurt tijdens autolyse, wanneer je de techniek wel en niet inzet, en welke fouten bakkers het vaakst maken.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is autolyse precies?",
        "body": "Autolyse is een voorbereidende stap waarbij je uitsluitend bloem en water mengt tot een ruwe, plakkerige massa, en dit mengsel vervolgens laat rusten — meestal tussen de twintig minuten en een uur, soms langer. Pas na deze rustperiode voeg je de overige ingrediënten toe: zout, gist, desemstarter en eventuele andere toevoegingen. De term komt van de Franse bakkeriedocent Raymond Calvel, die de techniek in de jaren zeventig populariseerde als middel om de kneedtijd te verkorten en tegelijk de smaak en structuur van Frans brood te verbeteren. Het idee is simpel maar krachtig: door bloem en water zonder verstoring te laten samenwerken, ontstaat er al een aanzienlijke hoeveelheid glutenstructuur voordat er ook maar één klap gekneed is.",
        "keyPoints": [
          "Autolyse betekent letterlijk 'zelfvertering', verwijzend naar de enzymatische activiteit die tijdens de rust plaatsvindt",
          "Alleen bloem en water worden gemengd; zout en gist volgen pas na de rustperiode",
          "De techniek werd populair gemaakt door bakkerijdocent Raymond Calvel",
          "Rusttijden variëren doorgaans van 20 minuten tot enkele uren, afhankelijk van het gewenste effect"
        ],
        "relatedKnowledge": [
          "Gluten",
          "Kneden",
          "Hydratatie",
          "Broodbloem"
        ]
      },
      {
        "id": "science",
        "title": "Wat gebeurt er tijdens de rust?",
        "body": "Zodra bloem in contact komt met water, beginnen twee eiwitten — gliadine en glutenine — spontaan met elkaar te verbinden tot glutenstrengen, ook zonder mechanische kneedactie. Water dringt de eiwitstructuur binnen, eiwitten ontvouwen zich gedeeltelijk en vormen nieuwe bindingen, waardoor er al een los netwerk van gluten ontstaat voordat je begint met kneden. Tegelijkertijd gaan de van nature in bloem aanwezige enzymen aan het werk: amylases breken een deel van het zetmeel af tot eenvoudigere suikers, wat later fermentatie en bruining ten goede komt, en proteases knippen voorzichtig aan de eiwitketens, wat het deeg soepeler en rekbaarder maakt. Het resultaat van deze combinatie van chemische en enzymatische processen is een deeg dat na de rustperiode al veel homogener aanvoelt, minder plakkerig is en makkelijker uit te rekken valt dan een deeg dat direct na het mengen gekneed zou worden.",
        "keyPoints": [
          "Gliadine en glutenine vormen spontaan glutenverbindingen zodra ze met water in contact komen",
          "Amylases zetten zetmeel om in suikers, wat fermentatie en korstkleur bevordert",
          "Proteases verzachten de eiwitstructuur, wat de rekbaarheid van het deeg verhoogt",
          "Het deeg wordt na autolyse merkbaar minder plakkerig en soepeler zonder extra kneedwerk"
        ],
        "relatedKnowledge": [
          "Enzymen in bloem",
          "Gluten",
          "Fermentatie"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer autolyse inzetten",
        "body": "Autolyse is bijzonder waardevol bij het bakken van brood met een relatief hoge hydratatie, zoals landbrood, ciabatta of vrijstaand desembrood, waar een sterk maar toch soepel glutennetwerk essentieel is voor een goede open kruim. Ook wanneer je met volkorenmeel of andere volle granen werkt, helpt autolyse de zemelen de tijd te geven water op te nemen en zachter te worden, zodat ze minder snel scherpe randen in het glutennetwerk veroorzaken. Bakkers die kneedtijd willen verkorten — bijvoorbeeld bij handmatig kneden of bij het werken met minder krachtige mixers — profiteren eveneens sterk van de techniek, omdat een groot deel van het gluidwerk al 'gratis' gebeurt tijdens de rust.",
        "keyPoints": [
          "Ideaal voor hoog-hydratatie deeg zoals landbrood, ciabatta en vrijstaand desembrood",
          "Zeer nuttig bij volkoren- of meergranenrecepten om zemelen te verzachten",
          "Vermindert de benodigde kneedtijd, handig bij handmatig kneden",
          "Verbetert de rekbaarheid en verwerkbaarheid van het deeg aanzienlijk"
        ],
        "relatedKnowledge": [
          "Hoog-hydratatie deeg",
          "Volkorenbrood",
          "Handkneden"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer je autolyse beter kunt overslaan",
        "body": "Niet elk deeg heeft baat bij een autolysepauze. Bij zeer verrijkte deegsoorten met veel boter, suiker of eieren — denk aan brioche of croissantdeeg — heeft de techniek weinig meerwaarde, omdat de vetten en suikers de glutenvorming toch al vertragen en de structuur van dergelijke gebakken anders wordt opgebouwd. Ook bij snelle broodjes waarbij tijd juist een schaars goed is, zoals een doordeweekse maaltijdbrood-batch, weegt de extra wachttijd vaak niet op tegen de winst. Let bovendien op bij het gebruik van bloem met een zeer laag eiwitgehalte: hier is er simpelweg minder gluteneiwit aanwezig om tijdens de rust te ontwikkelen, waardoor het effect van autolyse beperkt blijft.",
        "keyPoints": [
          "Weinig nut bij verrijkte deegsoorten zoals brioche of croissantdeeg",
          "Overbodig bij snelle recepten waar tijd de beperkende factor is",
          "Beperkt effect bij bloem met een laag eiwitgehalte",
          "Overweeg altijd of de extra wachttijd in verhouding staat tot het gewenste resultaat"
        ],
        "relatedKnowledge": [
          "Verrijkt deeg",
          "Briochedeeg",
          "Eiwitgehalte bloem"
        ]
      },
      {
        "id": "comparison",
        "title": "Autolyse versus verwante technieken",
        "body": "Autolyse wordt vaak verward met fermentolyse, een variant waarbij je naast bloem en water ook al gist of desemstarter toevoegt vóór de rustperiode, terwijl het zout achterwege blijft. Fermentolyse start de fermentatie eerder op, wat de smaakontwikkeling versnelt, maar geeft de enzymen iets minder 'schone' tijd omdat de gistactiviteit meteen meespeelt. Een andere veelgebruikte term is 'stretch and fold zonder autolyse', waarbij bakkers direct na het mengen van alle ingrediënten beginnen met rekken en vouwen — dit werkt, maar vergt doorgaans meer herhalingen om hetzelfde niveau van glutenontwikkeling te bereiken.",
        "keyPoints": [],
        "relatedKnowledge": [
          "Fermentolyse",
          "Stretch and fold",
          "Desemstarter"
        ],
        "comparisonTable": {
          "caption": "Vergelijking van autolyse-gerelateerde technieken",
          "headers": [
            "Techniek",
            "Ingrediënten tijdens rust",
            "Belangrijkste effect",
            "Typische toepassing"
          ],
          "rows": [
            [
              "Autolyse",
              "Alleen bloem en water",
              "Vroege glutenvorming zonder fermentatie",
              "Landbrood, ciabatta, volkorenbrood"
            ],
            [
              "Fermentolyse",
              "Bloem, water en gist/desem (geen zout)",
              "Vroege glutenvorming én start van fermentatie",
              "Desembrood met tijdsdruk"
            ],
            [
              "Directe menging",
              "Alle ingrediënten tegelijk",
              "Glutenvorming volledig via kneden",
              "Snelle broodjes, verrijkt deeg"
            ]
          ]
        }
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten bij autolyse",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Zoutdosering",
          "Deegtemperatuur",
          "Kneedtechniek"
        ],
        "mistakes": [
          {
            "mistake": "Zout of gist toch tijdens de rustperiode toevoegen",
            "cause": "Onduidelijkheid over het verschil tussen autolyse en fermentolyse, of gewoon gewoonte",
            "solution": "Voeg zout en gist pas toe na de volledige rustperiode, zodat enzymen en gluten ongestoord hun werk kunnen doen"
          },
          {
            "mistake": "De autolyse te lang laten duren, vooral bij desemdeeg",
            "cause": "De aanname dat langer altijd beter is",
            "solution": "Houd je aan een rusttijd van 20 tot 60 minuten voor de meeste recepten; ga alleen langer bij bewust gekozen recepten met lage eiwitbloem"
          },
          {
            "mistake": "Het mengsel niet volledig hydrateren voor de rust begint",
            "cause": "Te kort of te snel mengen, waardoor droge bloemklontjes achterblijven",
            "solution": "Meng bloem en water grondig tot er geen droge plekken meer zichtbaar zijn voordat je het laat rusten"
          },
          {
            "mistake": "Autolyse toepassen bij zwaar verrijkt deeg",
            "cause": "Klakkeloos toepassen van de techniek op elk type deeg",
            "solution": "Reserveer autolyse voor eenvoudige brooddegen met overwegend bloem, water, zout en gist of desem"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughberts praktijktip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Deegtemperatuur",
          "Vochtabsorptie bloem"
        ],
        "doughbertTip": "Test de autolysetijd eerst met kleine batches en let op het verschil in elasticiteit vóór en na de rust: trek voorzichtig aan het deeg om te zien of het al soepel meegeeft zonder direct te scheuren. Zo bouw je gevoel op voor het exacte moment waarop jouw specifieke bloem en hydratatie het beste resultaat geven, in plaats van blind een standaardtijd uit een recept te volgen."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over autolyse",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Desembrood",
          "Broodbereiding"
        ],
        "faq": [
          {
            "question": "Kan ik autolyse combineren met desembrood?",
            "answer": "Ja, autolyse wordt veel gebruikt bij desembrood. Meng bloem en water, laat rusten, en voeg daarna pas de desemstarter en het zout toe. Wil je de fermentatie eerder laten starten, kies dan voor fermentolyse en voeg de starter al vóór de rust toe."
          },
          {
            "question": "Hoe lang moet een autolyse minimaal duren om effect te hebben?",
            "answer": "Al na twintig minuten is er meetbare glutenvorming zichtbaar, maar veel bakkers merken het duidelijkste verschil bij dertig tot zestig minuten rust."
          },
          {
            "question": "Moet ik het deeg afdekken tijdens de autolyse?",
            "answer": "Ja, dek het mengsel af met plasticfolie of een vochtige doek om uitdroging van de bovenkant te voorkomen, wat anders een korstje kan vormen dat lastig te verwerken is."
          },
          {
            "question": "Werkt autolyse ook met glutenvrije bloem?",
            "answer": "Nee, aangezien de techniek specifiek draait om de vorming van glutenstrengen uit gliadine en glutenine, heeft autolyse geen zinvol effect bij glutenvrije bloemmengsels."
          }
        ]
      },
      {
        "id": "did-you-know",
        "title": "Wist je dat...",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Broodgeschiedenis",
          "Enzymen in bloem"
        ],
        "didYouKnow": [
          {
            "title": "De naam verwijst naar zelfvertering",
            "fact": "Autolyse betekent letterlijk 'zichzelf oplossen' en verwijst naar de enzymen die van nature in bloem aanwezig zijn en tijdens de rust actief worden, zonder dat er externe hulpmiddelen aan te pas komen."
          },
          {
            "title": "Calvel gebruikte het om industrieel gekneed brood te verbeteren",
            "fact": "Raymond Calvel introduceerde de techniek deels als reactie op de smaakverarming die hij zag ontstaan door intensief mechanisch kneden in Franse bakkerijen na de Tweede Wereldoorlog."
          },
          {
            "title": "Autolyse vermindert oxidatie van de bloem",
            "fact": "Doordat er tijdens de rustperiode nog niet gekneed wordt, blijft de blootstelling aan zuurstof beperkt, wat volgens sommige bakkers bijdraagt aan het behoud van meer natuurlijke aroma's en een gelere kruimkleur."
          }
        ]
      }
    ]
  }
});

export const fermentolyseKnowledgeBite = defineKnowledgeBite({
  "slug": "fermentolyse",
  "categoryId": "technieken",
  "title": "Fermentolyse",
  "libraryOrder": 4,
  "status": "published",
  "metadata": {
    "subtitle": "Een verdiepende techniek die smaakontwikkeling en glutenvorming tegelijk op gang brengt",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "Fermentolyse",
      "Autolyse",
      "Broodbakken",
      "Deegtechniek",
      "Bulkfermentatie",
      "Desem"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Fermentolyse is een deegtechniek waarbij bloem, water en een fermentatiemiddel al vroeg samenkomen en samen rusten voordat er zout wordt toegevoegd. Het combineert de enzymatische voordelen van autolyse met een vroege start van de fermentatie, wat resulteert in complexere smaken en een soepeler deeg. In dit artikel leggen we uit hoe de techniek werkt, wanneer je hem inzet en welke valkuilen je moet vermijden.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is fermentolyse precies?",
        "body": "Fermentolyse is een variant op de klassieke autolyse, maar met een belangrijk verschil: waar bij autolyse alleen bloem en water worden gemengd en laten rusten, voeg je bij fermentolyse ook direct het fermentatiemiddel toe — gist of een actieve desemcultuur. Zout blijft in dit stadium nog achterwege, omdat zout de enzymatische activiteit en de fermentatiesnelheid vertraagt. Het mengsel van bloem, water en fermentatiemiddel rust vervolgens een periode van doorgaans twintig minuten tot een paar uur, afhankelijk van het recept, de bloemsoort en de gewenste intensiteit. Tijdens deze rust gebeurt er dubbel werk: de bloem hydrateert volledig en de enzymen breken zetmeel en eiwitten af, terwijl de gisten en (bij desem) melkzuurbacteriën tegelijkertijd al beginnen te fermenteren. Na de rustperiode wordt het zout toegevoegd en gaat het kneden of vouwen verder zoals gebruikelijk. De term is vooral bekend geworden binnen de artisanale desemgemeenschap, waar bakkers zoals Trevor Wilson de techniek beschreven als een manier om tijd efficiënter te benutten zonder in te leveren op structuur.",
        "keyPoints": [
          "Combinatie van bloem, water én fermentatiemiddel in de rustfase",
          "Zout wordt pas na de rustperiode toegevoegd",
          "Enzymatische afbraak en fermentatie starten gelijktijdig",
          "Populair binnen de desem- en artisanale broodwereld"
        ],
        "relatedKnowledge": [
          "autolyse",
          "bulkfermentatie",
          "desemstarter",
          "gluten-ontwikkeling"
        ]
      },
      {
        "id": "properties",
        "title": "Kenmerken en effecten op het deeg",
        "body": "Het meest opvallende effect van fermentolyse is de versnelde ontwikkeling van extensibiliteit: het deeg wordt sneller soepel en rekbaar zonder dat er intensief gekneed hoeft te worden. Dit komt doordat de enzymen — met name amylase en protease — al aan het werk zijn zodra bloem met water in contact komt, en dat proces wordt niet geremd door de aanwezigheid van zout. Daarnaast begint de fermentatie eerder dan bij een traditionele volgorde waarin je eerst mengt, kneedt, en dan pas op temperatuur laat rijzen. Dat vroege begin van de fermentatie zorgt voor een langere effectieve fermentatietijd binnen dezelfde totale proceslengte, wat resulteert in meer smaakstoffen zoals organische zuren en aromatische verbindingen. Het deeg voelt vaak losser en extensibieler aan na de fermentolyse-rust dan een vergelijkbaar deeg dat direct gekneed is.",
        "keyPoints": [
          "Versnelde extensibiliteit door vroege enzymwerking",
          "Langere effectieve fermentatietijd binnen hetzelfde tijdsbestek",
          "Meer smaakcomplexiteit door vroege zuurproductie",
          "Minder intensief kneden nodig"
        ],
        "relatedKnowledge": [
          "extensibiliteit",
          "enzymactiviteit",
          "smaakontwikkeling-brood"
        ]
      },
      {
        "id": "comparison",
        "title": "Fermentolyse versus autolyse en directe mix",
        "body": "Om het verschil helder te maken, is het nuttig om fermentolyse te vergelijken met de twee meest voorkomende alternatieven: de klassieke autolyse en de directe mix zonder rustfase.",
        "keyPoints": [],
        "relatedKnowledge": [
          "autolyse",
          "directe-deegmethode"
        ],
        "comparisonTable": {
          "caption": "Vergelijking van drie mengmethoden",
          "headers": [
            "Aspect",
            "Directe mix",
            "Autolyse",
            "Fermentolyse"
          ],
          "rows": [
            [
              "Samenstelling rustfase",
              "Geen rust, alles direct gemengd",
              "Bloem + water",
              "Bloem + water + fermentatiemiddel"
            ],
            [
              "Moment van zout",
              "Bij het mengen",
              "Na de rust",
              "Na de rust"
            ],
            [
              "Start fermentatie",
              "Bij het mengen",
              "Na de rust (bij toevoeging gist/desem)",
              "Tijdens de rust zelf"
            ],
            [
              "Effect op gluten",
              "Volledig via kneden",
              "Versnelde hydratatie en extensibiliteit",
              "Extensibiliteit én vroege fermentatiegeur"
            ],
            [
              "Tijdsbesparing",
              "Geen",
              "Matig (minder kneedtijd)",
              "Groter (rust en fermentatie lopen parallel)"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De wetenschap achter het proces",
        "body": "Zodra bloem met water in aanraking komt, treden endogene enzymen in werking. Amylase splitst zetmeelketens in kortere suikers, die als voedsel dienen voor gist en melkzuurbacteriën, terwijl protease de eiwitstructuur losser maakt en zo de glutenmatrix soepeler doet aanvoelen. Bij een klassieke autolyse gebeurt dit proces zonder dat er al fermentatie plaatsvindt, simpelweg omdat het fermentatiemiddel nog niet is toegevoegd. Bij fermentolyse start de microbiële activiteit direct: gistcellen beginnen suikers om te zetten in kooldioxide en ethanol, en bij gebruik van een desemcultuur beginnen melkzuur- en azijnzuurbacteriën ook meteen zuren te produceren. Omdat er nog geen zout aanwezig is — zout remt zowel enzymwerking als microbiële activiteit via osmotische druk — verlopen deze processen in dit stadium sneller dan normaal. Het resultaat is een deeg dat na de rustperiode al een voorsprong heeft op zowel structuur als smaakontwikkeling, wat vooral merkbaar is in de complexiteit van de uiteindelijke broodgeur en -smaak.",
        "keyPoints": [
          "Amylase en protease werken sneller zonder zout",
          "Gist en bacteriën beginnen direct met fermenteren",
          "Zout remt zowel enzymatische als microbiële activiteit",
          "Vroege zuurproductie draagt bij aan smaakdiepte"
        ],
        "relatedKnowledge": [
          "amylase",
          "protease",
          "melkzuurfermentatie",
          "zout-en-gluten"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer je fermentolyse inzet",
        "body": "Fermentolyse is bijzonder geschikt voor ambachtelijke broden met een hoge hydratatie, zoals landbrood, ciabatta of vrij gerezen desembrood, waar je toch al streeft naar een extensibel, goed te vormen deeg. Ook bij volkoren- of meergranenmeel, waarvan de zemelen extra hydratatietijd nodig hebben om de gluten niet te beschadigen, levert deze techniek waarde: de vroege rust met fermentatiemiddel zorgt dat het meel volledig hydrateert terwijl de fermentatie alvast op stoom komt. Bakkers met een strak tijdschema profiteren eveneens, omdat de gecombineerde rust- en fermentatiefase tijd bespaart ten opzichte van het na elkaar uitvoeren van autolyse en bulkfermentatie. Ook voor het ontwikkelen van complexere smaakprofielen in een relatief kort totaalproces is fermentolyse een waardevol hulpmiddel.",
        "keyPoints": [
          "Hoge-hydratatie broden en landbrood",
          "Volkoren- en meergranendeeg",
          "Wanneer tijdbesparing gewenst is",
          "Voor extra smaakdiepte in een compact schema"
        ],
        "relatedKnowledge": [
          "volkorenbrood",
          "hydratatie-deeg",
          "landbrood"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer je beter een andere methode kiest",
        "body": "Voor sterk verrijkte deegsoorten met veel boter, suiker of eieren — denk aan brioche of stollen — is fermentolyse minder logisch, omdat deze ingrediënten meestal pas later worden toegevoegd en de vroege fermentatie de balans in het recept kan verstoren. Ook bij gelamineerde deegsoorten zoals croissantdeeg is de techniek ongeschikt, omdat daar juist gecontroleerde, koude rust nodig is zonder actieve gisting die de laagjesstructuur kan aantasten. Verder is voorzichtigheid geboden bij zeer actieve of jonge desemstarters: als de fermentatie al tijdens de fermentolyse-rust te ver doorschiet, kan het deeg bij de daaropvolgende bulkfermentatie te snel over-fermenteren, met een plakkerig en moeilijk te vormen deeg als gevolg. In recepten waar juist een strak gecontroleerde, voorspelbare fermentatiecurve nodig is, kun je beter bij een traditionele volgorde blijven.",
        "keyPoints": [
          "Niet geschikt voor sterk verrijkte deegsoorten",
          "Vermijd bij gelamineerd deeg zoals croissants",
          "Risico op te snelle fermentatie bij zeer actieve starters",
          "Minder geschikt wanneer strakke controle nodig is"
        ],
        "relatedKnowledge": [
          "brioche",
          "croissantdeeg",
          "over-fermentatie"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "deegtemperatuur",
          "zoutdosering"
        ],
        "mistakes": [
          {
            "mistake": "Zout toch al bij het begin toevoegen",
            "cause": "Uit gewoonte of om tijd te besparen wordt zout meteen meegemengd",
            "solution": "Houd het zout apart en voeg het pas na de fermentolyse-rust toe, zodat enzymen en fermentatie ongeremd hun werk kunnen doen"
          },
          {
            "mistake": "De rustperiode te lang laten duren",
            "cause": "Verwarring met een gewone bulkfermentatietijd van uren",
            "solution": "Beperk de fermentolyse-rust doorgaans tot twintig minuten à een uur, afhankelijk van temperatuur en activiteit van het fermentatiemiddel"
          },
          {
            "mistake": "Een te actieve starter gebruiken zonder aanpassing",
            "cause": "Dezelfde hoeveelheid desem gebruiken als bij een normale methode zonder rekening te houden met de extra fermentatietijd",
            "solution": "Verlaag eventueel het percentage desem of verkort de totale bulktijd om over-fermentatie te voorkomen"
          },
          {
            "mistake": "Geen rekening houden met deegtemperatuur",
            "cause": "De temperatuur van het fermentolyse-mengsel wordt niet gecontroleerd",
            "solution": "Houd de omgevingstemperatuur en degtemperatuur in de gaten, want dit beïnvloedt zowel enzymwerking als fermentatiesnelheid direct"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's tip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "desemonderhoud",
          "deegplanning"
        ],
        "doughbertTip": "Test fermentolyse eerst met een korte rust van twintig tot dertig minuten en proef het verschil in extensibiliteit voordat je de tijd verlengt. Zo leer je het ritme van je eigen starter kennen zonder het risico op over-fermentatie."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "autolyse",
          "bulkfermentatie"
        ],
        "faq": [
          {
            "question": "Is fermentolyse hetzelfde als autolyse met gist erbij?",
            "answer": "In essentie wel: het is een autolyse-achtige rust waarbij het fermentatiemiddel al vanaf het begin aanwezig is, zodat fermentatie en enzymwerking gelijktijdig plaatsvinden in plaats van na elkaar."
          },
          {
            "question": "Moet ik bij fermentolyse altijd zout weglaten tijdens de rust?",
            "answer": "Ja, dat is een kernonderdeel van de techniek. Zout remt zowel de enzymatische afbraak als de microbiële activiteit, dus het wordt bewust pas na de rustperiode toegevoegd."
          },
          {
            "question": "Kan ik fermentolyse ook met commerciële gist toepassen, of is het alleen voor desem?",
            "answer": "Fermentolyse werkt met zowel commerciële gist als een desemcultuur. Bij gist verloopt de fermentatie doorgaans sneller en voorspelbaarder, terwijl desem meer complexiteit en zuurgraad toevoegt."
          },
          {
            "question": "Hoe lang moet de fermentolyse-rust duren?",
            "answer": "Dit varieert van ongeveer twintig minuten tot een paar uur, afhankelijk van bloemsoort, hydratatie, temperatuur en de activiteit van je fermentatiemiddel. Begin kort en bouw ervaring op."
          },
          {
            "question": "Vervangt fermentolyse de bulkfermentatie?",
            "answer": "Nee, het is een aanvulling op het proces vóór het kneden en de eigenlijke bulkfermentatie. Het versnelt en verrijkt de vroege fase, maar de bulkfermentatie na het kneden blijft nodig voor volledige rijzing."
          }
        ]
      },
      {
        "id": "did-you-know",
        "title": "Wist je dat?",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "desemgeschiedenis",
          "enzymen-in-bloem"
        ],
        "didYouKnow": [
          {
            "title": "Herkomst van de term",
            "fact": "De term fermentolyse werd populair binnen de online desemgemeenschap, mede dankzij bakkers die experimenteerden met het combineren van autolyse-achtige rust en vroege fermentatie in hun receptontwikkeling."
          },
          {
            "title": "Enzymen werken al binnen minuten",
            "fact": "Zodra bloem met water in contact komt, beginnen amylase en protease direct met hun afbrekende werking, nog voordat er sprake is van zichtbare gisting of rijzing."
          },
          {
            "title": "Zout als vertrager",
            "fact": "Zout werkt niet alleen op smaak, maar vertraagt via osmotische druk ook het watertransport in microbiële cellen, wat verklaart waarom het bij fermentolyse bewust wordt uitgesteld."
          }
        ]
      }
    ]
  }
});

export const stretchAndFoldKnowledgeBite = defineKnowledgeBite({
  "slug": "stretch-and-fold",
  "categoryId": "technieken",
  "title": "Stretch & Fold",
  "libraryOrder": 5,
  "status": "published",
  "metadata": {
    "subtitle": "Hoe je met een paar simpele bewegingen glutenstructuur opbouwt zonder te kneden",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "Stretch & Fold",
      "broodtechniek",
      "glutenontwikkeling",
      "artisanaal brood",
      "deegbehandeling"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Stretch & Fold is een deegbehandelingstechniek waarbij je het deeg tijdens de bulkfermentatie een aantal keer rekt en over zichzelf vouwt, in plaats van het intensief te kneden. Het is de sleutel tot het luchtige, open kruim van veel artisanale broden zoals ciabatta en zuurdesem, en tegelijk een techniek die verrassend weinig kracht en tijd vraagt.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is Stretch & Fold precies?",
        "body": "Stretch & Fold is een manier om glutenstructuur in deeg op te bouwen tijdens de bulkfermentatie, dus nadat het deeg al gemengd is en rust in de kom of bak. In plaats van tien minuten lang te kneden, til je het deeg aan één kant op, rek je het voorzichtig omhoog en vouw je het terug over de rest van het deeg. Dit herhaal je aan alle vier de zijden (of soms meer, afhankelijk van de methode), waarna het deeg weer terug in de kom gaat om verder te rijzen. Na 20 tot 40 minuten herhaal je de reeks, meestal twee tot vier keer in totaal gedurende de eerste uren van de bulkfermentatie. De techniek wordt veel gebruikt bij natte, plakkerige degen zoals die voor ciabatta, focaccia en zuurdesembrood, waarbij traditioneel kneden lastig is en vaak extra bloem vereist die de hydratatie en textuur verstoort. Stretch & Fold laat je de vochtigheid van het deeg juist behouden terwijl je toch structuur opbouwt.",
        "keyPoints": [
          "Wordt toegepast tijdens de bulkfermentatie, niet vooraf",
          "Bestaat uit rekken en terugvouwen van het deeg, meestal in vier bewegingen",
          "Wordt meestal twee tot vier keer herhaald met rustperiodes ertussen",
          "Ideaal voor natte, hoog gehydrateerde degen die moeilijk te kneden zijn"
        ],
        "relatedKnowledge": [
          "Bulkfermentatie",
          "Glutenontwikkeling",
          "Autolyse",
          "Hydratatie"
        ]
      },
      {
        "id": "science",
        "title": "De wetenschap: hoe bouwt dit gluten op?",
        "body": "Gluten ontstaat wanneer de eiwitten gliadine en glutenine in bloem in contact komen met water en vervolgens mechanisch worden uitgerekt en op elkaar uitgelijnd. Bij traditioneel kneden gebeurt dit door continue, intensieve beweging. Bij Stretch & Fold gebeurt het proces geleidelijker: elke keer dat je het deeg rekt, worden de glutenstrengen even uitgelijnd en versterkt. Tussen de vouwbeurten door krijgt het deeg tijd om te rusten, en tijdens die rust werkt het enzym protease op de eiwitten, wat het deeg soepeler en uitrekbaarder maakt, terwijl de gist ondertussen doorwerkt aan de fermentatie. Het resultaat is een deeg dat na een paar rondes stretch & fold aanzienlijk sterker en elastischer aanvoelt dan aan het begin, zonder dat je het intensief hebt moeten bewerken. Bovendien helpt de techniek om gasbelletjes die tijdens de fermentatie ontstaan gelijkmatiger te verdelen door het deeg, wat bijdraagt aan een opener, meer onregelmatig kruim met grote luchtholtes — een kenmerk dat bij artisanaal brood juist gewaardeerd wordt.",
        "keyPoints": [
          "Gluten wordt opgebouwd door herhaaldelijk rekken in plaats van continu kneden",
          "Rustperiodes tussen de vouwbeurten laten het deeg ontspannen en soepeler worden",
          "De techniek verdeelt gasbelletjes gelijkmatiger, wat een opener kruim geeft",
          "Fermentatie gaat gewoon door tijdens de rustperiodes"
        ],
        "relatedKnowledge": [
          "Glutennetwerk",
          "Fermentatie",
          "Enzymwerking in deeg"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer gebruik je Stretch & Fold?",
        "body": "Stretch & Fold komt het meest tot zijn recht bij degen met een hoge hydratatie, doorgaans vanaf ongeveer 70% waterpercentage, waarbij traditioneel kneden op het werkblad al snel resulteert in een klevende puinhoop. Denk aan ciabatta, focaccia, pain de campagne en de meeste zuurdesembroden. Ook bij degen die je liever niet te veel extra bloem wilt toevoegen tijdens het bewerken is deze techniek een uitkomst, omdat je alles gewoon in de kom of bak kunt uitvoeren. Daarnaast is het een gewaardeerde techniek voor thuisbakkers die fysiek minder makkelijk lang kunnen kneden, of die simpelweg een minder arbeidsintensieve manier zoeken om toch professioneel resultaat te bereiken. Veel zuurdesembakkers combineren Stretch & Fold ook met langere, koude bulkfermentaties, waarbij de vouwbeurten vroeg in het proces plaatsvinden en het deeg daarna verder rijst zonder verdere bewerking.",
        "keyPoints": [
          "Zeer geschikt voor hoog gehydrateerde degen vanaf circa 70% water",
          "Voorkomt de noodzaak om extra bloem toe te voegen tijdens het bewerken",
          "Praktisch alternatief voor langdurig handmatig kneden",
          "Combineert goed met koude, verlengde bulkfermentatie"
        ],
        "relatedKnowledge": [
          "Ciabatta",
          "Zuurdesembrood",
          "Hoge hydratatie degen"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer is Stretch & Fold minder geschikt?",
        "body": "Bij degen met een lage hydratatie, zoals stevige broodjes, koekdeeg of veel gebakken producten waarbij het deeg al vrij droog en stug is, heeft Stretch & Fold weinig zin: het deeg is dan simpelweg niet elastisch genoeg om goed te kunnen rekken en de techniek levert nauwelijks extra structuur op vergeleken met gewoon kneden. Ook bij zeer korte fermentatieprocessen, waarbij je weinig tijd hebt tussen mengen en vormen, is er onvoldoende ruimte om meerdere vouwrondes met rustperiodes in te plannen. Voor deeg dat juist een compacte, dichte structuur moet krijgen, zoals sommige koekjes- of gebaksdegen, is extra glutenontwikkeling zelfs ongewenst omdat het de textuur te taai kan maken. In die gevallen is gewoon mengen tot net samengebonden, of traditioneel kneden, de betere keuze.",
        "keyPoints": [
          "Weinig effectief bij lage hydratatie of stugge degen",
          "Vereist voldoende tijd tussen de vouwbeurten, dus niet geschikt voor snelle recepten",
          "Ongeschikt voor degen die juist compact en dicht moeten blijven",
          "Overmatige glutenontwikkeling kan bij sommige gebaksdegen ongewenst taai resultaat geven"
        ],
        "relatedKnowledge": [
          "Kortkneden",
          "Gebaksdeeg",
          "Minimale glutenontwikkeling"
        ]
      },
      {
        "id": "comparison",
        "title": "Stretch & Fold versus kneden",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Kneedtechnieken",
          "Bulkfermentatie",
          "Kruimstructuur"
        ],
        "comparisonTable": {
          "caption": "Vergelijking tussen Stretch & Fold en traditioneel kneden",
          "headers": [
            "Aspect",
            "Stretch & Fold",
            "Traditioneel kneden"
          ],
          "rows": [
            [
              "Moment in het proces",
              "Tijdens bulkfermentatie, in meerdere rondes",
              "Direct na het mengen, in één keer"
            ],
            [
              "Geschiktheid deeg",
              "Vooral hoog gehydrateerde, natte degen",
              "Vooral middelmatig tot laag gehydrateerde degen"
            ],
            [
              "Fysieke inspanning",
              "Kort en licht, verspreid over de tijd",
              "Intensief en langdurig in één keer"
            ],
            [
              "Extra bloem nodig",
              "Meestal niet",
              "Vaak wel, om plakken te voorkomen"
            ],
            [
              "Effect op kruimstructuur",
              "Meer onregelmatig, open kruim",
              "Vaak regelmatiger, fijner kruim"
            ],
            [
              "Tijdsinvestering totaal",
              "Verspreid over enkele uren met rustpauzes",
              "Geconcentreerd, korte periode"
            ]
          ]
        }
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Deeggevoel beoordelen",
          "Hydratatie management"
        ],
        "mistakes": [
          {
            "mistake": "Te agressief rekken waardoor het deeg scheurt",
            "cause": "Ongeduld of te weinig gevoel voor de elasticiteit van het deeg op dat moment",
            "solution": "Rek het deeg langzaam en stop zodra je weerstand voelt; laat het deeg zich zelf verder uitrekken in plaats van te forceren"
          },
          {
            "mistake": "Te weinig rusttijd tussen de vouwbeurten",
            "cause": "Haast om het proces te versnellen",
            "solution": "Houd minimaal 20 tot 30 minuten rust aan tussen elke ronde zodat het glutennetwerk kan ontspannen en zich kan herstellen"
          },
          {
            "mistake": "Te veel bloem gebruiken tijdens het vouwen om plakken te voorkomen",
            "cause": "Onbekendheid met natte degen of onzekerheid over de juiste techniek",
            "solution": "Bevochtig je handen licht met water in plaats van bloem te gebruiken, dit voorkomt plakken zonder de hydratatie van het deeg te verstoren"
          },
          {
            "mistake": "Stoppen na slechts één ronde terwijl het deeg nog slap aanvoelt",
            "cause": "Verwachten dat één ronde voldoende structuur oplevert",
            "solution": "Herhaal de reeks meerdere keren en beoordeel de voortgang op de veerkracht en gladheid van het deegoppervlak"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's tip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Windowpane test",
          "Glutenontwikkeling beoordelen"
        ],
        "doughbertTip": "Wil je weten of je deeg klaar is met stretch & fold of nog een rondje nodig heeft? Doe de 'windowpane test': trek een klein stukje deeg voorzichtig uit tot een dun, doorschijnend vlies. Scheurt het meteen met rafelige randen, dan is er nog gluten te ontwikkelen. Blijft het vlies intact en soepel, dan is je deeg klaar voor de volgende fase van de fermentatie."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Windowpane test",
          "Bulkfermentatie planning"
        ],
        "faq": [
          {
            "question": "Hoeveel rondes stretch & fold heb ik nodig?",
            "answer": "Dit varieert per recept en hydratatieniveau, maar meestal zijn twee tot vier rondes voldoende, met 20 tot 40 minuten rust ertussen. Bij zeer natte degen kunnen meer rondes nodig zijn om voldoende structuur op te bouwen."
          },
          {
            "question": "Kan ik stretch & fold combineren met kneden?",
            "answer": "Ja, sommige bakkers kneden kort om het deeg samen te brengen en gebruiken vervolgens stretch & fold tijdens de bulkfermentatie om de glutenstructuur verder te versterken zonder het deeg te veel te bewerken."
          },
          {
            "question": "Werkt stretch & fold ook bij deeg met lage hydratatie?",
            "answer": "Het effect is minder uitgesproken bij stugge, lage-hydratatie degen omdat deze minder uitrekbaar zijn. Bij dit type deeg levert traditioneel kneden vaak sneller en effectiever resultaat op."
          },
          {
            "question": "Moet ik het deeg uit de kom halen om te vouwen?",
            "answer": "Niet noodzakelijk. Veel bakkers voeren stretch & fold direct uit in de rijsbak of kom, wat het deeg minder verstoort dan het volledig op een werkblad te leggen."
          }
        ]
      },
      {
        "id": "did-you-know",
        "title": "Wist je dat?",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "Coil fold",
          "Ciabatta geschiedenis"
        ],
        "didYouKnow": [
          {
            "title": "Oorsprong in de Italiaanse bakkerij",
            "fact": "Stretch & Fold werd populair dankzij bakkers die ciabatta en andere natte Italiaanse broden maakten, waarbij traditioneel kneden simpelweg niet praktisch was door de plakkerigheid van het deeg."
          },
          {
            "title": "Ook bekend als 'coil fold'",
            "fact": "Een variant genaamd de coil fold, waarbij je het deeg optilt en het onder zichzelf laat vallen als een rol, wordt tegenwoordig veel gebruikt bij zeer natte zuurdesemdegen als alternatief voor de klassieke vier-hoeken vouw."
          }
        ]
      }
    ]
  }
});

export const coilFoldKnowledgeBite = defineKnowledgeBite({
  "slug": "coil-fold",
  "categoryId": "technieken",
  "title": "Coil Fold",
  "libraryOrder": 6,
  "status": "published",
  "metadata": {
    "subtitle": "Hoe deze eenvoudige vouwmethode structuur opbouwt zonder je deeg te verscheuren",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "Coil Fold",
      "Deegtechniek",
      "Sourdough",
      "Broodbakken",
      "Hydratatie"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Coil Fold is een deegvouwtechniek waarbij je het deeg met beide handen optilt en onder zichzelf laat vouwen, zonder te trekken of te persen. De methode is razendsnel populair geworden binnen de sourdough-gemeenschap omdat ze glutenstructuur opbouwt met minimale kracht en maximale deegintegriteit. Dit artikel legt uit hoe de techniek werkt, wanneer je hem inzet en welke fouten je moet vermijden.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is Coil Fold precies?",
        "body": "Coil Fold, ook wel 'coil folding' genoemd, is een vouwtechniek die met name is ontstaan binnen de moderne sourdough-bakcultuur als alternatief voor traditioneel kneden en de klassieke stretch and fold. Bij Coil Fold til je het midden van het deeg met natte of licht bebloemde handen op, waardoor de onderkant van het deeg als vanzelf onder zichzelf doorvouwt — vergelijkbaar met hoe een handdoek zich opkrult wanneer je hem in het midden optilt. Je herhaalt dit aan alle vier de zijden van de kom of het bakje, waarna het deeg weer even met rust wordt gelaten. De naam verwijst naar de spiraalvormige, 'gekruide' beweging die het deeg maakt tijdens het optillen: het rolt zichzelf als het ware op, in plaats van dat het wordt uitgerekt en teruggevouwen zoals bij stretch and fold.",
        "keyPoints": [
          "Ontwikkeld binnen de moderne sourdough-praktijk als kneedvrij alternatief",
          "Werkt door het deeg op te tillen, niet door het te rekken of te persen",
          "Ideaal voor deeg dat in een kom of bak blijft rusten tussen de vouwen",
          "Vier herhalingen (rondom de bak) vormen doorgaans één volledige vouwbeurt"
        ],
        "relatedKnowledge": [
          "Stretch and Fold",
          "Autolyse",
          "Bulk Fermentatie",
          "Hoog-hydratatie deeg"
        ]
      },
      {
        "id": "properties",
        "title": "Kenmerken en werking van de techniek",
        "body": "Wat Coil Fold onderscheidt van andere vouwmethoden is de afwezigheid van laterale spanning. Waar je bij stretch and fold het deeg actief uitrekt, wordt bij Coil Fold enkel de zwaartekracht benut: het gewicht van het hangende deeg zorgt voor de rek, terwijl jouw handen slechts het middenstuk optillen en laten zakken. Dit maakt de techniek bijzonder geschikt voor natte, slappe of zeer hoog-hydratatie deeg, waarbij te veel handmatige rek al snel tot scheuren in het glutennetwerk leidt. Doordat het deeg tijdens de vouwbeweging als een soepele lus onder zichzelf doorvalt, wordt lucht die al in het deeg zit mooi verdeeld in plaats van eruit geperst, en blijft de gasretentie van de bulkfermentatie intact.",
        "keyPoints": [
          "Gebruikt zwaartekracht in plaats van handkracht om spanning op te bouwen",
          "Zeer geschikt voor natte, plakkerige of extensibele deegsoorten",
          "Behoudt gasbelletjes beter dan technieken met actieve rek",
          "Kan direct in de rijsbak of kom worden uitgevoerd, zonder werkblad"
        ],
        "relatedKnowledge": [
          "Glutennetwerk",
          "Gasretentie",
          "Extensibiliteit van deeg"
        ]
      },
      {
        "id": "comparison",
        "title": "Coil Fold versus andere vouwtechnieken",
        "body": "Binnen het bredere landschap van deegbewerkingen bestaat een schaal van intensiteit: van rustig laten rijzen, via lichte vouwtechnieken, tot intensief kneden. Coil Fold positioneert zich als een van de zachtste opties op die schaal, en verschilt op een paar belangrijke punten van zijn bekendere neven.",
        "keyPoints": [],
        "relatedKnowledge": [
          "Kneden",
          "Slap and Fold",
          "Letter Fold"
        ],
        "comparisonTable": {
          "caption": "Vergelijking van veelgebruikte deegbewerkingstechnieken",
          "headers": [
            "Techniek",
            "Kracht op deeg",
            "Beste voor",
            "Locatie uitvoering"
          ],
          "rows": [
            [
              "Coil Fold",
              "Zeer laag (zwaartekracht)",
              "Nat, hoog-hydratatie, sourdough",
              "In kom of bak"
            ],
            [
              "Stretch and Fold",
              "Laag tot gemiddeld (actieve rek)",
              "Middelmatig hydratatie deeg",
              "In kom of op werkblad"
            ],
            [
              "Slap and Fold",
              "Hoog (kneedvervanger)",
              "Stevig, laag-hydratatie deeg",
              "Op werkblad"
            ],
            [
              "Klassiek kneden",
              "Hoog (continue mechanische kracht)",
              "Brooddeeg algemeen",
              "Op werkblad"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De baktechnische achtergrond",
        "body": "Glutenontwikkeling ontstaat door het uitlijnen en verknopen van glutenine- en gliadine-eiwitten die samen het elastische netwerk vormen dat CO2 tijdens de fermentatie vasthoudt. Traditioneel kneden bereikt dit door voortdurende mechanische bewerking, maar bij hoog-hydratatie deeg (doorgaans boven de 75% waterpercentage) is dat lastig: het deeg is te slap om te kneden zonder aan het werkblad te blijven plakken. Coil Fold lost dit op door de opbouw van structuur te spreiden over meerdere korte momenten tijdens de bulkfermentatie, in plaats van één intensieve sessie vooraf. Elke vouwbeurt lijnt een deel van de glutenstrengen opnieuw uit en perst kleine gasbelletjes samen tot een fijnere, gelijkmatigere celstructuur, terwijl de rusttijd tussen de vouwen (meestal 30 tot 60 minuten) de gluten laat ontspannen en verder laat hydrateren dankzij lopende enzymwerking.",
        "keyPoints": [
          "Verdeelt glutenopbouw over meerdere korte momenten tijdens bulkfermentatie",
          "Werkt samen met autolyse en enzymatische hydratatie van het meel",
          "Bevordert een fijnere, gelijkmatigere kruimstructuur",
          "Vermindert kans op afbraak van het glutennetwerk bij zeer nat deeg"
        ],
        "relatedKnowledge": [
          "Glutenine en gliadine",
          "Enzymwerking in deeg",
          "Bulkfermentatietijd"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer gebruik je Coil Fold",
        "body": "Coil Fold komt het best tot zijn recht bij deegsoorten waarbij traditioneel kneden of stevig rekken eerder averechts werkt dan helpt. Denk aan zuurdesembrood met hydratatieniveaus vanaf ongeveer 75%, focaccia, ciabatta en andere natte broodtypen waarbij open, onregelmatige kruim gewenst is. Ook bij deeg met een hoog percentage bloem met sterk gluten (zoals bepaalde tarwesoorten of speltmengsels) is Coil Fold een prettige manier om structuur op te bouwen zonder het deeg te overbelasten. De techniek wordt doorgaans meerdere keren toegepast tijdens de bulkfermentatie, met rustpauzes ertussen, en is bijzonder geschikt in combinatie met een lange, koele autolyse voorafgaand aan het kneden.",
        "keyPoints": [
          "Hydratatieniveaus vanaf circa 75% zijn ideaal",
          "Geschikt voor focaccia, ciabatta en open-kruim zuurdesembrood",
          "Werkt goed in combinatie met autolyse",
          "Meestal 3 tot 4 vouwbeurten verspreid over de bulkfermentatie"
        ],
        "relatedKnowledge": [
          "Focaccia",
          "Ciabatta",
          "Hoog-hydratatie zuurdesem"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer is Coil Fold minder geschikt",
        "body": "Bij stevig, laag-hydratatie deeg zoals klassiek witbrood, brioche of stevige bagel-deegsoorten schiet Coil Fold tekort: het deeg is simpelweg te compact en te weinig extensibel om er goed onder te grijpen of op te tillen, waardoor de vouwbeweging niet het gewenste effect van zwaartekracht-gestuurde rek geeft. In die gevallen is intensief kneden of slap and fold een efficiëntere route naar volledige glutenontwikkeling. Ook voor deeg dat juist een dichte, fijne kruim moet krijgen (zoals bij bepaalde sandwichbroden) is Coil Fold minder functioneel, omdat de techniek van nature juist onregelmatige, grotere luchtbellen bevordert.",
        "keyPoints": [
          "Ongeschikt voor stevig, laag-hydratatie deeg zoals brioche of witbrood",
          "Minder effectief wanneer deeg niet extensibel genoeg is om op te tillen",
          "Niet ideaal wanneer een fijne, dichte kruimstructuur gewenst is",
          "Kneden of slap and fold zijn dan efficiëntere alternatieven"
        ],
        "relatedKnowledge": [
          "Brioche",
          "Sandwichbrood",
          "Slap and Fold"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten bij Coil Fold",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "mistakes": [
          {
            "mistake": "Te vroeg beginnen met vouwen",
            "cause": "Het deeg heeft nog geen enkele autolyse of rusttijd gehad, waardoor het gluten nog niet voldoende gehydrateerd is",
            "solution": "Laat het deeg eerst 20 tot 60 minuten rusten na het mengen voordat je de eerste vouwbeurt uitvoert"
          },
          {
            "mistake": "Te hard trekken tijdens het optillen",
            "cause": "De aanname dat meer kracht sneller structuur oplevert, terwijl Coil Fold juist draait om zwaartekracht",
            "solution": "Til het deeg rustig op tot het net begint te scheuren en laat het dan direct terugvallen"
          },
          {
            "mistake": "Te weinig vouwbeurten geven",
            "cause": "Denken dat één of twee keer vouwen voldoende structuur oplevert voor hoog-hydratatie deeg",
            "solution": "Plan minimaal drie tot vier vouwbeurten met 30 tot 45 minuten rust ertussen tijdens de bulkfermentatie"
          },
          {
            "mistake": "Vouwen te laat in de bulkfermentatie",
            "cause": "Het deeg is al te ver gerezen en verliest structuur en gas bij het vouwen in plaats van dat het structuur opbouwt",
            "solution": "Voer de laatste vouwbeurt uit ruim voordat het deeg zijn piekvolume nadert, meestal in de eerste helft van de bulkfermentatie"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's aanbevolen aanpak",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "doughbertTip": "Maak je handen of vingers licht nat met water voordat je een Coil Fold uitvoert — dit voorkomt dat het deeg aan je vingers blijft plakken en dat je onbedoeld toch aan het deeg gaat trekken. Werk bovendien altijd in dezelfde kom of bak waarin het deeg fermenteert; zo voorkom je onnodig transport en warmteverlies, en behoud je het momentum van de bulkfermentatie."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over Coil Fold",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "faq": [
          {
            "question": "Hoe vaak moet ik Coil Fold toepassen tijdens één bulkfermentatie?",
            "answer": "Doorgaans wordt drie tot vier keer gevouwen, met tussenpozen van 30 tot 45 minuten. Bij zeer nat of zwak deeg kunnen extra beurten nodig zijn, terwijl steviger deeg vaak genoeg heeft aan twee of drie."
          },
          {
            "question": "Kan ik Coil Fold combineren met stretch and fold?",
            "answer": "Ja, veel bakkers beginnen met een of twee stretch and folds direct na het mengen om snel wat basisstructuur op te bouwen, en schakelen daarna over op Coil Fold zodra het deeg te nat of te fragiel wordt voor verdere actieve rek."
          },
          {
            "question": "Is Coil Fold een vervanging voor kneden?",
            "answer": "Voor hoog-hydratatie en sourdough-deeg vaak wel, mits gecombineerd met voldoende rusttijd en eventueel autolyse. Voor stevig, laag-hydratatie deeg is traditioneel kneden meestal nog altijd effectiever."
          },
          {
            "question": "Waarom scheurt mijn deeg tijdens het optillen?",
            "answer": "Een licht scheurtje aan de randen is normaal en zelfs gewenst als signaal dat je genoeg spanning hebt opgebouwd. Scheurt het deeg echter volledig door, dan is het waarschijnlijk nog onvoldoende gehydrateerd of heeft het te weinig rusttijd gehad."
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
            "title": "Populair dankzij online bakgemeenschappen",
            "fact": "Coil Fold werd wereldwijd bekend door thuisbakkers en sourdough-bloggers die de techniek deelden als oplossing voor het lastige werken met zeer nat deeg, en groeide binnen enkele jaren uit tot standaardpraktijk in menig bakboek."
          },
          {
            "title": "Ook bruikbaar voor grote deegbatches",
            "fact": "Omdat Coil Fold weinig fysieke inspanning vergt vergeleken met kneden, wordt de techniek ook in kleinschalige bakkerijen toegepast bij grotere hoeveelheden deeg, waar traditioneel kneden fysiek te belastend zou zijn."
          }
        ]
      }
    ]
  }
});

/** All technieken articles — generated by Atlas' real content pipeline (see
 * scripts/atlas/contentGenerationEngine.ts), reviewed and approved via the CEO Inbox.
 * Add new articles in this category here, not in bulk/catalogArticles.ts. */
export const techniekenArticles: KnowledgeArticleInput[] = [
  definitionToArticleInput(machinaalKnedenKnowledgeBite),
  definitionToArticleInput(autolyseKnowledgeBite),
  definitionToArticleInput(fermentolyseKnowledgeBite),
  definitionToArticleInput(stretchAndFoldKnowledgeBite),
  definitionToArticleInput(coilFoldKnowledgeBite),
];
