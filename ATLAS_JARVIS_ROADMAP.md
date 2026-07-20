# Atlas Build — CTO Roadmap naar de Jarvis North Star

**Van:** CTO
**Aan:** CEO
**Status:** Strategisch document — geen implementatie, geen sprintlijst, geen code
**Datum:** juli 2026

---

## 0. Kern van het antwoord

De kortste route naar de North Star loopt niet via nieuwe motoren, maar via één nieuwe laag boven de bestaande motoren: een **synthese-laag** die de output van Decision Engine, Content Engine, Execution Engine en Company State samenvoegt tot één samenhangend verhaal — plus een **presentatielaag** die dat verhaal toont zonder de interne machinerie bloot te leggen.

Atlas heeft vandaag alle losse organen van een lichaam. Wat ontbreekt is het zenuwstelsel dat ze laat samenwerken vóórdat de CEO iets ziet, en de mond die er één stem van maakt.

Twee dingen zijn met opzet **niet** op het kritieke pad gezet, ondanks dat ze in de video de meeste indruk maken: echte externe bedrijfscijfers (omzet, downloads, ad spend) en spraak. Beide zijn losse, parallelle, toegangsafhankelijke sporen — geen van beide blokkeert een eerste geloofwaardige versie van de ervaring.

---

## 1. De North Star vertaald naar technische bouwstenen

De CEO-flow uit de opdracht ontleedt in acht technische capabilities:

1. De gebruiker loopt The Room binnen → **één CEO-facing oppervlak** (vandaag zijn dat er twee: Atlas Control en The Room, los van elkaar).
2. Atlas ontvangt de gebruiker → **aanwezigheid/aanspreking**, bestaat al (Heart, Awakening).
3. Atlas geeft een natuurlijke briefing → **synthese-laag** die over domeinen heen vertelt wat ertoe doet (ontbreekt).
4. Atlas vertelt wat er gebeurd is → **actielog met narratie** (bestaat deels, is generiek).
5. Atlas laat zien wie uit het AI-team waaraan werkte → **teamtoewijzing zichtbaar, maar in één stem** (bestaat als routing-fictie, wordt vandaag juist te letterlijk getoond — spanning met "One Voice").
6. Atlas presenteert inzichten → **prioritering over domeinen** (bestaat alleen binnen engineering).
7. Atlas doet aanbevelingen en vraagt goedkeuring waar nodig → **risicoclassificatie: wat mag zonder vragen** (ontbreekt volledig).
8. Atlas voert vervolgens zelfstandig werk uit → **bestaat al, met een echt goedkeuringshek** (propose → approve → apply).

Zeven van de acht stappen leunen op iets dat al bestaat. Alleen stap 3 en 7 zijn architecturaal nieuw; de rest is uitbreiden, verbinden en herpresenteren.

---

## 2. Wat volledig bestaat

| Capability | Bewijs | Waarom dit telt |
|---|---|---|
| **Context Engine** | `brain/context/*` — bundelt geheugen (exact + semantisch), entities, kennis en workflows; actief gebruikt vóór elke `mission.decide`-call | Dit is de motor die straks weet wát relevant is om te noemen in een briefing |
| **Evolution Engine (capability-gap scoring)** | `constitution/EvolutionEngine.ts` — regex-matcht intentie naar capability, weegt en rangschikt op waarde | Een echt, niet-triviaal prioriteringsalgoritme — herbruikbaar buiten engineering |
| **Memory Engine** | `brain/memory/*` — CRUD, semantisch zoeken (BRAIN-008), retentie (BRAIN-009), gedeeld backend↔dashboard | Volwassen interne kennisbank; alleen de vertaalslag naar spreektaal ontbreekt |
| **Propose → Approve → Apply keten** | `MissionOrchestrator.ts` → `executionEngine.ts` → `applyEngine.ts`, met een echt CEO Inbox-goedkeuringshek (poort 8791) | Dit ís al "Atlas voert zelfstandig werk uit, na jouw akkoord" — de kern van stap 8 |
| **Organisatiemodel** | `organization/OrganizationalModel.ts` — 8 departementen, benoemde AI-medewerkers, routeringslogica | De ruwe data voor "wie werkte waaraan" bestaat al als structuur |
| **Content-pipeline (geschreven content)** | `publishing/PublishingPipeline.ts` — research → copywriting → visual → fact-check → linking → validatie → publicatie, met 7 benoemde agents | Een volledig werkende contentfabriek — alleen beperkt tot artikelen, niet social/video |
| **CEO Inbox-mechaniek** | `CeoInboxSection.tsx` / `CeoInboxV2.tsx` — pending/approved/needs_changes/deferred, echte Apply-koppeling | Het goedkeur-ritueel uit de video bestaat al als patroon |

---

## 3. Wat gedeeltelijk bestaat

