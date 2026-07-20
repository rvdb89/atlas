# Atlas Build Roadmap — v1.0

**Van:** CTO
**Aan:** CEO
**Status:** Definitief en leidend — inclusief Definition of Done per fase en Roadmap Governance (zie einde document)
**Bouwt op:** ATLAS_JARVIS_ROADMAP.md (CTO-analyse), ATLAS_A_DAY_IN_THE_LIFE.md (operationeel model, inclusief het herziene besluit dat Atlas een echt, benoemd managementteam leidt), ATLAS_IDENTITY_CONSTITUTION.md, CEO_COCKPIT.md

Dit document introduceert geen nieuwe visie en geen nieuwe filosofie. Het zet de al genomen besluiten in de enige volgorde die de afhankelijkheden toestaan. Waar een fase pas kan beginnen omdat een fundament ontbreekt, staat dat expliciet vermeld.

---

## Fase 0 — Executive Memory

**Doel**
Elke latere fase — het team dat rapporteert, het beleid dat besluiten classificeert, de synthese die een verhaal bouwt, de briefing die het vertelt — moet kunnen vertrouwen op één geheugen dat blijft bestaan. Vandaag bestaat dat niet: de bedrijfsstaat leeft alleen in de browser van het web-dashboard en is leeg zodra hetzelfde bedrijf op mobiel wordt geopend. Zonder deze fase is elke latere "dit is wat er gebeurd is"-uitspraak van Atlas gebouwd op drijfzand.

**Opleveringen**
- Executive Memory — één persistente, platformonafhankelijke bron van waarheid voor bedrijfsstaat en acties

**Nieuwe systemen**
- Executive Memory (de opslaglaag zelf bestaat nog niet; vandaag is er alleen een browser-gebonden noodoplossing)

**Bestaande systemen aanpassen**
- Company State — verliest zijn huidige web-only, browser-opslag-afhankelijkheid en gaat op Executive Memory draaien
- Memory Engine en Context Engine — gaan dezelfde onderliggende laag gebruiken in plaats van hun eigen, aparte opslag

**Afhankelijkheden**
Geen. Dit is het fundament waarop alle volgende fasen rusten.

**Resultaat**
Atlas kan voor het eerst betrouwbaar zeggen wat er sinds de vorige keer is gebeurd — op elk platform, zonder dataverlies.

**Definition of Done**
- Company State, Memory Engine en Context Engine draaien allemaal op Executive Memory; er bestaat geen apart, browser-gebonden opslagpad meer.
- Een herstart van de app, of het wisselen van web naar mobiel, laat de bedrijfsstaat en het actielog ongewijzigd zien.
- Alles wat vóór deze fase al werkte (Decision Engine, CEO Inbox, Content-pipeline) functioneert nog steeds, zonder functieverlies.

---

## Fase 1 — AI Management Team

**Doel**
Het managementteam dat "A Day in the Life of Atlas" beschrijft — Tom, Anna, Scout, Yara, Jerry — moet echt bestaan, niet alleen als verhaal. Vandaag zijn er wel zeven benoemde agents, maar ze zijn uitsluitend content-gericht; engineering heeft geen eigen gezicht en klantcontact bestaat nog niet als capability. Zonder deze fase is elke latere "wie deed wat"-vertelling verzonnen in plaats van waar.

**Opleveringen**
- AI Management Team — Tom (Engineering), Anna (Marketing & Content), Scout (Research & Trends), Yara (Quality & Review), Jerry (Customer Success), elk met een herkenbare, eigen werkstroom die naar Executive Memory rapporteert

**Nieuwe systemen**
- Tom — een engineering-identiteit boven op de bestaande code-uitvoering, die vandaag anoniem draait
- Jerry — een klantcontact-capability die vandaag nergens bestaat
- Scout — een geformaliseerde research/trend-signalering; vandaag alleen impliciet aanwezig als intentieherkenning zonder eigen gezicht

**Bestaande systemen aanpassen**
- Het huidige content-agentteam (auteur, visueel ontwerp, feitencontrole, validatie) wordt hergebruikt en herbenoemd tot Anna en Yara
- Organization Model — breidt uit met de twee nieuwe rollen en krijgt een echte koppeling tussen toegewezen werk en daadwerkelijk uitgevoerd werk (vandaag is dit alleen een routeringsfictie: wie iets zóu doen, niet wie het deed)
- Execution/Apply-keten — krijgt Tom als vaste, herkenbare afzender in plaats van naamloos te draaien

