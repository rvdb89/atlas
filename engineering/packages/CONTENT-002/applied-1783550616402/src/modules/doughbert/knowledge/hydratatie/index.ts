import { defineKnowledgeBite } from "../helpers";
import { definitionToArticleInput } from "../import/articleNormalizer";
import type { KnowledgeArticleInput } from "@/types/knowledgeArticleInput";

export const hydratatieKnowledgeBite = defineKnowledgeBite({
  "slug": "hydratatie",
  "categoryId": "hydratatie",
  "title": "Hydratatie",
  "libraryOrder": 1,
  "status": "published",
  "metadata": {
    "subtitle": "Waarom de verhouding tussen water en bloem bepaalt of je brood dicht of luchtig, stevig of open wordt",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "hydratatie",
      "deegbereiding",
      "broodbakken",
      "bakkerstechniek",
      "glutenontwikkeling"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Hydratatie is een van de meest bepalende factoren in het bakproces: het beschrijft de verhouding tussen water en bloem in een deeg en beïnvloedt vrijwel alles, van de kruimelstructuur tot de korst. Dit artikel legt uit wat hydratatie precies inhoudt, hoe je het berekent, welke effecten verschillende niveaus hebben en hoe je dit kennis in de praktijk toepast.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is hydratatie precies?",
        "body": "Hydratatie is de bakkersterm voor de hoeveelheid water (of andere vloeistof) ten opzichte van de hoeveelheid bloem in een deeg, uitgedrukt als percentage. Dit percentage wordt berekend volgens het bakkerspercentage-systeem, waarbij de totale hoeveelheid bloem altijd op 100% wordt gesteld. Gebruik je bijvoorbeeld 1000 gram bloem en 700 gram water, dan spreek je van een hydratatie van 70%. Alle overige ingrediënten, zoals zout, gist of olie, worden eveneens als percentage van de bloem uitgedrukt, maar het is de waterverhouding die de grootste invloed heeft op het gedrag van het deeg tijdens het kneden, rijzen en bakken.\n\nHydratatie is geen vast getal dat voor elk recept hetzelfde is. Het varieert sterk per broodtype: een compact bruikbaar bruinbrood kan uitkomen op 55-60%, terwijl een open, luchtige ciabatta of pain de campagne al snel richting 75-85% gaat. Sommige extreme recepten, zoals bepaalde focaccia's of no-knead broden, bewegen zich zelfs boven de 90%.",
        "keyPoints": [
          "Hydratatie = hoeveelheid water gedeeld door hoeveelheid bloem, uitgedrukt in procenten",
          "Wordt berekend via het bakkerspercentage-systeem waarbij bloem altijd 100% is",
          "Varieert doorgaans tussen 55% (compact brood) en 90%+ (zeer open structuren)",
          "Is de belangrijkste variabele voor de uiteindelijke kruimelstructuur"
        ],
        "relatedKnowledge": [
          "bakkerspercentage",
          "autolyse",
          "glutenontwikkeling"
        ]
      },
      {
        "id": "properties",
        "title": "Wat doet hydratatie met je deeg?",
        "body": "Het waterpercentage beïnvloedt bijna elke fase van het bakproces. Tijdens het kneden bepaalt hydratatie hoe elastisch en plakkerig het deeg aanvoelt: hoe meer water, hoe losser en soepeler het glutennetwerk zich kan vormen, maar ook hoe lastiger het deeg te hanteren is. Bij lage hydratatie ontstaat een strak, stevig deeg dat makkelijk vorm houdt maar minder rekbaar is. Bij hoge hydratatie ontstaat een los, bijna vloeibaar deeg dat om andere kneed- en vouwtechnieken vraagt, zoals stretch-and-fold in plaats van traditioneel kneden op het aanrecht.\n\nTijdens de rijs speelt hydratatie eveneens een rol: meer water betekent doorgaans een actievere gistwerking omdat enzymen en gist beter kunnen bewegen in een vochtiger milieu. Dit versnelt de fermentatie enigszins en kan zorgen voor een opener, onregelmatiger kruimstructuur met grotere luchtbellen. Tot slot beïnvloedt hydratatie ook de korst: nattere degen produceren tijdens het bakken meer stoom in de oven, wat resulteert in een dunnere, knapperigere korst, terwijl droger deeg vaak een dikkere, zachtere korst geeft.",
        "keyPoints": [
          "Hoger watergehalte = losser, rekbaarder gluten maar lastiger te hanteren deeg",
          "Beïnvloedt de snelheid en het verloop van de fermentatie",
          "Bepaalt mede de grootte en regelmatigheid van de luchtbellen in de kruim",
          "Nattere degen geven meer oven-stoom en dus vaak een dunnere, knapperige korst"
        ],
        "relatedKnowledge": [
          "stretch-and-fold",
          "kruimelstructuur",
          "ovenspring"
        ]
      },
      {
        "id": "comparison",
        "title": "Hydratatieniveaus vergeleken",
        "body": "Onderstaand overzicht geeft een praktisch beeld van hoe hydratatiepercentages zich verhouden tot bekende broodtypen en hun kenmerken. Dit zijn richtwaarden; het exacte percentage hangt ook af van het type bloem, het eiwitgehalte en de gewenste textuur.",
        "keyPoints": [],
        "relatedKnowledge": [
          "ciabatta",
          "focaccia",
          "baguette"
        ],
        "table": {
          "caption": "Hydratatieniveaus en hun typische toepassingen",
          "headers": [
            "Hydratatie",
            "Voorbeeld broodtype",
            "Textuur & werkbaarheid"
          ],
          "rows": [
            [
              "55-60%",
              "Toastbrood, sandwichbrood",
              "Stevig, elastisch deeg, makkelijk te vormen, fijne gelijkmatige kruim"
            ],
            [
              "60-65%",
              "Bruinbrood, baguette (klassiek)",
              "Soepel deeg, goed hanteerbaar, gemiddelde kruimelopenheid"
            ],
            [
              "65-75%",
              "Pain de campagne, landbrood",
              "Plakkeriger deeg, vraagt vouwtechnieken, opener kruim"
            ],
            [
              "75-85%",
              "Ciabatta, focaccia",
              "Zeer los en nat deeg, minimaal kneden, grote onregelmatige luchtbellen"
            ],
            [
              "85%+",
              "Extreme no-knead broden, sommige pizzadegen",
              "Bijna vloeibaar deeg, uitsluitend te verwerken met vouwen en rusten"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De wetenschap achter waterabsorptie",
        "body": "De reden dat hydratatie zo'n grote invloed heeft, ligt in de manier waarop bloem water opneemt. Bloem bevat de eiwitten glutenine en gliadine, die samen met water het glutennetwerk vormen zodra er kneedenergie wordt toegevoegd. Water is nodig om deze eiwitten te hydrateren en flexibel te maken, maar ook om de zetmeelkorrels te laten zwellen (gelatinisatie tijdens het bakken) en om enzymen zoals amylase actief te laten worden, die zetmeel afbreken tot suikers voor de gist.\n\nBloem met een hoger eiwitgehalte, zoals sterke broodbloem, kan doorgaans meer water absorberen dan bloem met een lager eiwitgehalte, omdat er simpelweg meer glutenvormende eiwitten aanwezig zijn om water te binden. Dit verklaart waarom hetzelfde hydratatiepercentage bij verschillende bloemsoorten totaal andere degen kan opleveren: een deeg van 70% hydratatie met sterke bloem kan prima hanteerbaar zijn, terwijl datzelfde percentage met een zwakkere bloem al snel te nat en plakkerig aanvoelt.",
        "keyPoints": [
          "Water hydrateert gluten-vormende eiwitten (glutenine en gliadine)",
          "Zetmeelkorrels zwellen en gelatiniseren dankzij water tijdens het bakken",
          "Bloem met hoger eiwitgehalte kan meer water absorberen",
          "Hetzelfde percentage kan per bloemsoort een ander resultaat geven"
        ],
        "relatedKnowledge": [
          "glutenontwikkeling",
          "zetmeelgelatinisatie",
          "eiwitgehalte-bloem"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer kies je voor hoge hydratatie?",
        "body": "Hoge hydratatie is de aangewezen keuze wanneer je een open, onregelmatige kruimstructuur nastreeft met grote luchtbellen, zoals bij ciabatta, focaccia of artisanale landbroden. Ook bij het maken van pizza-deeg voor een dunne, luchtige bodem met karakteristieke 'leopard spots' wordt vaak gekozen voor een relatief hoog waterpercentage. Daarnaast helpt extra vocht bij het verlengen van de houdbaarheid van het brood, omdat een vochtiger kruim minder snel uitdroogt.\n\nHoge hydratatie is ook nuttig wanneer je met volkoren of meergranenmeel werkt, omdat zemelen en vezels extra vocht opnemen en absorberen zonder dat het deeg daadwerkelijk 'natter' aanvoelt. In deze gevallen compenseert het extra water voor het vochtabsorberend vermogen van de vezelrijke bestanddelen.",
        "keyPoints": [
          "Voor open, luchtige kruimstructuren met grote luchtbellen",
          "Bij pizzadegen die een dunne, krokante bodem moeten krijgen",
          "Verlengt de versheid en houdbaarheid van het brood",
          "Compensatie nodig bij volkoren- of meergranenmeel dat meer vocht opneemt"
        ],
        "relatedKnowledge": [
          "pizzadeeg",
          "volkorenbrood",
          "houdbaarheid-brood"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer is lage hydratatie beter?",
        "body": "Niet elk brood is gebaat bij een hoog waterpercentage. Voor gevormde broden die een strakke, gelijkmatige structuur nodig hebben, zoals sandwichbrood, briochebrood of bepaalde koekjes- en gebaksdegen, is een lagere hydratatie vaak wenselijker. Een stugger deeg is makkelijker te vormen in bakblikken, behoudt zijn vorm beter tijdens het rijzen en geeft een fijnere, meer uniforme kruim die geschikt is om te snijden zonder uit elkaar te vallen.\n\nOok beginnende bakkers doen er goed aan om te starten met een gematigde hydratatie van rond de 60-65%, omdat zeer natte degen aanzienlijk meer ervaring vragen in het herkennen van glutenontwikkeling en het toepassen van vouwtechnieken. Te vroeg experimenteren met hoge hydratatie leidt vaak tot plat, slap brood zonder de gewenste luchtige structuur.",
        "keyPoints": [
          "Lagere hydratatie voor sandwichbrood, brioche en strak gevormde broden",
          "Geeft een fijnere, uniformere kruim die goed te snijden is",
          "Makkelijker te hanteren voor beginnende bakkers",
          "Voorkomt plat en slap brood bij gebrek aan ervaring met natte degen"
        ],
        "relatedKnowledge": [
          "briochedeeg",
          "sandwichbrood",
          "deeghantering-beginners"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten met hydratatie",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "autolyse",
          "stretch-and-fold",
          "bakkerspercentage"
        ],
        "mistakes": [
          {
            "mistake": "Water toevoegen zonder rekening te houden met de bloemsoort",
            "cause": "Verschillende bloemsoorten absorberen verschillende hoeveelheden water door variatie in eiwitgehalte en vezelinhoud",
            "solution": "Voeg water geleidelijk toe en observeer de deegconsistentie in plaats van blind een percentage uit een recept te volgen"
          },
          {
            "mistake": "Te snel opgeven bij een plakkerig, hoog gehydrateerd deeg",
            "cause": "Natte degen voelen in het begin chaotisch aan, wat vaak wordt verward met een mislukt recept",
            "solution": "Gebruik vouwtechnieken (stretch-and-fold) in plaats van traditioneel kneden en geef het deeg tijd om via autolyse en rust te ontspannen"
          },
          {
            "mistake": "Hydratatie verhogen zonder de kneedtijd of -techniek aan te passen",
            "cause": "Een natter deeg vraagt om een andere aanpak dan een standaard deeg, omdat het glutennetwerk zich anders opbouwt",
            "solution": "Pas de techniek aan naar vouwen in de kom of op het werkblad, en verleng eventueel de bulkfermentatie"
          },
          {
            "mistake": "Vocht van andere ingrediënten (zoals eieren of melk) niet meerekenen in de hydratatie",
            "cause": "Alleen het toegevoegde water wordt meegeteld, terwijl vloeistof uit andere bronnen ook bijdraagt aan de totale hydratatie",
            "solution": "Bereken de totale hydratatie inclusief alle vloeibare ingrediënten om een eerlijke vergelijking tussen recepten te maken"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Tip van Doughbert",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "deeghantering-beginners",
          "bakkerspercentage"
        ],
        "doughbertTip": "Twijfel je over de juiste hydratatie voor een nieuw recept? Begin altijd 5% lager dan het recept aangeeft en voeg water pas geleidelijk toe tijdens het kneden. Zo bouw je gevoel op voor hoe het deeg aanvoelt bij verschillende vochtniveaus, en voorkom je dat je meteen met een onhandelbaar nat deeg komt te zitten. Vergeet ook niet dat luchtvochtigheid en het type bloem in jouw keuken invloed hebben — hydratatie is een richtlijn, geen exacte wet."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over hydratatie",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "broodbaktechniek",
          "glutenontwikkeling"
        ],
        "faq": [
          {
            "question": "Wat is een 'normale' hydratatie voor een standaard witbrood?",
            "answer": "De meeste witbroodrecepten bewegen zich tussen de 60% en 65% hydratatie, wat een goed hanteerbaar deeg oplevert met een gelijkmatige kruim."
          },
          {
            "question": "Kan ik de hydratatie van een recept zomaar verhogen?",
            "answer": "Ja, maar houd er rekening mee dat een hogere hydratatie andere kneed- en vouwtechnieken vraagt, en dat de bakresultaten (kruim, korst, rijstijd) merkbaar zullen veranderen."
          },
          {
            "question": "Telt melk of ei mee in de hydratatieberekening?",
            "answer": "Strikt genomen wel, aangezien dit ook vloeistoffen zijn die door de bloem worden opgenomen. Voor een volledig accurate hydratatie reken je alle vloeibare ingrediënten mee."
          },
          {
            "question": "Waarom voelt hoog gehydrateerd deeg zo plakkerig aan?",
            "answer": "Bij veel water ten opzichte van bloem is er simpelweg meer vrij vocht dat niet volledig gebonden is in het glutennetwerk, waardoor het deeg aan je handen en het werkblad blijft plakken totdat het glutennetwerk zich verder ontwikkelt."
          },
          {
            "question": "Heeft hydratatie invloed op de bakduur?",
            "answer": "Ja, natter deeg bevat meer vocht dat tijdens het bakken moet verdampen, wat vaak resulteert in een iets langere baktijd of een hogere oventemperatuur om voldoende korstvorming te bereiken."
          }
        ]
      }
    ]
  }
});

export const bakersPercentageKnowledgeBite = defineKnowledgeBite({
  "slug": "bakers-percentage",
  "categoryId": "hydratatie",
  "title": "Baker's Percentage",
  "libraryOrder": 2,
  "status": "published",
  "metadata": {
    "subtitle": "Hoe professionele bakkers elk recept schaalbaar, herhaalbaar en vergelijkbaar maken met één simpele rekenmethode",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "Baker's Percentage",
      "Hydratatie",
      "Broodformules",
      "Bakkerswiskunde",
      "Deegberekening",
      "Broodbakken"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Baker's Percentage is het rekensysteem waarmee professionele bakkerijen en ambachtelijke bakkers wereldwijd hun recepten formuleren. In plaats van vaste gewichten te noteren, drukken bakkers elk ingrediënt uit als percentage van het totale meelgewicht, dat altijd op 100% staat. Dit maakt recepten oneindig schaalbaar, eenvoudig te vergelijken en ongelooflijk precies aan te passen.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is Baker's Percentage precies?",
        "body": "Baker's Percentage (ook wel bakkerspercentage of bakersformule genoemd) is een rekenmethode waarbij niet het totale receptgewicht, maar het meelgewicht als uitgangspunt dient. Het meel krijgt altijd de waarde 100%, ongeacht hoeveel kilo of gram dat daadwerkelijk is. Alle overige ingrediënten — water, zout, gist, olie, suiker, zuurdesemstarter — worden vervolgens uitgedrukt als percentage van dat meelgewicht.\n\nHet systeem is ontstaan in industriële en ambachtelijke bakkerijen omdat bakkers voortdurend recepten moeten aanpassen aan verschillende batchgroottes: een testbatch van 2 kg meel, een productieronde van 50 kg, of een enkel brood thuis. Met percentages hoef je nooit een compleet recept opnieuw te herberekenen; je vermenigvuldigt simpelweg elk percentage met het gewenste meelgewicht.",
        "keyPoints": [
          "Meel is altijd het referentiepunt en staat op 100%",
          "Alle andere ingrediënten zijn een percentage van het meelgewicht",
          "Het totale percentage van een recept ligt vaak boven de 100%",
          "Wereldwijd gebruikt in professionele bakkerijen en broodrecepten"
        ],
        "relatedKnowledge": [
          "hydratatie-percentage",
          "autolyse",
          "zuurdesem-voeding"
        ]
      },
      {
        "id": "properties",
        "title": "Hoe bereken je Baker's Percentage?",
        "body": "De formule is verrassend eenvoudig: deel het gewicht van een ingrediënt door het totale meelgewicht en vermenigvuldig met 100. Bij deeg met meerdere meelsoorten (bijvoorbeeld tarwebloem en volkorenmeel) tel je al het meel bij elkaar op — die som vormt samen de 100%.\n\nStel je hebt een recept met 1000 gram meel, 650 gram water, 20 gram zout en 7 gram instant gist. Dan reken je als volgt: water = 650/1000 × 100 = 65%, zout = 20/1000 × 100 = 2%, gist = 7/1000 × 100 = 0,7%. Wil je hetzelfde recept opschalen naar 3000 gram meel, dan vermenigvuldig je gewoon elk percentage opnieuw met 3000 in plaats van 1000, en je krijgt direct de juiste hoeveelheden voor water, zout en gist zonder iets over te hoeven berekenen.",
        "keyPoints": [
          "Formule: (ingrediëntgewicht ÷ totaal meelgewicht) × 100",
          "Bij meerdere meelsoorten telt de som van alle meel op tot 100%",
          "Percentages blijven gelijk, ongeacht de batchgrootte",
          "Ideaal voor het reproduceren van recepten in elke schaal"
        ],
        "relatedKnowledge": [],
        "table": {
          "caption": "Voorbeeldrecept omgerekend naar Baker's Percentage",
          "headers": [
            "Ingrediënt",
            "Gewicht (g)",
            "Baker's Percentage"
          ],
          "rows": [
            [
              "Tarwebloem",
              "1000",
              "100%"
            ],
            [
              "Water",
              "650",
              "65%"
            ],
            [
              "Zout",
              "20",
              "2%"
            ],
            [
              "Instant gist",
              "7",
              "0,7%"
            ],
            [
              "Totaal",
              "1677",
              "167,7%"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De logica achter percentages boven de 100%",
        "body": "Een veelvoorkomende verwarring bij nieuwkomers: hoe kan een recept in totaal 167% of meer bevatten? Dit komt doordat Baker's Percentage geen weergave is van het aandeel in het totale deeggewicht, maar altijd relatief blijft ten opzichte van het meel. Meel is en blijft de referentie van 100%, ook als water, zout en andere ingrediënten samen uiteindelijk meer wegen dan het meel zelf.\n\nDeze structuur is wiskundig krachtig omdat ze losstaat van absolute hoeveelheden. Een bakker in een klein atelier en een industriële bakkerij kunnen exact hetzelfde recept delen — 100% bloem, 65% water, 2% zout, 20% zuurdesemstarter — zonder ooit te hoeven specificeren of het om 500 gram of 500 kilo gaat. De formule communiceert de verhouding, niet het volume, en dat is precies waarom het systeem al decennialang de industriestandaard is.",
        "keyPoints": [
          "Percentages zijn altijd relatief aan meel, niet aan het totale deeggewicht",
          "Een totaalpercentage boven 100% is normaal en verwacht",
          "Het systeem maakt recepten los van absolute hoeveelheden",
          "Verhoudingen zijn overdraagbaar tussen elke productieschaal"
        ],
        "relatedKnowledge": []
      },
      {
        "id": "comparison",
        "title": "Baker's Percentage versus traditionele receptenweergave",
        "body": "Een klassiek recept in gewichten of kopjes werkt prima voor een eenmalige bakactie, maar wordt onpraktisch zodra je wilt schalen, vergelijken of aanpassen. Baker's Percentage lost precies die beperkingen op door de focus te verschuiven van absolute hoeveelheden naar verhoudingen.",
        "keyPoints": [],
        "relatedKnowledge": [],
        "comparisonTable": {
          "caption": "Vergelijking van beide systemen",
          "headers": [
            "Aspect",
            "Traditioneel gewichtsrecept",
            "Baker's Percentage"
          ],
          "rows": [
            [
              "Schaalbaarheid",
              "Vereist herberekening van elk ingrediënt",
              "Directe vermenigvuldiging vanaf meelgewicht"
            ],
            [
              "Vergelijkbaarheid tussen recepten",
              "Lastig, andere batchgroottes",
              "Eenvoudig, verhoudingen direct zichtbaar"
            ],
            [
              "Inzicht in hydratatie",
              "Niet direct af te lezen",
              "Watergehalte direct zichtbaar als percentage"
            ],
            [
              "Gebruik in professionele bakkerijen",
              "Zelden als enige systeem",
              "Industriestandaard"
            ],
            [
              "Toegankelijkheid voor beginners",
              "Intuïtiever bij eerste kennismaking",
              "Vereist enige rekenvaardigheid"
            ]
          ]
        }
      },
      {
        "id": "when-to-use",
        "title": "Wanneer gebruik je Baker's Percentage?",
        "body": "Baker's Percentage is onmisbaar zodra je verder wilt dan een eenmalig recept volgen. Het systeem toont direct zijn waarde bij het ontwikkelen van eigen broodformules, het vergelijken van verschillende deegsoorten, en het aanpassen van hydratatie of gistpercentages zonder de rest van het recept overhoop te halen.\n\nHet is ook de aangewezen methode wanneer je wilt schalen: van een testbatch naar productievolume, of andersom van een groot recept naar een kleine huishoudelijke hoeveelheid. Bakkers gebruiken het bovendien om snel te beoordelen of een deeg nat, gemiddeld of stevig zal aanvoelen — een hydratatie van 60% voelt heel anders aan dan 85%, nog voordat er een gram is afgewogen.",
        "keyPoints": [
          "Bij het ontwikkelen en aanpassen van eigen broodrecepten",
          "Bij het op- of afschalen van recepten naar elke gewenste hoeveelheid",
          "Bij het vergelijken van hydratatie en verhoudingen tussen deegsoorten",
          "Bij communicatie tussen bakkers, ongeacht productieschaal"
        ],
        "relatedKnowledge": []
      },
      {
        "id": "when-not-to-use",
        "title": "Waar Baker's Percentage minder geschikt is",
        "body": "Hoewel het systeem de standaard is voor broodachtige deegsoorten, is het minder gangbaar en soms minder verhelderend bij gebak waar meel niet de dominante of structurerende component is, zoals bepaalde cakes, koekjes of roomgebaseerde desserts. Daar wordt vaker gerekend op basis van totaalgewicht of op basis van suiker, omdat de verhoudingen tussen boter, suiker, ei en meel op een andere manier de textuur bepalen.\n\nOok bij glutenvrije mixen met meerdere zetmeelsoorten en bindmiddelen kan het systeem verwarrend worden: welk bestanddeel geldt dan als de 100%-referentie? In die gevallen werken bakkers vaak met een aangepaste of uitgebreide versie van het systeem, of vallen ze terug op absolute gewichten.",
        "keyPoints": [
          "Minder gebruikelijk bij cake, koekjes en roomgebaseerde gebakken",
          "Glutenvrije mixen met meerdere zetmeelbronnen maken de referentie onduidelijk",
          "Bij gebak met veel vet en suiker geven andere verhoudingssystemen vaak meer inzicht"
        ],
        "relatedKnowledge": []
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten met Baker's Percentage",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "mistakes": [
          {
            "mistake": "Percentages berekenen op basis van het totale deeggewicht in plaats van het meelgewicht",
            "cause": "Verwarring tussen 'percentage van het recept' en 'percentage relatief aan meel'",
            "solution": "Bepaal eerst het totale meelgewicht (som van alle meelsoorten) en gebruik uitsluitend dat cijfer als noemer voor elke berekening"
          },
          {
            "mistake": "Vergeten om alle meelsoorten samen te tellen bij gemengde deeg",
            "cause": "Bij recepten met bijvoorbeeld tarwebloem én roggemeel wordt maar één meelsoort als 100% aangehouden",
            "solution": "Tel altijd het gewicht van alle meelsoorten bij elkaar op voordat je de 100%-referentie vaststelt"
          },
          {
            "mistake": "De hydratatie van zuurdesemstarter niet meenemen in de totale hydratatieberekening",
            "cause": "Een actieve starter bevat zelf ook water en meel, wat het werkelijke hydratatiepercentage van het deeg beïnvloedt",
            "solution": "Reken het meel- en watergehalte van de starter mee in de totale meel- en waterhoeveelheid voor een correcte hydratatiepercentage"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's praktische tip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "doughbertTip": "Maak een simpel rekenblad met kolommen voor ingrediënt, percentage en gewicht. Zet je meelgewicht bovenaan vast en laat de rest automatisch meeschalen. Zo pas je in seconden je hydratatie, zoutgehalte of gistpercentage aan zonder het hele recept opnieuw te hoeven doorrekenen — en zie je meteen het effect op elk ander ingrediënt."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over Baker's Percentage",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "faq": [
          {
            "question": "Waarom staat meel altijd op 100% en niet water of een ander ingrediënt?",
            "answer": "Meel is historisch en functioneel het structurerende hoofdingrediënt van brooddeeg. Door meel als vaste referentie te gebruiken, kunnen bakkers wereldwijd dezelfde formule hanteren en recepten direct met elkaar vergelijken, ongeacht welk type brood ze bakken."
          },
          {
            "question": "Is Baker's Percentage hetzelfde als hydratatiepercentage?",
            "answer": "Hydratatiepercentage is één specifiek onderdeel van Baker's Percentage: het percentage water ten opzichte van het meelgewicht. Baker's Percentage is de bredere methode die op dezelfde manier geldt voor zout, gist, olie, suiker en elk ander ingrediënt in het recept."
          },
          {
            "question": "Hoe reken ik een recept in kopjes om naar Baker's Percentage?",
            "answer": "Weeg eerst alle ingrediënten in grammen, want kopjes zijn onnauwkeurig door verschillen in verdichting. Bepaal daarna het totale meelgewicht en deel elk ander ingrediëntgewicht daardoor, vermenigvuldigd met 100, om het percentage te verkrijgen."
          },
          {
            "question": "Kan ik Baker's Percentage ook gebruiken voor kleine huisbakkerij-hoeveelheden?",
            "answer": "Zeker, het systeem werkt op elke schaal. Bepaal het gewenste meelgewicht voor jouw batch en vermenigvuldig elk percentage daarmee om direct de juiste hoeveelheden in grammen te krijgen."
          }
        ]
      }
    ]
  }
});

export const waterabsorptieKnowledgeBite = defineKnowledgeBite({
  "slug": "waterabsorptie",
  "categoryId": "hydratatie",
  "title": "Waterabsorptie",
  "libraryOrder": 3,
  "status": "published",
  "metadata": {
    "subtitle": "De sleutel tot de juiste hydratatie, een soepel deeg en een voorspelbaar eindresultaat",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "Waterabsorptie",
      "Hydratatie",
      "Bloemkwaliteit",
      "Deegbereiding",
      "Broodbakken"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Waterabsorptie bepaalt hoeveel vocht bloem kan opnemen voordat een deeg te nat of te droog wordt, en vormt daarmee de basis van elke hydratatieberekening. Wie begrijpt waarom het ene meel meer water vraagt dan het andere, bakt voorspelbaarder, met betere kruimstructuur en minder verrassingen in het deeg.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is waterabsorptie precies?",
        "body": "Waterabsorptie is de hoeveelheid water die een bloem kan opnemen en vasthouden terwijl er nog steeds een werkbaar, samenhangend deeg ontstaat. Het wordt meestal uitgedrukt als percentage ten opzichte van het bloemgewicht: een bloem met een absorptie van 60% neemt 600 gram water op per kilo bloem, voordat het deeg te slap of te plakkerig wordt om nog te kneden of te vormen.\n\nDeze eigenschap wordt in de professionele meelindustrie gemeten met een farinograaf of alveograaf, apparaten die het gedrag van deeg tijdens het kneden analyseren. Voor de thuisbakker is waterabsorptie vooral een praktisch begrip: het bepaalt hoeveel vocht je recept aankan zonder dat het deeg instort, uitvloeit of juist droog en stug blijft.\n\nBelangrijk is dat waterabsorptie geen vast getal is dat voor elke bloem hetzelfde is. Het varieert per tarwesoort, maalgraad, eiwitgehalte en zelfs per oogstjaar, waardoor twee zakken 'gewone tarwebloem' in de praktijk toch net andere hoeveelheden water kunnen vragen.",
        "keyPoints": [],
        "relatedKnowledge": []
      },
      {
        "id": "properties",
        "title": "Waar hangt waterabsorptie vanaf?",
        "body": "Meerdere factoren in de bloem zelf bepalen hoeveel water er kan worden opgenomen. Het eiwitgehalte speelt de hoofdrol: gluteneiwitten zoals gliadine en glutenine binden actief water tijdens het kneden, dus hoe hoger het eiwitpercentage, hoe groter doorgaans de wateropnamecapaciteit. Bloem met veel eiwit, zoals sterke broodbloem of manitoba, kan daardoor vaak 5 tot 10 procent meer water opnemen dan een zwakke patentbloem.\n\nDaarnaast speelt de zetmeelstructuur een rol. Beschadigd zetmeel, dat ontstaat tijdens het malen, absorbeert aanzienlijk meer water dan intact zetmeel omdat de korrelstructuur is opengebroken en water makkelijker kan binnendringen. Fijner gemalen bloem bevat vaak meer beschadigd zetmeel en heeft daardoor een hogere absorptie.\n\nOok vezels en zemelen tellen mee: volkorenbloem en meel met meer buitenlagen van de graankorrel nemen substantieel meer water op dan gebuilde witte bloem, simpelweg omdat vezels als een spons werken. Tot slot beïnvloeden vochtgehalte van de bloem bij aankoop, de temperatuur van het water en de gebruikte kneedmethode hoeveel water in de praktijk daadwerkelijk wordt opgenomen.",
        "keyPoints": [],
        "relatedKnowledge": []
      },
      {
        "id": "comparison",
        "title": "Waterabsorptie per bloemsoort",
        "body": "Onderstaande richtwaarden geven een indicatie; de exacte absorptie verschilt per merk en oogst, dus zie dit als startpunt voor experimenten in je eigen keuken.",
        "keyPoints": [
          "Hoger eiwitgehalte betekent doorgaans meer wateropname",
          "Volkorenbloem vraagt door de vezels aanzienlijk meer water",
          "Absorptiewaarden zijn richtlijnen, geen exacte wetten"
        ],
        "relatedKnowledge": [],
        "comparisonTable": {
          "caption": "Indicatieve waterabsorptie per bloemtype",
          "headers": [
            "Bloemsoort",
            "Eiwitgehalte",
            "Indicatieve absorptie",
            "Typisch gebruik"
          ],
          "rows": [
            [
              "Patentbloem / zwakke bloem",
              "8-10%",
              "55-60%",
              "Cake, koekjes, korte deegjes"
            ],
            [
              "Tarwebloem (allround)",
              "10-12%",
              "58-63%",
              "Wit brood, basisdeeg"
            ],
            [
              "Broodbloem / sterke bloem",
              "12-14%",
              "63-68%",
              "Stokbrood, pizza, bagels"
            ],
            [
              "Manitoba / zeer sterk",
              "14-16%",
              "68-75%",
              "Zoet gerezen deeg, panettone"
            ],
            [
              "Volkorenbloem",
              "11-14%",
              "70-85%",
              "Volkorenbrood, mengbroden"
            ],
            [
              "Speltbloem",
              "10-12%",
              "55-62%",
              "Spelt brood, minder rekbaar deeg"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De wetenschap achter wateropname",
        "body": "Wanneer water en bloem samenkomen, gebeurt er op microscopisch niveau iets fascinerends. De eiwitten gliadine en glutenine hydrateren en vormen samen het glutennetwerk: een elastisch, rekbaar web dat het deeg zijn structuur geeft. Dit proces, hydratatie van gluten, verloopt niet instantaan maar heeft tijd nodig, wat verklaart waarom deeg na een rustperiode (autolyse) soepeler aanvoelt zonder dat er water is toegevoegd.\n\nTegelijkertijd nemen zetmeelkorrels water op en zwellen ze licht op, een proces dat versnelt bij hogere temperaturen maar tijdens het kneden bij kamertemperatuur relatief beperkt blijft. Beschadigd zetmeel, ontstaan door mechanische maalkrachten, heeft een veel grotere wateropnamecapaciteit dan onbeschadigde korrels omdat de kristallijne structuur is aangetast.\n\nEnzymen in de bloem, met name amylase, breken tijdens rijzing geleidelijk zetmeel af tot suikers, wat de viscositeit van het deeg beïnvloedt en indirect ook het watergedrag verandert naarmate het deeg langer staat. Dit is een van de redenen waarom een deeg na enkele uren rijzen soms losser aanvoelt dan direct na het kneden.",
        "keyPoints": [],
        "relatedKnowledge": []
      },
      {
        "id": "when-to-use",
        "title": "Hoe pas je kennis van waterabsorptie toe?",
        "body": "Wanneer je een recept omzet naar een ander bloemtype, is het slim om niet blind het waterpercentage over te nemen. Vervang je patentbloem door volkorenbloem, verhoog dan het watergehalte met zo'n 5 tot 10 procent om dezelfde deegconsistentie te behouden. Werk je juist met sterke broodbloem in een recept dat voor allroundbloem is geschreven, dan kun je vaak iets meer water toevoegen zonder dat het deeg te slap wordt.\n\nBij het testen van een nieuwe bloemzak is het verstandig om water geleidelijk toe te voegen in plaats van in één keer alles erbij te gooien. Begin met zo'n 90 procent van het voorgeschreven watergehalte, knead en beoordeel de textuur, en voeg dan beetje bij beetje de rest toe tot het deeg de gewenste soepelheid en elasticiteit bereikt.\n\nDit principe is ook waardevol bij het aanpassen van recepten voor luchtvochtigheid: op vochtige dagen neemt bloem al wat vocht uit de lucht op, waardoor je iets minder water nodig hebt dan het recept aangeeft, terwijl droge winterlucht juist om iets meer water kan vragen.",
        "keyPoints": [
          "Pas waterhoeveelheid altijd aan bij vervanging van bloemtype",
          "Voeg water geleidelijk toe bij een onbekende bloemsoort",
          "Houd rekening met seizoensgebonden luchtvochtigheid"
        ],
        "relatedKnowledge": []
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's praktijktip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "doughbertTip": "Twijfel je of je deeg genoeg water heeft opgenomen? Laat het na het mengen tien minuten rusten zonder te kneden. Gluten en zetmeel hebben tijd nodig om vocht volledig op te nemen, en vaak voelt een deeg dat eerst plakkerig leek na deze korte pauze al veel soepeler en beter hanteerbaar aan, zonder dat je extra bloem hoeft toe te voegen."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over waterabsorptie",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "faq": [
          {
            "question": "Wat betekent een hoge waterabsorptie van bloem?",
            "answer": "Het betekent dat de bloem relatief veel water kan opnemen ten opzichte van zijn gewicht voordat het deeg te nat of onhanteerbaar wordt. Dit komt meestal door een hoger eiwitgehalte of meer beschadigd zetmeel."
          },
          {
            "question": "Kan ik de waterabsorptie van bloem zelf testen?",
            "answer": "Zonder professionele apparatuur zoals een farinograaf is een exacte meting lastig, maar je kunt wel empirisch testen door water geleidelijk toe te voegen tijdens het kneden en te noteren bij welk percentage het deeg de gewenste consistentie bereikt."
          },
          {
            "question": "Waarom vraagt volkorenbloem meer water dan witte bloem?",
            "answer": "Volkorenbloem bevat zemelen en vezels die als een spons werken en aanzienlijk meer vocht vasthouden dan het zetmeelrijke endosperm in witte bloem."
          },
          {
            "question": "Verandert waterabsorptie tijdens het rijzen?",
            "answer": "De totale hoeveelheid opgenomen water verandert niet, maar de manier waarop het deeg aanvoelt kan wel veranderen doordat enzymen zetmeel afbreken en het glutennetwerk zich verder ontspant tijdens de rijs."
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
            "title": "De farinograaf meet absorptie in de industrie",
            "fact": "Molens gebruiken een farinograaf om precies te bepalen hoeveel water een bloemcharge nodig heeft om een deeg van standaardconsistentie te krijgen, en dit getal staat vaak op technische productbladen."
          },
          {
            "title": "Oogstjaar beïnvloedt absorptie",
            "fact": "Weersomstandigheden tijdens de graanoogst veranderen het eiwit- en vochtgehalte van tarwe, waardoor bloem van hetzelfde merk van jaar tot jaar licht kan verschillen in wateropnamecapaciteit."
          }
        ]
      }
    ]
  }
});

export const hogeHydratatieKnowledgeBite = defineKnowledgeBite({
  "slug": "hoge-hydratatie",
  "categoryId": "hydratatie",
  "title": "Hoge hydratatie",
  "libraryOrder": 4,
  "status": "published",
  "metadata": {
    "subtitle": "Waarom meer water in je deeg leidt tot ambachtelijk brood met karakter — en wat het van je vraagt als bakker",
    "difficulty": "beginner",
    "readingTimeMinutes": 5,
    "tags": [
      "hydratatie",
      "broodbakken",
      "ciabatta",
      "deegtechniek",
      "ambachtelijk brood"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Hoge hydratatie verwijst naar deeg met een relatief groot aandeel water ten opzichte van bloem, vaak 75% of meer. Deze techniek staat aan de basis van broden met een open, onregelmatige kruim en een krokante korst, zoals ciabatta en focaccia. Tegelijk vraagt hoge hydratatie om andere vaardigheden dan klassiek kneden, en niet elk recept of elke bloem is er geschikt voor.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is hoge hydratatie precies?",
        "body": "Hydratatie is de verhouding tussen het gewicht van water en het gewicht van bloem in een deeg, uitgedrukt als percentage (bakkerspercentage). Een deeg met 500 gram bloem en 350 gram water heeft dus een hydratatie van 70%. Bij een standaard broodrecept ligt dit percentage doorgaans tussen de 58% en 65%. Zodra je richting 75% en hoger gaat, spreken we van hoge hydratatie. Sommige ciabatta- of focacciadegen gaan zelfs richting 90% tot 100%, waarbij het deeg zich eerder als een dik beslag dan als een klassiek kneedbaar deeg gedraagt.\n\nHet is belangrijk te beseffen dat hydratatie geen vast getal is dat voor elke bloem hetzelfde resultaat geeft. Bloemsoorten verschillen sterk in hun opnamecapaciteit van water, afhankelijk van eiwitgehalte, maalgraad en het aandeel volkoren of speciale granen. Een hydratatie van 80% met een sterke bloemsoort met hoog eiwitgehalte voelt heel anders aan dan diezelfde 80% met een zachtere patentbloem.",
        "keyPoints": [
          "Hydratatie = watergewicht gedeeld door bloemgewicht × 100%",
          "Standaardbrood: 58-65%, hoge hydratatie: doorgaans vanaf 75%",
          "Het opnamevermogen van bloem bepaalt hoe 'hoog' een percentage werkelijk aanvoelt",
          "Extreem hoge hydratatie (90%+) resulteert in een bijna gietbaar deeg"
        ],
        "relatedKnowledge": [
          "bakkerspercentage",
          "autolyse",
          "gluten ontwikkeling"
        ]
      },
      {
        "id": "properties",
        "title": "Hoe gedraagt hoog-gehydrateerd deeg zich?",
        "body": "Deeg met veel water is plakkerig, slap en moeilijk in de hand te vormen zonder de juiste techniek. Waar je een standaarddeeg nog stevig kunt kneden op het werkblad, is dat bij hoge hydratatie vrijwel onmogelijk zonder dat het deeg aan alles blijft plakken. In plaats daarvan werken bakkers met vochtige handen, een deegschraper en technieken als stretch-and-fold (uitrekken en vouwen) of coil folds, die het deeg geleidelijk sterker maken zonder intensief te hoeven kneden.\n\nHet resultaat van deze aanpak is een deeg dat na de bulkfermentatie soepel, rekbaar en vol gasbelletjes is. Bij het bakken zet dat vocht om in stoom, wat de typische grote, onregelmatige holtes in de kruim veroorzaakt — het kenmerk bij uitstek van ciabatta en veel artisanale broden. De korst wordt door de hogere stoomontwikkeling in de oven vaak ook dunner en krokanter dan bij droger deeg.",
        "keyPoints": [
          "Plakkerig en slap deeg dat vraagt om aangepaste handelingstechnieken",
          "Stretch-and-fold en coil folds vervangen traditioneel kneden",
          "Meer waterdamp tijdens het bakken zorgt voor een open, grillige kruim",
          "Vaak een dunnere, knapperigere korst als resultaat"
        ],
        "relatedKnowledge": [
          "stretch and fold",
          "coil fold",
          "bulkfermentatie"
        ]
      },
      {
        "id": "science",
        "title": "De wetenschap achter het water in je deeg",
        "body": "Water speelt een dubbele rol in deeg: het activeert de glutenvormende eiwitten glutenine en gliadine in de bloem, en het maakt zetmeel beschikbaar voor gelatinisatie tijdens het bakken. Bij hoge hydratatie krijgen glutenine en gliadine meer bewegingsruimte om zich tot lange, elastische ketens te ordenen. Dat klinkt tegenstrijdig met het feit dat het deeg slapper aanvoelt, maar het glutennetwerk dat ontstaat is juist uitzonderlijk rekbaar en kan grote hoeveelheden gasproductie van de gist opvangen zonder te scheuren.\n\nDaarnaast zorgt extra water voor een tragere, meer geleidelijke fermentatie doordat enzymen als amylase gemakkelijker bij het zetmeel kunnen komen, wat de gistactiviteit en smaakontwikkeling beïnvloedt. Tijdens het bakken verdampt het overtollige vocht sneller in de hete oven, wat leidt tot een krachtige oorworst (oven spring) en de kenmerkende grillige structuur. Deze combinatie van een rekbaar glutennetwerk en snelle stoomontwikkeling is precies wat hoge hydratatie zo geschikt maakt voor open kruimstructuren.",
        "keyPoints": [
          "Meer water geeft glutenine en gliadine ruimte om een elastisch netwerk te vormen",
          "Enzymatische activiteit (amylase) verandert door verhoogde vochtigheid",
          "Snelle stoomvorming in de oven draagt bij aan oven spring en open kruim",
          "Fermentatiesnelheid en smaakontwikkeling worden mede door hydratatie bepaald"
        ],
        "relatedKnowledge": [
          "glutenontwikkeling",
          "gelatinisatie van zetmeel",
          "oven spring"
        ]
      },
      {
        "id": "comparison",
        "title": "Hydratatieniveaus vergeleken",
        "body": "Onderstaand overzicht laat zien hoe hydratatiepercentages zich verhouden tot deegconsistentie en typische toepassingen. Dit zijn richtlijnen; de exacte waarden verschuiven per bloemsoort en recept.",
        "keyPoints": [],
        "relatedKnowledge": [],
        "comparisonTable": {
          "caption": "Hydratatieniveaus en hun kenmerken",
          "headers": [
            "Hydratatie",
            "Deegconsistentie",
            "Typisch brood",
            "Kruimstructuur"
          ],
          "rows": [
            [
              "55-60%",
              "Stevig, goed kneedbaar",
              "Toastbrood, broodjes",
              "Fijn en regelmatig"
            ],
            [
              "60-65%",
              "Soepel, licht plakkerig",
              "Standaard witbrood, bruin brood",
              "Regelmatig, gematigd luchtig"
            ],
            [
              "70-75%",
              "Plakkerig, vraagt vouwtechniek",
              "Landbrood, sourdough boules",
              "Onregelmatig, redelijk open"
            ],
            [
              "80-90%",
              "Zeer slap, bijna dik beslag",
              "Ciabatta, focaccia",
              "Grote, onregelmatige holtes"
            ],
            [
              "95-100%+",
              "Gietbaar, nauwelijks vormbaar",
              "Extreme ciabatta-varianten",
              "Zeer open, wisselend"
            ]
          ]
        }
      },
      {
        "id": "when-to-use",
        "title": "Wanneer kies je voor hoge hydratatie?",
        "body": "Hoge hydratatie is de aangewezen keuze wanneer je een open, grillige kruim en een dunne, krokante korst nastreeft — denk aan ciabatta, focaccia, pain rustique of veel moderne sourdough-broden. Het is ook een waardevolle techniek als je met bloemsoorten werkt die van nature veel water opnemen, zoals bloem met een hoger eiwitgehalte, of wanneer je juist een lichter, luchtiger eindresultaat wilt bij volkorenbrood dat anders al snel dicht en zwaar wordt.\n\nDaarnaast is hoge hydratatie nuttig bij langzame, koude fermentaties. Een natter deeg blijft langer soepel en werkbaar tijdens een lange rijs in de koelkast, wat de smaakontwikkeling ten goede komt zonder dat het deeg te stug wordt. Bakkers die met wilde gist en zuurdesem werken, gebruiken hoge hydratatie ook vaak om de zuurdesemcultuur actiever te houden, doordat er meer vrij water beschikbaar is voor de micro-organismen.",
        "keyPoints": [
          "Ideaal voor ciabatta, focaccia en broden met open kruim",
          "Goed te combineren met langzame, koude fermentatie",
          "Compenseert de zwaarte van volkorenbloem",
          "Ondersteunt actieve zuurdesemculturen door meer vrij water"
        ],
        "relatedKnowledge": [
          "zuurdesem",
          "koude fermentatie",
          "volkorenbrood"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer kun je hoge hydratatie beter vermijden?",
        "body": "Niet elk deeg is gebaat bij veel water. Bij verrijkte degen zoals brioche, stollen of croissantdeeg werkt hoge hydratatie averechts: de toevoeging van boter, eieren en suiker vraagt om een steviger, beter beheersbaar deeg om structuur te behouden tijdens het vormen en, bij laminatie, tijdens het uitrollen van deeglaagjes. Een te nat deeg maakt het lamineren van boter vrijwel onmogelijk doordat de lagen in elkaar wegzakken.\n\nOok voor beginnende bakkers is een te hoge hydratatie soms een valkuil in plaats van een verbetering. Zonder ervaring met vouwtechnieken en deeghantering kan een zeer nat deeg eerder resulteren in een platte, dichte bak dan in het gewenste luchtige resultaat. In dat geval is het verstandiger om eerst vertrouwd te raken met deeg rond de 65-70% voordat je verder omhoog gaat. Tot slot is hoge hydratatie minder geschikt voor gevormde broden die scherpe, gedefinieerde vormen nodig hebben, zoals sommige decoratieve of gevlochten broden, omdat het deeg simpelweg te slap is om zijn vorm te behouden.",
        "keyPoints": [
          "Ongeschikt voor verrijkte en gelamineerde degen zoals croissant of brioche",
          "Kan voor beginners eerder tot een dichte bak leiden dan een open kruim",
          "Minder geschikt voor scherp gevormde of gevlochten broden",
          "Bouw hydratatie liever geleidelijk op naarmate je vaardigheid groeit"
        ],
        "relatedKnowledge": [
          "laminatie",
          "verrijkt deeg",
          "vlechtbrood"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten bij hoge hydratatie",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "bassinage",
          "deeg vormen",
          "gluten ontwikkeling"
        ],
        "mistakes": [
          {
            "mistake": "Al het water in één keer toevoegen bij het mengen",
            "cause": "Bloem krijgt onvoldoende tijd om vocht geleidelijk op te nemen, waardoor het deeg te snel te slap en oncontroleerbaar wordt",
            "solution": "Werk met de bassinage-methode: houd een deel van het water achter en meng dit pas later, na een korte autolyse, geleidelijk door het deeg"
          },
          {
            "mistake": "Kneden op dezelfde manier als bij standaarddeeg",
            "cause": "Klassiek kneden op een droog werkblad werkt niet bij plakkerig deeg en leidt tot frustratie en deegverlies",
            "solution": "Gebruik stretch-and-fold of coil folds met natte handen en een deegschraper in plaats van traditioneel kneden"
          },
          {
            "mistake": "Te weinig gluten laten ontwikkelen vóór de bulkfermentatie",
            "cause": "Hoge hydratatie vraagt om een sterk glutennetwerk om de vele gasbellen te kunnen dragen; onvoldoende ontwikkeling leidt tot een platte bak",
            "solution": "Bouw voldoende vouwrondes in tijdens de eerste fase van de bulkfermentatie en geef het deeg rusttijd tussen de vouwen"
          },
          {
            "mistake": "De verkeerde bloem gebruiken voor het gewenste hydratatieniveau",
            "cause": "Bloem met een laag eiwitgehalte kan simpelweg niet genoeg water vasthouden om het glutennetwerk sterk genoeg te maken",
            "solution": "Kies bloem met voldoende eiwitgehalte (bakkersbloem of broodbloem) wanneer je richting 75% hydratatie of hoger gaat"
          },
          {
            "mistake": "Ongeduld tijdens het vormen van het deeg",
            "cause": "Nat deeg vraagt om een zachte, geduldige hand; te veel kracht of haast duwt het gas eruit en verstoort de structuur",
            "solution": "Vorm met lichte, vloeiende bewegingen en gebruik voldoende bloem of water op het werkblad om plakken te voorkomen zonder extra bloem in het deeg te werken"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's tip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "deeggevoel ontwikkelen",
          "stretch and fold"
        ],
        "doughbertTip": "Begin niet meteen op 90% hydratatie als je hier nieuw in bent. Verhoog het percentage in kleine stappen van vijf procent per keer, en leer bij elke stap hoe het deeg aanvoelt tijdens het vouwen. Zo bouw je gevoel op voor wanneer een deeg 'genoeg' ontwikkeld is, in plaats van te vertrouwen op een vaste tijdsklok."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over hoge hydratatie",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "faq": [
          {
            "question": "Vanaf welk percentage spreek je van hoge hydratatie?",
            "answer": "Er is geen strikte grens, maar in de praktijk wordt vanaf 75% doorgaans gesproken van hoge hydratatie. Degen boven de 85-90% worden vaak als extreem hoog beschouwd."
          },
          {
            "question": "Kan ik elk recept omzetten naar hoge hydratatie?",
            "answer": "Niet zonder aanpassingen. Naast meer water moet je vaak ook de bloemsoort, kneed- of vouwtechniek en fermentatietijd aanpassen om een goed resultaat te behouden."
          },
          {
            "question": "Waarom plakt mijn deeg zo aan mijn handen en het werkblad?",
            "answer": "Dat is een normaal en verwacht kenmerk van hoog-gehydrateerd deeg. Werk met natte of licht geoliede handen en een deegschraper in plaats van extra bloem toe te voegen, om de hydratatie niet ongewild te verlagen."
          },
          {
            "question": "Heeft hoge hydratatie invloed op de smaak van het brood?",
            "answer": "Indirect wel: meer water beïnvloedt de enzymactiviteit en fermentatiesnelheid, wat kan bijdragen aan een complexere smaakontwikkeling, vooral bij langere of koude fermentaties."
          },
          {
            "question": "Kan ik hoge hydratatie combineren met volkorenbloem?",
            "answer": "Ja, en dit wordt vaak zelfs aangeraden. Volkorenbloem neemt van nature meer water op door het aandeel zemelen en kiem, en extra vocht helpt om een te dichte, zware kruim te voorkomen."
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
            "title": "Ciabatta betekent 'pantoffel'",
            "fact": "De naam ciabatta verwijst naar de platte, ietwat onregelmatige vorm van het brood, dat lijkt op een pantoffel — een directe uitkomst van het zeer slappe, hoog-gehydrateerde deeg."
          },
          {
            "title": "De term 'bakkerspercentage' komt uit de professionele bakkerij",
            "fact": "Bakkers rekenen ingrediënten al decennia lang uit als percentage van het bloemgewicht, ongeacht de totale batchgrootte, wat het schalen van recepten enorm vereenvoudigt."
          },
          {
            "title": "Hoge hydratatie is relatief nieuw in de populaire bakcultuur",
            "fact": "Hoewel ambachtelijke Italiaanse en Franse bakkers al langer met natte degen werkten, kreeg de techniek pas de afgelopen decennia grote bekendheid bij thuisbakkers, mede dankzij de opkomst van zuurdesembakken."
          }
        ]
      }
    ]
  }
});

export const lageHydratatieKnowledgeBite = defineKnowledgeBite({
  "slug": "lage-hydratatie",
  "categoryId": "hydratatie",
  "title": "Lage hydratatie",
  "libraryOrder": 5,
  "status": "published",
  "metadata": {
    "subtitle": "Wat lage hydratatie betekent, waarom het werkt en wanneer je ervoor kiest in plaats van een nat, plakkerig deeg",
    "difficulty": "beginner",
    "readingTimeMinutes": 5,
    "tags": [
      "hydratatie",
      "deegbereiding",
      "broodbakken",
      "bakpercentages",
      "glutenontwikkeling"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Lage hydratatie verwijst naar deeg met een relatief laag waterpercentage ten opzichte van de bloem, meestal onder de 60%. Deze techniek levert stevig, goed vormbaar deeg op dat wordt gebruikt voor onder meer bagels, croissants en koekjes. In dit artikel leggen we uit wat lage hydratatie precies inhoudt, hoe het de structuur en het bakproces beïnvloedt, en wanneer je er wel of juist niet voor kiest.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is lage hydratatie?",
        "body": "Hydratatie is de verhouding tussen het watergewicht en het bloemgewicht in een deeg, uitgedrukt als percentage in bakkerspercentages (baker's percentages). Bij een hydratatie van 100% zou je evenveel water als bloem gebruiken; in de praktijk ligt dat percentage bij brooddegen meestal tussen de 55% en 85%. Van lage hydratatie spreken we doorgaans bij percentages onder de 60%, met veelvoorkomende waardes tussen de 50% en 58%. Dit is geen wetenschappelijk vastgelegde grens maar een praktische indeling die bakkers hanteren om deegtypes van elkaar te onderscheiden.\n\nBij lage hydratatie is er relatief weinig vrij water beschikbaar om de bloemeiwitten (gliadine en glutenine) en het zetmeel te hydrateren. Het resultaat is een deeg dat stugger aanvoelt, minder uitvloeit en zich beter laat vormen met de hand. Klassieke voorbeelden zijn bagels, pretzels, kortdeeg, koekjesdeeg, pastadeeg en plunjedeeg voor croissants.",
        "keyPoints": [
          "Hydratatie onder circa 60% wordt algemeen als 'laag' beschouwd",
          "Minder vrij water betekent een stugger, beter vormbaar deeg",
          "Veelgebruikt bij bagels, pretzels, koekjes, pasta en gelamineerd deeg"
        ],
        "relatedKnowledge": [
          "hydratatie-percentage-berekenen",
          "hoge-hydratatie",
          "bakkerspercentages"
        ]
      },
      {
        "id": "properties",
        "title": "Eigenschappen van deeg met lage hydratatie",
        "body": "Deeg met lage hydratatie onderscheidt zich duidelijk van natter deeg, zowel tijdens het verwerken als na het bakken. Omdat er minder water beschikbaar is om te bewegen tussen de eiwitstrengen, voelt het deeg steviger en minder plakkerig aan. Dit maakt het prettiger om met de hand te kneden, te vormen en te vlechten, zonder dat je voortdurend bloem moet bijstrooien om te voorkomen dat het deeg aan je handen blijft plakken.\n\nOmdat het deeg zijn vorm beter vasthoudt, is lage hydratatie ideaal voor producten die een precieze, herkenbare vorm moeten behouden: gevlochten broden, bagels met een strak rond gat, pretzels met een duidelijke knoop. Tegelijk resulteert de beperkte hoeveelheid water vaak in een fijnere, dichtere kruimstructuur met kleinere, gelijkmatigere luchtbelletjes, in plaats van de grote, onregelmatige gaten die je bij hoge hydratatie ziet. De korst van laag-hydratatie producten is vaak minder bros en meer stevig of taai, afhankelijk van de rest van de receptuur.",
        "keyPoints": [
          "Minder plakkerig en makkelijker te vormen dan hoog-hydratatie deeg",
          "Behoudt vorm goed, geschikt voor vlechten en strak vormgeven",
          "Levert doorgaans een fijnere, dichtere kruim op"
        ],
        "relatedKnowledge": [
          "kruimstructuur",
          "deeg-vormen",
          "glutennetwerk"
        ]
      },
      {
        "id": "comparison",
        "title": "Lage versus hoge hydratatie",
        "body": "Om het verschil concreet te maken, is het nuttig lage en hoge hydratatie naast elkaar te zetten. Beide benaderingen hebben hun eigen toepassingsgebied en vragen om een andere manier van kneden en verwerken.",
        "keyPoints": [],
        "relatedKnowledge": [
          "hoge-hydratatie",
          "ciabatta",
          "bagel-techniek"
        ],
        "comparisonTable": {
          "caption": "Vergelijking tussen lage en hoge hydratatie deeg",
          "headers": [
            "Kenmerk",
            "Lage hydratatie (~50-58%)",
            "Hoge hydratatie (~75%+)"
          ],
          "rows": [
            [
              "Textuur deeg",
              "Stevig, elastisch, minder plakkerig",
              "Nat, plakkerig, vloeiend"
            ],
            [
              "Verwerkbaarheid",
              "Goed te vormen en te vlechten",
              "Vraagt stretch-and-fold of machinaal kneden"
            ],
            [
              "Kruimstructuur",
              "Fijn en dicht",
              "Open met grote, onregelmatige gaten"
            ],
            [
              "Typische toepassingen",
              "Bagels, pretzels, koekjes, pastadeeg, plunjedeeg",
              "Ciabatta, focaccia, artisanaal zuurdesembrood"
            ],
            [
              "Kneedtijd",
              "Vaak langer nodig voor glutenontwikkeling",
              "Korter dankzij hogere watermobiliteit"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "De wetenschap achter lage hydratatie",
        "body": "Water speelt een sleutelrol bij het activeren van de glutenvorming: het hydrateert de eiwitten gliadine en glutenine in bloem, waardoor ze zich kunnen verbinden tot een elastisch netwerk. Bij lage hydratatie is er minder water beschikbaar om dit proces te faciliteren, wat betekent dat de eiwitten minder mobiel zijn en trager met elkaar reageren. Dit is een belangrijke reden waarom laag-hydratatie degen vaak een langere of intensievere kneedtijd vragen om een vergelijkbaar glutennetwerk te ontwikkelen als een natter deeg.\n\nOok het zetmeel in de bloem wordt beïnvloed door de hoeveelheid beschikbaar water. Tijdens het bakken gelatineert zetmeel door het opnemen van water en hitte, wat bijdraagt aan de structuur en textuur van de kruim. Bij lage hydratatie is er minder water beschikbaar voor dit proces, wat mede verklaart waarom de kruim van laag-hydratatie producten vaak dichter en steviger aanvoelt dan die van hoog-hydratatie broden. Tot slot verloopt enzymatische activiteit, zoals de afbraak van zetmeel door amylase tijdens de fermentatie, doorgaans trager wanneer er minder vrij water aanwezig is, wat de gistactiviteit en smaakontwikkeling kan beïnvloeden.",
        "keyPoints": [
          "Minder water vertraagt de hydratatie en verbinding van gluten-eiwitten",
          "Langere of intensievere kneedtijd compenseert de tragere glutenvorming",
          "Zetmeelgelatinisatie en enzymactiviteit verlopen anders bij weinig vrij water"
        ],
        "relatedKnowledge": [
          "glutenontwikkeling",
          "zetmeelgelatinisatie",
          "autolyse"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer kies je voor lage hydratatie?",
        "body": "Lage hydratatie is de aangewezen keuze wanneer je deeg nodig hebt dat zijn vorm goed behoudt en prettig verwerkbaar is met de hand. Denk aan bagels, waarbij een stevig deeg nodig is om de karakteristieke ring te vormen en te weerstaan tegen het koken in water voordat het gebakken wordt. Ook pretzels profiteren van een stug deeg dat de kenmerkende knoopvorm vasthoudt tijdens het vormen en de alkalische dip.\n\nVoor gelamineerd deeg zoals croissantdeeg en bladerdeeg is een lagere hydratatie eveneens gebruikelijk, omdat het deeg tijdens het uitrollen en vouwen met boter stevig genoeg moet blijven om niet te scheuren of te vervloeien. Kortdeeg, koekjesdeeg en pastadeeg zijn andere voorbeelden waarbij een lager watergehalte zorgt voor de juiste, niet te elastische textuur. Ook voor beginnende bakkers is lage hydratatie vaak prettiger om mee te starten, omdat het deeg minder plakt en makkelijker aanvoelt tijdens het kneden.",
        "keyPoints": [
          "Ideaal voor bagels, pretzels en gevlochten broden",
          "Onmisbaar bij gelamineerd deeg zoals croissants en bladerdeeg",
          "Prettig voor beginners door minder plakkerige verwerking"
        ],
        "relatedKnowledge": [
          "croissant-techniek",
          "bagel-techniek",
          "kortdeeg"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer lage hydratatie minder geschikt is",
        "body": "Wil je juist een open, luchtige kruim met grote, onregelmatige gaten, zoals bij ciabatta, focaccia of een ambachtelijk zuurdesembrood, dan is lage hydratatie niet de juiste route. Deze producten danken hun karakteristieke structuur juist aan een hoog watergehalte, dat tijdens de fermentatie en het bakken zorgt voor sterke stoomvorming en een uitgerekt, dun glutennetwerk rond grote luchtbellen.\n\nOok bij baguettes met een klassieke, grillige kruimstructuur werkt een hogere hydratatie beter, omdat dit de karakteristieke combinatie van een knapperige korst en een luchtige, ongelijkmatige kruim mogelijk maakt. Kies je toch voor lage hydratatie in dit soort recepten, dan loop je het risico op een te compact, dicht eindresultaat dat niet aansluit bij het gewenste product.",
        "keyPoints": [
          "Niet geschikt voor open kruimstructuren zoals ciabatta of focaccia",
          "Baguettes en artisanaal zuurdesembrood vragen doorgaans meer water",
          "Risico op een te compacte, dichte kruim bij verkeerde toepassing"
        ],
        "relatedKnowledge": [
          "ciabatta",
          "open-kruimstructuur",
          "zuurdesembrood"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten bij lage hydratatie",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "bloem-afwegen",
          "kneedtechnieken"
        ],
        "mistakes": [
          {
            "mistake": "Onbedoeld nog droger deeg door bloem 'op gevoel' toe te voegen",
            "cause": "Tijdens het kneden wordt extra bloem toegevoegd omdat het deeg plakkerig lijkt, terwijl dat bij lage hydratatie deels normaal is in de beginfase",
            "solution": "Weeg bloem en water altijd nauwkeurig af met een keukenweegschaal en werk met bakkerspercentages, zodat je niet onbedoeld de hydratatie verder verlaagt"
          },
          {
            "mistake": "Te kort kneden waardoor het glutennetwerk onvoldoende ontwikkelt",
            "cause": "De aanname dat een stugger deeg sneller klaar is, terwijl juist meer mechanische energie nodig is door de beperkte watermobiliteit",
            "solution": "Geef het deeg langer de tijd om te kneden, of pas een korte autolyse toe voordat je zout en gist toevoegt om de glutenvorming te ondersteunen"
          },
          {
            "mistake": "Lage hydratatie verwarren met een droog of smaakloos eindresultaat",
            "cause": "Ten onrechte wordt gedacht dat weinig water automatisch een droog product oplevert, terwijl vet, ei of melk in het recept ook vocht en malsheid toevoegen",
            "solution": "Beoordeel de totale samenstelling van het recept, niet alleen het waterpercentage, en houd rekening met andere vochtbronnen zoals boter, eieren of melk"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Tip van Doughbert",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "autolyse",
          "mixer-instellingen"
        ],
        "doughbertTip": "Ook bij laag-hydratatie deeg kan een korte autolyse van 20 tot 30 minuten - bloem en water samen laten rusten voordat je verder mengt - de glutenontwikkeling flink versnellen. Start bovendien op lage snelheid als je een mixer gebruikt: stug deeg vraagt om geduld, niet om kracht, anders loop je het risico dat het deeg oververhit raakt voordat het glutennetwerk goed is opgebouwd."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over lage hydratatie",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "hydratatie-percentage-berekenen",
          "hoge-hydratatie"
        ],
        "faq": [
          {
            "question": "Bij welk percentage spreek je precies van lage hydratatie?",
            "answer": "Er bestaat geen strikte wetenschappelijke grens, maar in de praktijk wordt hydratatie onder de 60% vaak als laag beschouwd, met veel klassieke voorbeelden tussen de 50% en 58%."
          },
          {
            "question": "Is deeg met lage hydratatie makkelijker voor beginners?",
            "answer": "Over het algemeen wel: het plakt minder aan handen en werkoppervlak, wat het vormen en kneden vergemakkelijkt, al vraagt het soms wel meer kneedkracht of -tijd om het gluten goed te ontwikkelen."
          },
          {
            "question": "Kan ik een recept met hoge hydratatie zomaar omzetten naar lage hydratatie?",
            "answer": "Niet zonder aanpassingen. Minder water verandert de kneedtijd, de fermentatietijd en de uiteindelijke kruimstructuur, dus het is verstandig de rest van het recept en de baktijd hierop af te stemmen in plaats van alleen het watergehalte te verlagen."
          },
          {
            "question": "Zorgt lage hydratatie voor een langere houdbaarheid?",
            "answer": "Dit hangt sterk af van het totale recept en de gebruikte ingrediënten; een lager watergehalte is op zichzelf geen garantie voor langere versheid en kan bij sommige producten juist sneller tot uitdroging leiden."
          }
        ]
      }
    ]
  }
});

export const hydratatieBerekenenKnowledgeBite = defineKnowledgeBite({
  "slug": "hydratatie-berekenen",
  "categoryId": "hydratatie",
  "title": "Hydratatie berekenen",
  "libraryOrder": 6,
  "status": "published",
  "metadata": {
    "subtitle": "De rekenmethode achter luchtige kruim, stevige structuur en voorspelbaar bakresultaat",
    "difficulty": "beginner",
    "readingTimeMinutes": 4,
    "tags": [
      "hydratatie",
      "brooddeeg",
      "bakkerspercentage",
      "deegberekening",
      "broodbakken"
    ],
    "relatedRecipes": [],
    "relatedKnowledge": [],
    "relatedTips": []
  },
  "content": {
    "summary": "Hydratatie is een van de belangrijkste getallen in het brood bakken: het bepaalt of je deeg stevig en handelbaar is of juist plakkerig en open van kruim. In dit artikel leer je precies hoe je hydratatie berekent met de bakkerspercentage-methode, welke hydratatieniveaus bij welk broodtype horen en welke fouten je moet vermijden.",
    "sections": [
      {
        "id": "what-is-it",
        "title": "Wat is hydratatie precies?",
        "body": "Hydratatie is de verhouding tussen het gewicht aan vloeistof (meestal water, maar ook melk, eieren of andere vochtbronnen tellen mee) en het gewicht aan bloem in een deeg, uitgedrukt als percentage. Bakkers gebruiken hiervoor het zogeheten bakkerspercentage: bloem staat altijd op 100%, en alle andere ingrediënten worden daaraan gerelateerd. Een deeg met 500 gram bloem en 350 gram water heeft dus een hydratatie van 70%. Dit systeem maakt recepten schaalbaar en vergelijkbaar, ongeacht de totale hoeveelheid deeg die je maakt. Het is de universele taal waarmee bakkers wereldwijd deegconsistentie communiceren, van een compact stokbrood tot een wollige ciabatta.",
        "keyPoints": [
          "Bloem is altijd de referentie op 100%",
          "Alle vloeistoffen tellen mee, ook uit eieren, melk of yoghurt",
          "Hydratatie is schaalbaar: het werkt bij elke hoeveelheid deeg",
          "Het bakkerspercentage is de basis van vrijwel elk professioneel recept"
        ],
        "relatedKnowledge": [
          "bakkerspercentage",
          "autolyse",
          "deegconsistentie"
        ]
      },
      {
        "id": "properties",
        "title": "De formule en hoe je hem toepast",
        "body": "De basisformule is simpel: hydratatie (%) = (gewicht vloeistof ÷ gewicht bloem) × 100. Stel je gebruikt 600 gram bloem en 420 gram water, dan reken je 420 ÷ 600 = 0,70, oftewel 70% hydratatie. Wil je juist andersom werken, bijvoorbeeld omdat je een gewenste hydratatie wilt bereiken bij een vaste hoeveelheid bloem, dan draai je de formule om: watergewicht = bloemgewicht × hydratatiepercentage. Bij 1000 gram bloem en een gewenste hydratatie van 75% reken je dus 1000 × 0,75 = 750 gram water. Bij het meenemen van andere vochtige ingrediënten, zoals een ei (circa 75% vocht) of volle melk (circa 87% vocht), reken je alleen het vochtaandeel mee, niet het volledige gewicht. Dit maakt de berekening iets genuanceerder, maar geeft een veel nauwkeuriger beeld van de werkelijke hydratatie van je deeg, vooral bij verrijkte degen zoals brioche of challah.",
        "keyPoints": [
          "Formule: (vloeistof ÷ bloem) × 100 = hydratatie%",
          "Omgekeerd: bloem × hydratatie% = benodigd water",
          "Bij eieren en melk telt alleen het vochtaandeel mee",
          "Nauwkeurige berekening voorkomt verrassingen bij verrijkte degen"
        ],
        "relatedKnowledge": [
          "bakkerspercentage",
          "voordeeg-hydratatie",
          "deeg-mengen"
        ]
      },
      {
        "id": "comparison",
        "title": "Hydratatieniveaus per broodtype",
        "body": "Niet elk brood vraagt om dezelfde vochtbalans. Het hydratatieniveau bepaalt in grote mate de textuur, kruimstructuur en werkbaarheid van het deeg. Hieronder een overzicht van veelvoorkomende hydratatieniveaus en de bijbehorende broodtypes, als richtlijn voor je eigen berekeningen.",
        "keyPoints": [],
        "relatedKnowledge": [
          "ciabatta",
          "focaccia",
          "volkorenbrood"
        ],
        "comparisonTable": {
          "caption": "Richtlijn hydratatieniveaus per broodtype",
          "headers": [
            "Hydratatie",
            "Deegtype",
            "Kenmerken"
          ],
          "rows": [
            [
              "50-58%",
              "Stevig deeg (bagels, sommige stokbroden)",
              "Compact, goed te vormen, dichte kruim"
            ],
            [
              "60-68%",
              "Standaard broodrecepten",
              "Handelbaar, gebalanceerde kruim, veelgebruikt basisniveau"
            ],
            [
              "70-75%",
              "Ambachtelijk brood, zuurdesem",
              "Iets plakkerig, open kruimstructuur, meer volume"
            ],
            [
              "80-90%",
              "Ciabatta, focaccia",
              "Zeer nat en plakkerig, grote onregelmatige luchtgaten"
            ],
            [
              "90%+",
              "Extreem hoge hydratatie, experimentele degen",
              "Bijna vloeibaar, vraagt geavanceerde technieken zoals vouwen in plaats van kneden"
            ]
          ]
        }
      },
      {
        "id": "science",
        "title": "Wat hydratatie doet met gluten en kruim",
        "body": "Water speelt een dubbele rol in deeg: het activeert de glutenvorming en het bepaalt hoeveel stoom er tijdens het bakken vrijkomt. Wanneer bloem met water in aanraking komt, hydrateren de eiwitten gliadine en glutenine en vormen ze glutenstrengen die het deeg elasticiteit en structuur geven. Hoe meer water beschikbaar is, hoe mobieler deze glutenstrengen kunnen bewegen, wat resulteert in een losser, opener netwerk. Dat verklaart waarom hoge-hydratatiedegen zoals ciabatta grote, onregelmatige luchtgaten krijgen: het glutennetwerk is soepel genoeg om zich uit te rekken rond de koolzuurgasbellen die gist produceert, zonder te scheuren. Bij lage hydratatie is het netwerk strakker en compacter, wat een fijnere, dichtere kruim oplevert. Daarnaast beïnvloedt water de ovenrijs: extra vocht verdampt tijdens het bakken tot stoom, wat het deeg tijdelijk extra doet uitzetten voordat de korst vastzet.",
        "keyPoints": [
          "Water activeert gliadine en glutenine tot elastische glutenstrengen",
          "Hogere hydratatie geeft een soepeler, rekbaarder glutennetwerk",
          "Meer vocht betekent meer stoomvorming en meer ovenrijs",
          "Lage hydratatie resulteert in een fijnere, dichtere kruimstructuur"
        ],
        "relatedKnowledge": [
          "glutenvorming",
          "ovenrijs",
          "kneedtechnieken"
        ]
      },
      {
        "id": "when-to-use",
        "title": "Wanneer kies je voor hoge hydratatie",
        "body": "Hoge hydratatie, doorgaans vanaf 75%, is de aangewezen keuze wanneer je een open, luchtige kruimstructuur nastreeft, zoals bij ciabatta, focaccia of ambachtelijk zuurdesembrood. Deze degen zijn moeilijker te kneden met de hand, maar lenen zich uitstekend voor technieken als stretch-and-fold, waarbij je het deeg periodiek uitrekt en vouwt in plaats van intensief te kneden. Hoge hydratatie is ook nuttig bij bloemsoorten met veel eiwitgehalte, zoals sterke broodbloem of tarwebloem type 550, omdat deze meer water kunnen opnemen zonder plakkerig te blijven. Verder helpt extra vocht bij langere, koude rijstijden: het deeg blijft actiever en de gluten blijven soepel gedurende een retarderingsproces in de koelkast.",
        "keyPoints": [
          "Ideaal voor open kruimstructuur zoals ciabatta en focaccia",
          "Vraagt om vouwtechnieken in plaats van klassiek kneden",
          "Werkt goed samen met eiwitrijke bloemsoorten",
          "Ondersteunt langere, koude fermentatieprocessen"
        ],
        "relatedKnowledge": [
          "stretch-and-fold",
          "koude-vergisting",
          "ciabatta-techniek"
        ]
      },
      {
        "id": "when-not-to-use",
        "title": "Wanneer kies je voor lage hydratatie",
        "body": "Lage hydratatie, meestal tussen 50 en 60%, is de beste keuze wanneer je juist een compacte, goed vormbare deegstructuur nodig hebt, zoals bij bagels, pretzels of bepaalde vormbroden die hun structuur strak moeten behouden tijdens het bakken. Deze degen zijn ook handiger voor beginnende bakkers, omdat ze minder plakken en makkelijker te kneden en vormen zijn met de hand. Daarnaast is lage hydratatie functioneel bij bloemsoorten met een lager eiwitgehalte, zoals bepaalde volkoren- of speltvarianten, die minder vocht kunnen vasthouden zonder dat het deeg slap wordt. Ook bij het maken van gedecoreerde broden waarbij scherpe insnijdingen en een strakke vorm belangrijk zijn, is een lagere hydratatie vaak praktischer.",
        "keyPoints": [
          "Geschikt voor bagels, pretzels en vormvaste broden",
          "Makkelijker te hanteren voor beginnende bakkers",
          "Past bij bloemsoorten met lager eiwitgehalte",
          "Behoudt scherpe vormen en insnijdingen beter"
        ],
        "relatedKnowledge": [
          "bagels-bakken",
          "vormbroodtechniek",
          "volkorenbloem"
        ]
      },
      {
        "id": "common-mistakes",
        "title": "Veelgemaakte fouten bij hydratatieberekening",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "deegconsistentie",
          "autolyse-techniek",
          "bloemsoorten-vergelijking"
        ],
        "mistakes": [
          {
            "mistake": "Andere vloeistoffen dan water niet meetellen",
            "cause": "Melk, eieren, yoghurt of olie worden over het hoofd gezien bij de berekening",
            "solution": "Bereken het vochtaandeel van elk vloeibaar ingrediënt en tel dit op bij het watergewicht voor een correcte totale hydratatie"
          },
          {
            "mistake": "Hydratatie klakkeloos overnemen tussen bloemsoorten",
            "cause": "Elke bloemsoort heeft een andere waterabsorptiecapaciteit door verschillen in eiwitgehalte en maalgraad",
            "solution": "Pas de hydratatie stapsgewijs aan bij het testen van een nieuwe bloemsoort en observeer de deegconsistentie tijdens het mengen"
          },
          {
            "mistake": "Te snel extra bloem toevoegen bij een plakkerig deeg",
            "cause": "Onbekendheid met hoe hoge-hydratatiedeeg zich gedraagt tijdens het kneden zorgt voor paniek en overcorrectie",
            "solution": "Geef het deeg tijd om te rusten (autolyse) en gebruik vouwtechnieken in plaats van extra bloem toe te voegen"
          },
          {
            "mistake": "Vergeten dat luchtvochtigheid en bloemvocht invloed hebben",
            "cause": "Bloem neemt vocht op uit de lucht en dit varieert per seizoen en opslagomstandigheden",
            "solution": "Houd altijd een kleine hoeveelheid water achter bij het mengen en voeg dit pas toe als de consistentie dat vraagt"
          }
        ]
      },
      {
        "id": "doughbert-tip",
        "title": "Doughbert's rekentip",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [],
        "doughbertTip": "Werk altijd met een schema waarin je alle vloeibare ingrediënten apart optelt voordat je het hydratatiepercentage berekent. Maak bijvoorbeeld een simpel overzicht: bloem (100%), water, melk, ei, boter. Bereken per ingrediënt het vochtaandeel en tel alles op tot een totale hydratatie. Zo voorkom je dat je een verrijkt deeg per ongeluk te droog of te nat inschat, en krijg je een percentage dat echt overeenkomt met wat je in je handen voelt."
      },
      {
        "id": "faq",
        "title": "Veelgestelde vragen over hydratatie berekenen",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "voordeeg-berekenen",
          "bakkerspercentage-uitgebreid",
          "zuurdesem-hydratatie"
        ],
        "faq": [
          {
            "question": "Telt zout mee in de hydratatieberekening?",
            "answer": "Nee, zout wordt los uitgedrukt als bakkerspercentage ten opzichte van de bloem, maar telt niet mee als vloeistof in de hydratatieberekening omdat het geen vocht toevoegt."
          },
          {
            "question": "Hoe bereken ik hydratatie bij gebruik van een voordeeg of levain?",
            "answer": "Bereken het bloem- en watergehalte van het voordeeg apart en tel deze op bij de totale bloem en het totale water van het hoofddeeg, om zo de werkelijke totale hydratatie van het volledige recept te bepalen."
          },
          {
            "question": "Waarom voelt mijn deeg natter aan dan het berekende percentage doet vermoeden?",
            "answer": "Dit komt vaak door verschillen in bloemsoort, maalgraad of luchtvochtigheid tijdens het bakken, waardoor de werkelijke waterabsorptie afwijkt van de theoretische berekening."
          },
          {
            "question": "Kan ik hydratatie gebruiken om recepten op te schalen?",
            "answer": "Ja, dat is juist de kracht van het bakkerspercentage: zodra je de hydratatie kent, kun je elk recept probleemloos vergroten of verkleinen met behoud van dezelfde deegconsistentie."
          }
        ]
      },
      {
        "id": "did-you-know",
        "title": "Wist je dat?",
        "body": "",
        "keyPoints": [],
        "relatedKnowledge": [
          "geschiedenis-broodbakken",
          "hoge-hydratatie-technieken"
        ],
        "didYouKnow": [
          {
            "title": "Extreme hydratatie bestaat echt",
            "fact": "Sommige experimentele broden, zoals bepaalde Italiaanse ciabatta-varianten, worden gemaakt met een hydratatie van meer dan 100%, waarbij er dus meer water dan bloemgewicht wordt gebruikt."
          },
          {
            "title": "Het bakkerspercentage is eeuwenoud",
            "fact": "Het systeem waarbij bloem als 100% referentie dient, wordt al sinds de vroege industriële bakkerijen gebruikt om recepten consistent te kunnen reproduceren, lang voordat digitale weegschalen bestonden."
          }
        ]
      }
    ]
  }
});

/** All hydratatie articles — generated by Atlas' real content pipeline (see
 * scripts/atlas/contentGenerationEngine.ts), reviewed and approved via the CEO Inbox.
 * Add new articles in this category here, not in bulk/catalogArticles.ts. */
export const hydratatieArticles: KnowledgeArticleInput[] = [
  definitionToArticleInput(hydratatieKnowledgeBite),
  definitionToArticleInput(bakersPercentageKnowledgeBite),
  definitionToArticleInput(waterabsorptieKnowledgeBite),
  definitionToArticleInput(hogeHydratatieKnowledgeBite),
  definitionToArticleInput(lageHydratatieKnowledgeBite),
  definitionToArticleInput(hydratatieBerekenenKnowledgeBite),
];