| Capability | Wat werkt | Wat ontbreekt |
|---|---|---|
| **Decision Engine** | Regelgebaseerd, met sjabloon-redenering die al spreektaal-achtig is (`reasoning: string[]`) | Geen cross-domein rangschikking — engineering krijgt een waardescore, content/marketing/support krijgen alleen een routeringszin. Geen weegschaal tussen domeinen |
| **Briefing/digest** | `CockpitOpening.tsx` + `cockpitOpeningHelpers.ts` doen letterlijk al "begroet + terugblik + wat vraagt aandacht" — CEO-goedgekeurd patroon (CEO_COCKPIT.md) | Voedt zich uit maar twee smalle bronnen (één advies-string, appliedHistory); geen echte synthese over content + engineering + decisions + team heen |
| **Actielog met narratie** | `buildAppliedHistory()` is een echte, gestructureerde log van elke toegepaste wijziging, incl. validatieresultaat; al samengevat als "N verbeteringen doorgevoerd" | Narratie is generiek (aantal + titels), geen categorie-aggregatie zoals "13 bugs opgelost" |
| **AI-team zichtbaarheid** | 7 echte, onderscheiden agents met eigen logica | Uitsluitend content-georiënteerd — geen "Tom"-equivalent voor engineering; en de UI toont departementen/namen juist té expliciet aan de CEO (`ManagementTeamSection`, `CompanyOperationsSection`) — dit is de directe spanning met het "One Voice"-principe dat al in de Constitutie staat |
| **Validatie na Apply** | Een echte testsuite draait na elke toepassing (EXEC-003) | Draait ná, niet vóór — geen pre-apply kwaliteitspoort, geen automatische terugdraai bij falen |
| **CompanyState persistence** | Overleeft page-refresh op web | Alleen `window.localStorage`, faalt stil op iOS/Android — niet houdbaar als de briefing-ervaring op The Room (mobiel) gaat leunen |
| **Runtime-cadans** | Draaiende achtergrondlus, elke 5 minuten één missie | Geen dagindeling met fases (onderzoek/bouwen/reviewen/publiceren) — één spoor, niet meerdere tegelijk |

---

## 4. Wat volledig ontbreekt

| Capability | Bevestiging |
|---|---|
| **Eén cross-domein prioriteitsschaal** | Nergens in de code wordt content, marketing, engineering en support tegen elkaar afgewogen op één schaal |
| **Risicoclassificatie (wat mag zonder te vragen)** | Nul treffers voor `riskLevel`, `autoApprove`, `requiresApproval` of vergelijkbaar — dit concept bestaat nog niet |
| **Echte externe bedrijfsdata** | Downloads, omzet, ad spend/ROAS, content-views: geen van alle aanwezig. Alle huidige KPI's zijn interne dev-metrics (audit-score, roadmapvoortgang, bugs) |
| **Externe integraties** | Geen Stripe, RevenueCat, Meta/TikTok/Google Ads, App Store Connect/Play Console, en geen GitHub-API voor echte PR's — bevestigd via dependency- en repo-scan |
| **Spraak (in/uit)** | Geen enkele audio/TTS/STT-library aanwezig |
| **Social/video content** | De contentfabriek is geschreven-artikel-only; geen Instagram/TikTok/YouTube, geen short-form video, geen advertentielogica |
| **Eén CEO-facing oppervlak** | Atlas Control (web) en The Room (mobiel) zijn twee losse codebases zonder gedeelde componenten |
| **Dagindeling/scheduler voorbij 5 minuten** | Geen cron, geen dagfasering — bevestigd, alleen de ene interval-lus bestaat |

---

## 5. De vijf vragen die de volgorde bepalen

**Wat moet eerst?**
De synthese-laag (cross-domein digest) is de harde afhankelijkheid. Zonder haar heeft geen enkele latere stap — Room-weergave, aanbeveling-in-plaats-van-vraag, "eigen werkdag" — iets samenhangends om te tonen. "One Voice" moet gelijktijdig of vlak daarvoor, anders toont de allereerste bruikbare demo meteen het probleem dat de CEO net signaleerde. De reconciliatie tussen Atlas Control en The Room moet vóór er een verhalende weergave gebouwd wordt — anders bouw je een ervaring in een oppervlak dat daarna alsnog moet samensmelten.

**Wat levert het snelst een bruikbare Atlas op?**
In volgorde van effect-per-inspanning: (1) One Voice — klein, direct voelbaar, herstelt een principe dat al in de Constitutie staat. (2) Synthese-laag boven bestaande bronnen (CockpitOpening, DecisionReasoning, appliedHistory, Organisatiemodel) — het hart van de ervaring, matig werk omdat de bronnen al bestaan. (3) Reconciliatie Room/Control — bepaalt wáár dit leeft. (4) Risicoclassificatie — nodig zodra "voert zelfstandig werk uit" meer dan één categorie mag omvatten. Pas daarna: (5) externe databronnen, het grootste en meest afhankelijke spoor.