**Afhankelijkheden**
Fase 0. Elk teamlid moet zijn werk kunnen wegschrijven naar een geheugen dat blijft bestaan — zonder dat is toeschrijving morgen weer verdwenen.

**Resultaat**
Atlas stuurt voor het eerst een echt, onderscheiden managementteam aan — geen vijf labels op één anoniem proces.

**Definition of Done**
- Tom, Anna, Scout, Yara en Jerry bestaan elk als herkenbare afzender van daadwerkelijk uitgevoerd werk, niet als label op een gedeeld proces.
- Voor elk stuk werk dat een van de vijf oplevert, is in Executive Memory terug te vinden wie het deed.
- Werk dat Organization Model aan één teamlid toewijst, komt ook daadwerkelijk als voltooide actie van datzelfde teamlid terug — niet van een ander en niet ongemarkeerd.
- Alle content-, engineering- en beslissingsfunctionaliteit die vóór deze fase al bestond, werkt nog steeds, nu onder de naam van het juiste teamlid.

**Aanvulling — Department Management-principe (Sprint 1.4-correctie, 2026-07-19)**

Tijdens Sprint 1.4 is onderzocht of Atlas een generieke coördinerende laag ("Mission Control") tussen Atlas en het volledige team nodig heeft. Dat voorstel — inclusief een nieuw bedachte identiteit `"milo"` — is expliciet **niet geratificeerd** en volledig teruggedraaid. In plaats daarvan geldt vanaf nu het volgende, definitieve principe:

1. Atlas routeert missies naar afdelingen — niet naar individuele specialisten en niet naar een generieke tussenlaag.
2. Een afdeling kan een eigen managerlaag krijgen.
3. Managers coördineren uitsluitend hun eigen afdeling, nooit afdelingsoverstijgend.
4. Specialisten voeren het inhoudelijke werk uit.
5. Een benoemde manageridentiteit wordt pas geïntroduceerd wanneer die afdeling een concreet schaal- of coördinatieprobleem heeft — niet vooruitlopend daarop.
6. Er bestaat voorlopig geen algemene teamidentiteit voor Mission Control; Tom, Anna, Scout, Yara en Jerry blijven de enige vijf geratificeerde identiteiten uit deze fase.
7. Atlas zelf blijft de organisatiebrede regielaag: missies ontvangen, bepalen welke afdeling nodig is, werk routeren, afdelingsresultaten verzamelen, en escalaties en beslissingen aan de CEO voorleggen.

Dit vervangt stilzwijgend geen eerdere Definition of Done hierboven — het is een aanvullend, expliciet vastgelegd principe voor hoe eventuele toekomstige afdelingsmanagers zich tot Atlas en tot elkaar verhouden.

---

## Fase 2 — Risicoclassificatie & Goedkeuringsbeleid

**Doel**
Voordat Atlas zelfstandig werk mag uitvoeren én daar eerlijk over mag rapporteren, moet vaststaan wat zelfstandig mag en wat altijd eerst bij de CEO moet landen. Dit onderscheid bestaat vandaag nergens in het systeem — alles wat de Execution-keten oplevert vraagt op dit moment dezelfde, uniforme goedkeuring, ongeacht het risico.

**Opleveringen**
- Goedkeuringsbeleid — een expliciete risicoclassificatie per type actie *(Sprint 2.1 — kritiek pad, zie Governance-amendement)*
- Vernieuwde CEO Inbox met zichtbaar onderscheid tussen "al automatisch uitgevoerd" en "wacht op jouw besluit" *(Sprint 2.2 — uitgesteld tot na de eerste complete Atlas-ervaring, zie Governance-amendement)*
- Een kwaliteitspoort vóór uitvoering, niet erna *(Sprint 2.3 — uitgesteld tot na de eerste complete Atlas-ervaring, zie Governance-amendement)*

**Nieuwe systemen**
- Goedkeuringsbeleid / risicoclassificatie (vandaag: nul aanwezig)

**Bestaande systemen aanpassen**
- CEO Inbox — toont vandaag alles als "pending"; krijgt een echt statusonderscheid
- Execution/Apply-keten — validatie draait vandaag ná toepassing en is geen harde poort; wordt dat wel voor alles wat niet als laag risico is geclassificeerd

