import type { RecipeKnowledge } from "@/types/knowledge";

export const painDeCampagneKnowledge: RecipeKnowledge = {
  about: {
    history:
      "Pain de Campagne — 'brood van het platteland' — is een van de meest geliefde zuurdesembroden van Frankrijk. Generaties bakkers maakten het met wat de molen leverde: een mix van witte en volkoren tarwe, langzaam gefermenteerd en dagelijks vers gebakken.",
    origin:
      "Het recept vindt zijn oorsprong in de Franse plattelandsbakkerij, waar betrouwbaarheid belangrijker was dan show. Geen luxe brood, maar het brood dat elke dag op tafel kwam — vol van smaak, stevig genoeg om te snijden, zacht genoeg om van te genieten.",
    character:
      "Dunne knapperige korst, licht open kruim, volle tarwesmaak en een licht nootachtig accent. Milde zuurgraad, geen scherpe bite — elegant en evenwichtig.",
    goodFor:
      "Dagelijks ontbijt, boter & jam, belegde boterhammen, toast, soep, kaasplankjes en avondmaaltijden. Doughberts signature voor elke dag.",
  },

  flourScience: {
    overview:
      "Drie Franse tarwemelsoorten vormen samen de Doughbert-balans: zachtheid, body en diepte zonder zwaarte. Elk meel heeft een eigen rol in structuur, smaak en fermentatie.",
    flours: [
      {
        id: "t65",
        name: "T65",
        percentage: 50,
        protein: "10–11%",
        glutenStrength: "Medium — soepel, elastisch deeg",
        waterAbsorption: "Gemiddeld — goede basis voor 76% hydratatie",
        fermentationSpeed: "Normaal — stabiele rijsing",
        flavorProfile: "Mild, licht tarwekarakter, zachte kruim",
        whyWeUseIt:
          "T65 is de witte tarwebasis. Het geeft een open, lichte kruim en voorkomt dat het brood te zwaar of taai wordt — essentieel als dagelijks brood.",
      },
      {
        id: "t80",
        name: "T80",
        percentage: 40,
        protein: "11–12%",
        glutenStrength: "Medium-strong — meer structuur en body",
        waterAbsorption: "Iets hoger dan T65",
        fermentationSpeed: "Normaal tot licht sneller door meer enzymen",
        flavorProfile: "Volle tarwesmaak, dieper, iets nootachtig",
        whyWeUseIt:
          "T80 brengt het echte Pain de Campagne-karakter: meer smaak, stevigere bite en betere oven spring. Zonder T80 wordt het brood te wit en vlak.",
      },
      {
        id: "t130",
        name: "T130",
        percentage: 10,
        protein: "12–13%",
        glutenStrength: "Sterker, maar beperkt percentage houdt de balans",
        waterAbsorption: "Hoog — trekt extra vocht aan",
        fermentationSpeed: "Sneller — meer volkoren enzymen actief",
        flavorProfile: "Diep, nootachtig, voller graan",
        whyWeUseIt:
          "T130 voegt diepte en dat lichte nootachtige accent toe. Op 10% verrijkt het zonder het deeg droog of compact te maken.",
      },
    ],
  },

  hydrationScience: {
    whyThisHydration:
      "76% (380 g water op 500 g bloem) is bewust aan de hoge kant. Meer water geeft een lichtere kruim, betere extensie van het deeg en die dunne, knapperige korst die Pain de Campagne kenmerkt.",
    lowerHydrationEffect:
      "Minder water (68–72%) maakt het deeg makkelijker te hanteren, maar het kruim wordt compacter, de korst dikker en de smaak vlakker. Het brood verliest zijn elegante openheid.",
    higherHydrationEffect:
      "Meer water (78%+) geeft nog openere kruim, maar wordt thuis lastig te hanteren. Risico op uitspreiden, plakken en inconsistente vorm zonder ervaring.",
    handling:
      "Het deeg voelt nat en plakkerig — dat is normaal. Gebruik natte handen, stretch-and-folds boven de kom en voeg geen extra bloem toe op je werkbank.",
    ovenSpring:
      "Hoge hydratatie + goede glutenstructuur = krachtige oven spring. Het brood zet uit in de oven doordat opgeslagen CO₂ en stoom het deeg opblazen.",
    crumb:
      "Licht open, luchtig en zacht — met kleine, onregelmatige luchtbellen. Niet te gatenachtig (te nat) en niet te dicht (te droog).",
    crust:
      "Dun, knapperig en diep gekarameliseerd. Stoom in de eerste bakfase is essentieel voor dit resultaat thuis.",
  },

  starterScience: {
    whyThisPercentage:
      "20% (100 g starter op 500 g bloem, 100% hydratatie) geeft een betrouwbare, actieve fermentatie op kamertemperatuur zonder te agressief te rijzen.",
    lessStarterEffect:
      "Minder starter (10–15%): langzamere rijsing, mildere zuurgraad, maar ook vlakkere smaak en langere wachttijden. Minder voorspelbaar thuis.",
    moreStarterEffect:
      "Meer starter (25–30%): snellere rijsing, scherpere zuurgraad, risico op overrijping en een deeg dat te snel zijn structuur verliest.",
    planningImpact:
      "20% maakt het recept planbaar: bulk 4–5 uur, koel 12–24 uur. Past perfect in een overnight routine — 's avonds vormen, 's ochtends bakken.",
    flavorImpact:
      "Milde, evenwichtige zuurgraad. Genoeg zuurdesem-smaak om het brood te verrijken, niet zo veel dat het de tarwesmaak overschaduwt.",
  },

  fermentationScience: {
    bulkFermentation:
      "4–5 uur op kamertemperatuur. Stretch-and-folds elke 30–45 minuten bouwen gluten op. Stop als het deeg 30–50% is gegroeid en een deuk langzaam terugveert.",
    coldFermentation:
      "12–24 uur op 4 °C. Vertraagt fermentatie, ontwikkelt diepere smaak en maakt het deeg stabieler bij het bakken. Ideaal voor ochtendbakkers.",
    biology:
      "Wilg gist en melkzuurbacteriën eten de tarwezetmeel (amylase breekt zetmeel af tot suikers). Ze produceren CO₂ (volume), melkzuur (milde zuurgraad) en azijnzuur (complexiteit). Protease zwakt gluten geleidelijk — timing is alles.",
    whyTheseTimes:
      "Bulk bouwt structuur en volume; koelrijsing bouwt smaak en maakt het deeg hanterbaar. Te kort = vlak brood. Te lang = overrijp, zuur en zwak deeg. Deze vensters zijn de Doughbert-sweet spot voor thuisbakkers.",
  },

  doughbertScience: {
    introduction:
      "Zuurdesem is levende microbiologie in je keuken. Deze begrippen helpen je begrijpen waarom Pain de Campagne werkt — en waarom timing zo belangrijk is.",
    topics: [
      {
        term: "Gluten",
        explanation:
          "Eiwitten in tarwe die, gehydrateerd en gekneed, een elastisch net vormen. Dat net vangt CO₂ en geeft structuur. T65 + T80 + T130 samen geven een soepel maar stevig net.",
      },
      {
        term: "Enzymen",
        explanation:
          "Natuurlijke eiwitten in tarwe én in je starter die zetmeel en eiwitten afbreken. Amylase maakt suikers; protease verzwakt gluten. Meer volkoren = meer enzymen = snellere fermentatie.",
      },
      {
        term: "Amylase",
        explanation:
          "Breekt zetmeel af tot suikers die gist voedt. Meer suikers = meer CO₂ en meer karamellisatie in de korst. T130 draagt extra amylase-activiteit bij.",
      },
      {
        term: "Protease",
        explanation:
          "Breekt gluten af. Nuttig voor extensie, maar te veel (overrijping) maakt het deeg slap en het brood plat. Daarom: respecteer bulk- en koeltijden.",
      },
      {
        term: "Melkzuurbacteriën",
        explanation:
          "Produceren melkzuur — milde, yogurachtige zuurgraad. Dominant bij lagere temperaturen (koelrijsing), wat Pain de Campagne zijn evenwichtige smaak geeft.",
      },
      {
        term: "Azijnzuurbacteriën",
        explanation:
          "Produceren azijnzuur — scherpere, complexere tonen. Meer actief bij warmere temperaturen. Balans met melkzuur maakt het brood interessant zonder te zuur te worden.",
      },
      {
        term: "CO₂-productie",
        explanation:
          "Gist produceert CO₂ dat opgevangen wordt in het glutensnet. Dat creëert luchtbellen en volume — zichtbaar in bulk én als oven spring.",
      },
      {
        term: "Smaakontwikkeling",
        explanation:
          "Langzame fermentatie bouwt smaak op: zetmeelafbraak, zuurproductie en Maillard-reactie in de korst. Koelrijsing is de smaakmotor van dit recept.",
      },
    ],
  },

  commonMistakes: [
    {
      mistake: "Extra bloem toevoegen omdat het deeg plakt",
      cause: "Angst voor hoge hydratatie — het deeg voelt nat, dus je denkt dat het fout is.",
      solution:
        "Vertrouw op stretch-and-folds en natte handen. Extra bloem verlaagt hydratatie en geeft een compact kruim.",
    },
    {
      mistake: "Starter te vroeg gebruiken",
      cause: "De starter is nog niet bubbelend en actief genoeg na het voeden.",
      solution:
        "Wacht 8–12 uur tot hij duidelijk is gegroeid. Actieve starter = betrouwbare rijsing.",
    },
    {
      mistake: "Te weinig stretch-and-folds",
      cause: "Bij 76% hydratatie bouwt het deeg niet genoeg structuur op zonder hulp.",
      solution: "Doe 3–4 folds elke 30–45 minuten tijdens de bulk. Boven de kom werkt het best.",
    },
    {
      mistake: "Bulk te kort laten",
      cause: "Het deeg ziet er 'al groot' uit, maar is nog niet rijp.",
      solution:
        "Test met de deuk-test: druk voorzichtig — deuk die langzaam terugveert = klaar. Volume alleen zegt niets.",
    },
    {
      mistake: "Bakken zonder stoom",
      cause: "Geen stoom of deksel in de eerste bakfase.",
      solution:
        "Gebruik een Dutch oven-deksel of stoom de eerste 20 minuten voor een dunne, knapperige korst.",
    },
    {
      mistake: "Te vroeg snijden",
      cause: "Verleiding om warm brood te proeven direct na het bakken.",
      solution:
        "Wacht minstens 1 uur. Het kruim zet nog na en de structuur stabiliseert.",
    },
    {
      mistake: "Koelrijsing te lang laten duren",
      cause: "Meer dan 24 uur in de koelkast — denken dat langer altijd beter is.",
      solution:
        "Maximaal 24 uur. Langer = overrijp, zuur en zwak deeg dat inzakken in de oven.",
    },
  ],

  troubleshooting: [
    {
      problem: "Deeg rijst niet of traag",
      possibleCause: "Starter niet actief genoeg, of keuken te koud (<18 °C).",
      solution:
        "Gebruik een bubbelende starter. Verwarm de keuken licht of verleng bulk met 1–2 uur.",
    },
    {
      problem: "Deeg te nat en onhanterbaar",
      possibleCause: "Normale reactie op 76% hydratatie, of te weinig folds.",
      solution:
        "Voeg geen bloem toe. Extra folds + 15 min rust tussen elke fold.",
    },
    {
      problem: "Kruim dicht en compact",
      possibleCause: "Bulk te kort, te weinig folds, of te lage hydratatie door extra bloem.",
      solution: "Langer bulk, meer folds, respecteer 76% hydratatie.",
    },
    {
      problem: "Brood te zuur",
      possibleCause: "Koelrijsing te lang (>24 u) of starter overrijp bij mixen.",
      solution: "Verkort koelrijsing naar 12–16 uur. Voed starter op het juiste moment.",
    },
    {
      problem: "Brood smaakt flauw",
      possibleCause: "Starter niet actief, bulk te kort, of te snel gebakken.",
      solution: "Actieve starter, langere bulk tot de deuk-test slaagt.",
    },
    {
      problem: "Korst dik en hard",
      possibleCause: "Geen stoom, oven te droog, of te lage temperatuur.",
      solution: "Dutch oven-deksel eerste 20 min, 230–250 °C, stoom toevoegen.",
    },
    {
      problem: "Brood zakt in de oven",
      possibleCause: "Overproofed — te lang gerijst in bulk of koel.",
      solution: "Verkort bulk of koelrijsing. De deuk-test: snelle terugveer = overrijp.",
    },
    {
      problem: "Brood plakt aan rijsmand",
      possibleCause: "Tarwebloem i.p.v. rijstemeel, of deeg te nat aan oppervlak.",
      solution: "Rijstemeel in de mand. Licht meel op de bovenkant bij het storten.",
    },
  ],

  doughbertTips: [
    "Doughberts signature-mix: wissel nooit T65, T80 en T130 af — de balans ís het recept.",
    "Plan een overnight bake: 's avonds vormen, 12–18 uur koel, 's ochtends bakken.",
    "Stretch-and-fold boven de kom — minder rommel, meer controle bij 76% hydratatie.",
    "Rijstemeel in je rijsmand; tarwebloem plakt en beschadigt de korst.",
    "Dutch oven = thuis beste resultaat: stoom, hitte en dunne korst in één.",
    "Noteer kamertemperatuur en rijsduur per bake — zo leer je jouw keuken kennen.",
    "Pain de Campagne smaakt het best op dag 1 en 2 — toast de rest perfect.",
  ],

  didYouKnow: [
    {
      title: "Waarom 'Campagne'?",
      fact: "Het woord verwijst naar het Franse platteland. Traditioneel bakten dorpsbakkers één deeg voor heel het dorp — vandaar de betrouwbare, dagelijkse aard van dit brood.",
    },
    {
      title: "Autolyse maakt het verschil",
      fact: "30 minuten rust na bloem + water laat enzymen werken zonder zout of starter. Het deeg wordt soepeler — cruciaal bij 76% hydratatie.",
    },
    {
      title: "Koelkast = smaakmotor",
      fact: "Bij 4 °C werken melkzuurbacteriën langzamer maar dieper. Daarom smaakt overnight Pain de Campagne rijker dan een snelle same-day bake.",
    },
    {
      title: "De deuk-test",
      fact: "Druk voorzichtig met je vinger in het deeg. Veert langzaam terug = rijp. Veert snel terug = underproofed. Veert niet terug = overproofed.",
    },
    {
      title: "T65 vs. gewone bloem",
      fact: "Franse T65 is geclassificeerd op extract (mineralen). Dat geeft consistentere resultaten dan generieke 'tarwebloem' — vooral bij zuurdesem.",
    },
    {
      title: "Stoom = dunne korst",
      fact: "Stoom vertraagt korstvorming in de oven, zodat het brood eerst kan rijzen. Daarna droogt de korst snel uit — knapperig en dun.",
    },
  ],
};