**Wat kan parallel?**
One Voice, het ontwerp van de risicoclassificatie, en de voorbereiding van externe integraties (toegang/keys aanvragen bij de CEO) raken elk een andere laag — presentatie, policy, externe toegang — en hebben onderling geen afhankelijkheid. Ze kunnen naast de synthese-laag lopen zonder elkaar te blokkeren. Ook het verbeteren van pre-apply testvalidatie is een onafhankelijk spoor.

**Wat zijn de technische risico's?**
Ten eerste de twee divergente CEO-oppervlakken — niet ontworpen om samen te smelten, de reconciliatie kan groter blijken dan hij oogt. Ten tweede CompanyState-persistence die stilzwijgend faalt op mobiel — een gat dat pas zichtbaar wordt zodra de briefing-ervaring erop gaat leunen. Ten derde validatie die ná in plaats van vóór toepassing draait — een reëel kwaliteitsrisico zodra autonomie toeneemt. Ten vierde het ontbreken van risicoclassificatie — zonder dat begrip is "automatisch, behalve wat gevaarlijk is" niet uitvoerbaar. Ten vijfde: externe integraties brengen credential- en compliance-risico met zich mee dat buiten pure engineering valt.

**Wat vereist externe integraties?**
Downloads (App Store Connect / Play Console), omzet (Stripe, RevenueCat, of platform-billing), ad spend/ROAS (Meta Ads, TikTok Ads, Google Ads), content-/social-views (Instagram-, TikTok-, YouTube-analytics), en eventueel een kanaal buiten de app om voor meldingen (Gmail/Slack). Een echte GitHub-koppeling voor PR's is nu ook afwezig en zou nodig zijn als "Atlas opent een PR" letterlijk genomen wordt in plaats van de huidige propose/apply-aanpak.

---

## 6. Wat bewust uitgesteld kan worden zonder de North Star te verliezen

De North Star gaat over de **vorm** van de ervaring — begroeten, vertellen, aanbevelen, goedkeuring vragen, uitvoeren — niet per se over wélke cijfers erin zitten of in welke modaliteit ze verschijnen. Vier dingen kunnen bewust later:

- **Externe bedrijfsdata** (omzet/downloads/ads/social). De ervaring kan volledig werken op wat er al is — roadmapvoortgang, content, bugs, git-activiteit — vóór er sprake is van echte handelscijfers.
- **Spraak.** De briefing kan eerst volledig tekstueel/visueel in The Room werken; spraak is een laag erbovenop, geen architectuurwijziging.
- **Een geautomatiseerde dagindeling.** De eerste versie kan beginnen als "vertel me wat er gebeurd is sinds de vorige keer" — op verzoek, niet op de klok — en pas later verschuiven naar een zelfstandig dagritme.
- **Pre-apply testpoort verbeteren.** Belangrijk voor kwaliteit op langere termijn, maar blokkeert de North Star-ervaring niet zolang autonomie aanvankelijk beperkt blijft tot laag risico.

---

## 7. Gefaseerde route (mijlpalen, geen sprints)

Elke fase is een afgeronde capability-uitbreiding met een eigen, zichtbaar resultaat — geen technische deeltaken.

**Fase A — One Voice**
Herstel het principe dat al in de Constitutie staat: alles wat de CEO ziet spreekt als één Atlas. Interne agent-/departementstructuur blijft bestaan, wordt alleen niet meer naar buiten getoond.

**Fase B — Synthese-laag**
Eén nieuwe component die Decision Engine, Content-status, Execution-log en Organisatiemodel samenvoegt tot een gerangschikt, verhalend geheel — de eerste keer dat Atlas zelf bepaalt wat de moeite van het vertellen waard is, in plaats van dat elk domein zijn eigen lijstje toont.

**Fase C — Eén CEO-oppervlak**
Bepaal en bouw de samensmelting van Atlas Control en The Room tot één plek waar de briefing daadwerkelijk landt.

**Fase D — Risicoclassificatie**
Het onderscheid tussen "voer ik zelfstandig uit" en "dit vraagt jouw akkoord" — de voorwaarde om stap 7 en 8 van de North Star geloofwaardig te maken.

**Fase E — Verhalende weergave in The Room**
De synthese uit Fase B afgespeeld als sequentie (punt, pauze, visualisatie) in het oppervlak uit Fase C, gedragen door de regels uit Fase D.

**Fase F — Externe databronnen (parallel spoor, geen harde afhankelijkheid)**
Per bron (downloads, omzet, ads, social) losstaand aan te sluiten zodra toegang er is; elke koppeling maakt de bestaande synthese rijker zonder haar te hoeven herbouwen.

**Fase G — Spraak (parallel spoor, later)**
Een laag boven Fase E, geen vervanging ervan.

---

## 8. Uitgangspunt bevestigd

Niets in deze roadmap vraagt om bestaande architectuur af te breken. Decision Engine, Execution Engine, Company State, The Room, CEO Inbox, Department Wall, Content-pipeline en Memory Engine blijven exact wat ze zijn — de weg naar de North Star loopt via een synthese- en presentatielaag daarbovenop, niet via vervanging.