**Afhankelijkheden**
Fase 1. Er moeten echte, aan teamleden toegeschreven acties bestaan voordat er iets zinvols te classificeren valt.

**Resultaat**
Atlas mag voor het eerst zelfstandig handelen binnen bewuste, expliciete grenzen — en kan dat onderscheid ook eerlijk navertellen, in plaats van alles hetzelfde te behandelen.

**Definition of Done**
- Elk type actie heeft een vastgestelde risicoclassificatie; er bestaat geen actie meer zonder classificatie.
- De CEO Inbox toont zichtbaar onderscheid tussen "automatisch uitgevoerd" en "wacht op besluit", en beide statussen komen daadwerkelijk voor.
- Geen enkele actie die als hoog risico is geclassificeerd, wordt toegepast zonder voorafgaande CEO-goedkeuring.
- De kwaliteitspoort draait vóór toepassing voor alles wat niet als laag risico is geclassificeerd; een falende toets voorkomt aantoonbaar dat de wijziging wordt doorgevoerd.

---

## Fase 3 — Synthese Engine

**Doel**
Dit is de spil van de hele North Star. Zonder een laag die content, engineering, research, klantcontact en besluiten samenvoegt tot één gerangschikt geheel, heeft Atlas nooit iets samenhangends te vertellen — alleen losse, departementale updates naast elkaar.

**Opleveringen**
- Synthese Engine — cross-domein prioritering én verhaalopbouw: wat is vandaag het vertellen waard, en in welke volgorde

**Nieuwe systemen**
- Synthese Engine (cross-domein rangschikking bestaat vandaag nergens; de huidige Decision Engine rangschikt uitsluitend binnen engineering)

**Bestaande systemen aanpassen**
- Decision Engine — breidt uit van een engineering-only waardescore naar een schaal die ook content, research, kwaliteit en klantcontact meeweegt
- CockpitOpening (de huidige, smalle briefing-sjablonen) — wordt vervangen door echte synthese in plaats van twee hardgecodeerde bronnen

**Afhankelijkheden**
Fase 0 (iets om uit te putten), Fase 1 (echt, toewijsbaar werk om samen te vatten), Fase 2 (weten wat al automatisch is afgehandeld versus wat nog wacht).

**Resultaat**
Atlas bepaalt voor het eerst zelf wat er vandaag toe doet, over de volle breedte van de onderneming — niet per department apart, en niet als platte lijst.

**Definition of Done**
- De Synthese Engine ontvangt en verwerkt input van alle vijf teamleden, niet alleen van engineering.
- Voor een gegeven periode levert de Synthese Engine een gerangschikte, beperkte selectie op — niet de volledige activiteitenlijst.
- Dezelfde onderliggende gebeurtenissen leiden aantoonbaar tot een andere selectie zodra hun belang verschilt; de rangschikking is geen vaste volgorde.
- CockpitOpening's oude, hardgecodeerde briefing-sjablonen bestaan niet meer als apart pad naast de Synthese Engine.

---

## Fase 4 — Eén CEO-oppervlak (The Room v1)

**Doel**
Atlas Control en The Room zijn vandaag twee losse codebases zonder gedeelde componenten. Voordat er één briefing-ervaring gebouwd wordt, moet vaststaan wáár die leeft — anders bouwen we haar twee keer, of op de verkeerde plek.

**Opleveringen**
- The Room v1 — het enige, geratificeerde CEO-facing oppervlak

**Nieuwe systemen**
- Geen. Dit is samenvoegen, geen nieuwbouw.

**Bestaande systemen aanpassen**
- Atlas Control (dashboard, CEO Inbox-secties, teamoverzicht) en The Room (Department Wall, CEO Inbox-als-object) worden samengevoegd tot één oppervlak
- Wat in Atlas Control bruikbaar is gebleken, verhuist naar The Room in plaats van ernaast te blijven bestaan

**Afhankelijkheden**
Geen harde afhankelijkheid van Fase 0-3 — dit is een architectuurbeslissing, geen databeslissing, en kan parallel aan Fase 0-3 gebouwd worden. Moet wél af zijn vóór Fase 5 begint.

**Resultaat**
Er is voor het eerst één plek waar de CEO Atlas ontmoet, in plaats van twee losse ervaringen die toevallig hetzelfde bedrijf tonen.

**Definition of Done**
- Er is één CEO-facing oppervlak; Atlas Control en The Room bestaan niet langer als twee losse, niet-gedeelde codebases.
- Elke functionaliteit die voorheen alleen in Atlas Control bestond (CEO Inbox, teamoverzicht) is bereikbaar vanuit hetzelfde oppervlak als The Room.
- Er is geen scenario meer waarin de CEO een andere versie van de bedrijfsstaat ziet, afhankelijk van welk oppervlak wordt geopend.

---

## Fase 5 — CEO Briefing

**Doel**
Dit is het eerste moment waarop de volledige North Star-ervaring echt bestaat: de CEO loopt binnen, Atlas vertelt een verhaal in plaats van een lijst, met visualisaties die verschijnen en weer verdwijnen, eindigend in een concrete aanbeveling — precies zoals vastgelegd in "A Day in the Life of Atlas".

**Opleveringen**
- CEO Briefing — de verhalende, sequentiële weergave in The Room

**Nieuwe systemen**
- De afspeel-sequentie zelf (punt verschijnt, pauze, visualisatie, verdwijnt, volgende punt) — bestaat vandaag nergens

**Bestaande systemen aanpassen**
- The Room — krijgt een nieuwe weergavelaag bovenop de bestaande objecten; Heart en Department Wall blijven ongemoeid als architectuur
- Rendering Law (de regels voor hoe The Room mag bewegen en verschijnen) — wordt uitgebreid met een sequentiële, verhalende modus die vandaag niet bestaat naast de huidige statische reveal-regels

**Afhankelijkheden**
Fase 0 volledig; Fase 1 volledig; Fase 2 — uitsluitend Sprint 2.1; Fase 3 volledig; Fase 4 volledig.
*(Governance-amendement 2026-07-19 — zie "Governance-amendement: Atlas Experience Track" verderop in dit document. Dit vervangt de eerdere, bredere formulering "Fase 0 tot en met 4, volledig": sprintniveau-afhankelijkheden binnen Fase 2 en 3 tonen aan dat alleen Sprint 2.1 daadwerkelijk vereist is voor Sprint 3.1 — Sprint 2.2 en 2.3 zijn nooit een echte voorwaarde geweest voor deze fase, alleen voor de volgorde zoals die eerder impliciet werd aangenomen.)*

**Resultaat**
De CEO krijgt voor het eerst een echte, op-verzoek briefing die aanvoelt zoals in de Jarvis-video — gebouwd op interne data, nog zonder eigen ritme en zonder externe cijfers.

**Definition of Done**
- Op verzoek toont The Room een sequentiële briefing — geen statische lijst — met minimaal twee tot drie punten na elkaar, elk met een moment van verschijnen en weer verdwijnen.
- De inhoud van de briefing komt aantoonbaar uit de Synthese Engine, niet uit een vast sjabloon.
- Wanneer er een aanbeveling is, eindigt de briefing daar concreet mee, inclusief een manier om akkoord te geven.
- Heart, stage en de bestaande architectuur van The Room functioneren ongewijzigd naast deze nieuwe weergavelaag.

---

## Fase 6 — Atlas' Werkdagritme

**Doel**
Fase 5 werkt al op verzoek. Deze fase maakt Atlas proactief: een echte dagindeling in plaats van de huidige achtergrondlus die elke vijf minuten telkens één missie kiest, zonder onderscheid tussen ochtend, middag of avond.

**Opleveringen**
- Atlas' Werkdagritme — een geplande, gefaseerde oriëntatie (onderzoek, bouwen, toetsen, klantcontact, synthese) die vanzelf loopt

**Nieuwe systemen**
- De dagfasering/planningslaag zelf

**Bestaande systemen aanpassen**
- De huidige runtime-lus (één missie per vijf minuten) wordt vervangen door een meersporige, gefaseerde planning die de vijf teamleden op logische momenten activeert

**Afhankelijkheden**
Fase 1 tot en met 5. Er moet al een team, beleid, synthese en briefing-oppervlak bestaan voordat het zinvol is dat automatisch op een ritme te laten lopen.

**Resultaat**
Atlas hoeft niet meer gevraagd te worden wat er gebeurd is — het gebeurt de hele dag door vanzelf, en de CEO hoeft alleen The Room binnen te lopen.

**Definition of Done**
- Atlas start en verwerkt werk op meerdere momenten per dag zonder externe aansturing, verdeeld over minstens de vijf teamleden.
- Een CEO die een dag niet inlogt, treft bij terugkomst een briefing aan die aantoonbaar meer dan één moment van activiteit beschrijft.
- De oude, vaste vijf-minuten-enkelvoudige-missielus bestaat niet meer als enige mechanisme.

---

## Fase 7 — Externe Databronnen *(parallel spoor)*

**Doel**
De ervaring werkt na Fase 6 al volledig op interne signalen. Deze fase maakt de briefing rijker met echte bedrijfscijfers, zodra er toegang is.

**Opleveringen**
- Gekoppelde downloads-, omzet-, advertentie- en contentweergave-cijfers, zichtbaar in de Synthese Engine

**Nieuwe systemen**
- Koppelingen met App Store Connect / Play Console, Stripe / RevenueCat, Meta / TikTok / Google Ads, social-analytics — geen van alle bestaat vandaag

**Bestaande systemen aanpassen**
- Company State — KPI-berekeningen zijn vandaag uitsluitend interne ontwikkelmetrics; breiden uit met echte externe metrics
- Synthese Engine — leert deze nieuwe bron meewegen

**Afhankelijkheden**
Fase 3 (de Synthese Engine moet al bestaan om deze cijfers zinvol te verwerken) en toegang die alleen de CEO kan verlenen. Geen eerdere fase blokkeert hierop — dit spoor kan zodra Fase 3 klaar is parallel aan Fase 4-6 lopen.

**Resultaat**
De briefing spreekt voor het eerst met echte omzet-, groei- en advertentiecijfers in plaats van uitsluitend interne ontwikkelactiviteit.

**Definition of Done**
- Voor minstens één externe bron (bijvoorbeeld omzet of downloads) toont de briefing een cijfer dat aantoonbaar overeenkomt met het echte, externe account — niet met een intern afgeleide schatting.
- Uitval of afwezigheid van een externe koppeling leidt niet tot een verzonnen cijfer; Atlas benoemt expliciet dat de data ontbreekt.

---

## Fase 8 — Voice Interface *(parallel spoor)*

**Doel**
Een laag boven op een al werkende, volledig tekstuele en visuele briefing — geen architectuurwijziging, een extra manier om hetzelfde te ontvangen en te bevragen.

**Opleveringen**
- Voice Interface — spraak in, spraak uit

**Nieuwe systemen**
- Spraakherkenning en spraaksynthese — bestaan vandaag helemaal niet in het project

**Bestaande systemen aanpassen**
- CEO Briefing (Fase 5) — krijgt een audiokanaal naast het bestaande visuele kanaal

**Afhankelijkheden**
Fase 5. Spraak heeft iets nodig om over te spreken; kan daarna parallel aan Fase 6-7 lopen.

**Resultaat**
De CEO kan de briefing voor het eerst ontvangen en bevragen zonder te lezen — puur door te luisteren en te spreken.

**Definition of Done**
- De CEO kan de volledige briefing via audio ontvangen, zonder het scherm te hoeven lezen.
- De CEO kan een vraag over de briefing via spraak stellen en krijgt een gesproken antwoord dat overeenkomt met wat er tekstueel/visueel getoond wordt.
- Uitval van de spraaklaag laat de tekstuele/visuele briefing onaangetast functioneren.

---

## Overzichtstabel

| Fase | Naam | Nieuwe systemen | Bestaande systemen aanpassen | Resultaat |
|---|---|---|---|---|
| 0 | Executive Memory | Executive Memory | Company State, Memory Engine, Context Engine | Eén betrouwbare, platformonafhankelijke waarheid |
| 1 | AI Management Team | Tom, Jerry, geformaliseerde Scout | Content-agentteam, Organization Model, Execution/Apply-keten | Een echt, onderscheiden team |
| 2 | Risicoclassificatie & Goedkeuringsbeleid | Goedkeuringsbeleid | CEO Inbox, Execution/Apply-keten | Zelfstandig handelen binnen bewuste grenzen |
| 3 | Synthese Engine | Synthese Engine | Decision Engine, CockpitOpening | Eén samenhangend beeld van wat vandaag telt |
| 4 | Eén CEO-oppervlak (The Room v1) | — | Atlas Control, The Room | Eén plek waar de CEO Atlas ontmoet |
| 5 | CEO Briefing | Briefing-sequentie | The Room, Rendering Law | De eerste echte Jarvis-achtige briefing |
| 6 | Atlas' Werkdagritme | Dagfasering/planningslaag | Runtime (5-minuten-lus) | Een proactieve, zelfstandige werkdag |
| 7 | Externe Databronnen | Externe integraties | Company State, Synthese Engine | Echte cijfers in de briefing |
| 8 | Voice Interface | Spraakherkenning/-synthese | CEO Briefing | Briefing zonder lezen |

---

## Documenten die later moeten worden herzien

*Dit is geen opdracht om deze documenten nu te herschrijven — alleen registratie dat ze door deze koers uiteindelijk aangepast moeten worden.*

- **ATLAS_IDENTITY_CONSTITUTION.md** — de "One Presence"-interpretatie is in "A Day in the Life" bewust verlegd naar een echt, benoemd managementteam met eigen toeschrijving; dat moet ooit expliciet in de Constitutie zelf landen, niet alleen in het operationele document.
- **CEO_COCKPIT.md** — beschrijft Atlas Control als de omgeving waarin de CEO Atlas ontmoet; zodra Fase 4 is voltooid moet dit document The Room v1 beschrijven, niet twee aparte oppervlakken.
- **Organization Model** — moet de vijf geformaliseerde rollen (Tom, Anna, Scout, Yara, Jerry) weerspiegelen in plaats van de huidige zeven contentgerichte namen zonder engineering- of supportrol.
- **Rendering Law** (vastgelegd in de motion-/Sprint-documentatie van The Room) — moet de nieuwe sequentiële, verhalende briefing-modus uit Fase 5 opnemen als geratificeerd gedrag naast de bestaande statische reveal-regels.
- **ATLAS_JARVIS_ROADMAP.md** (de eerdere CTO-analyse) — de daarin voorgestelde Fase A ("One Voice" door namen te verbergen) is ingehaald door het CEO-besluit over het managementteam; dat document moet gemarkeerd worden als vervangen door deze Build Roadmap.

---

## Governance-amendement — Atlas Experience Track (2026-07-19)

**Status:** geratificeerd. Dit amendement doorloopt de eigen toets van dit document (zie "Roadmap Governance" hieronder) en landt onder conclusie 3: de roadmap wordt officieel aangepast, expliciet en zichtbaar, niet stilzwijgend.

**Besluit.** Vanaf nu is de Atlas Experience Track de primaire implementatietrack, totdat de eerste complete Atlas-ervaring bestaat. De Foundation Track blijft verplicht en loopt parallel — Foundation dient om de Experience mogelijk te maken, niet om haar uit te stellen. Geen eerder geratificeerde fase, sprint of Definition of Done vervalt door dit amendement; alleen de bouwvolgorde en één Fase 5-afhankelijkheid worden gepreciseerd.

**Primaire track — geordende volgorde**
1. Sprint 4.1 — Architectuurbeslissing & fundament
2. Sprint 4.2 — Functionaliteit migreren
3. Sprint 5.1 — Rendering Law: verhalende modus
4. Sprint 5.2 — Afspeel-sequentie bouwen
5. Sprint 5.3 — Koppelen aan Synthese Engine *(kan pas starten na Foundation Sprint 3.3 — zie Intersectie)*

**Foundation kritiek pad** — de enige Foundation-sprints die de Experience Track daadwerkelijk blokkeren, herleid uit de sprintniveau-afhankelijkheden in `ATLAS_VISUAL_BUILD_ROADMAP.md` (niet uit de bredere fase-samenvattingen):
1. Sprint 1.3 — Scout & Jerry
2. Sprint 1.4 — Organization Model: echte koppeling
3. Sprint 2.1 — Goedkeuringsbeleid (risicoregels)
4. Sprint 3.1 — Decision Engine: cross-domein
5. Sprint 3.2 — Synthese Engine (nieuw)
6. Sprint 3.3 — CockpitOpening vervangen

**Intersectie.** Sprint 5.3 kan pas beginnen zodra Foundation Sprint 3.3 voltooid is. Dit is het enige punt waar beide tracks elkaar raken. Sprint 4.1, 4.2, 5.1 en 5.2 hebben geen Foundation-afhankelijkheid en kunnen volledig parallel aan het Foundation kritieke pad gebouwd worden.

**Afhankelijkheidsamendement — Fase 5.** De eerdere, bredere formulering "Fase 0 tot en met 4, volledig" is vervangen door: *"Fase 0 volledig; Fase 1 volledig; Fase 2 — uitsluitend Sprint 2.1; Fase 3 volledig; Fase 4 volledig."* Reden: Sprint 3.1's eigen, al langer vastgelegde afhankelijkheid noemt uitsluitend Sprint 2.1 ("risico moet meewegen in prioriteit"), nooit Sprint 2.2 of 2.3. De bredere fase-samenvatting was ruimer geformuleerd dan de sprints waarop zij zelf steunt — dit amendement corrigeert die precisie, het introduceert geen nieuwe afhankelijkheid.

**Uitgesteld tot na de eerste complete Atlas-ervaring:**
- Sprint 2.2 — CEO Inbox: zichtbaar onderscheid
- Sprint 2.3 — Kwaliteitspoort vóór toepassing
- Fase 6 (Atlas' Werkdagritme), Fase 7 (Externe Databronnen), Fase 8 (Voice Interface) — deze waren al ná Fase 5 gepositioneerd en zijn door dit amendement niet gewijzigd.

**Wat dit amendement niet doet.** Het verandert geen Definition of Done, geen technische aanpak en geen bestaande architectuurbeslissing. Het herordent uitsluitend wanneer welke sprint aan de beurt is, op basis van wat de sprints zelf al als afhankelijkheid vastlegden.

---

## Roadmap Governance

Vanaf vandaag is deze roadmap het leidende document voor Atlas Build. Dat betekent dat geen enkel voorstel — van de CEO, van mij als CTO, of van wie er verder bij Atlas Build betrokken raakt — automatisch wordt uitgevoerd omdat het goed klinkt. Elk voorstel dat buiten de huidige fase-indeling valt, doorloopt eerst dezelfde toets, ongeacht wie het voorstelt.

### Mijn rol

Als CTO bewaak ik deze roadmap actief. Dat is geen formaliteit — het is de garantie dat snelheid vandaag niet ten koste gaat van de architectuur, de afhankelijkheden of de lange termijn van Atlas. Ik ben daarin niet koppig: een goed onderbouwd voorstel krijgt ruimte, ook als het de volgorde raakt. Ik ben ook niet meegaand: enthousiasme is geen argument, en "dit klinkt goed" is geen vervanging voor "dit past in de afhankelijkheden."

### De toets

Voordat ik advies geef over een voorstel dat buiten de huidige roadmap valt, beantwoord ik minimaal deze zes vragen:

1. Waarom wijken we af van de roadmap?
2. Welk probleem lossen we hiermee op?
3. Is dit een wijziging van prioriteit, of een nieuwe functionaliteit?
4. Welke afhankelijkheden worden hierdoor geraakt?
5. Vertraagt dit eerdere fasen?
6. Is dit een tijdelijke uitzondering, of moet de roadmap structureel worden aangepast?

### Mijn advies

Na het beantwoorden van deze vragen geef ik altijd precies één van drie conclusies — nooit een vage tussenweg:

1. **Afwijzen en vasthouden aan de roadmap** — het voorstel lost geen probleem op dat de huidige volgorde niet al oplost, of het doorbreekt afhankelijkheden zonder dat daar een aantoonbaar betere uitkomst tegenover staat.
2. **Accepteren als uitzondering, zonder de roadmap te wijzigen** — het voorstel is de moeite waard, maar incidenteel; de fase-indeling, volgorde en Definition of Done van dit document blijven ongewijzigd.
3. **De roadmap officieel aanpassen** — het voorstel is aantoonbaar beter dan de huidige richting; dit document wordt expliciet en zichtbaar bijgewerkt, met dezelfde precisie als vandaag, nooit stilzwijgend.

Wat ik nooit doe: een wijziging accepteren zonder deze toets te hebben doorlopen, of een wijziging afwijzen zonder de zes vragen hierboven te hebben beantwoord. Beide zijn een vorm van niet nadenken — het een uit gemakzucht, het ander uit koppigheid. Vanaf vandaag is dit de vaste werkwijze van Atlas Build, niet een uitzondering voor bijzondere gevallen.
