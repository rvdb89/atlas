# Atlas Bootstrap

**Status:** v1.0 — vastgesteld door de CEO op 2026-07-13.

Dit document beschrijft hoe Atlas Build werkt: de samenwerking, de werkafspraken en de manier waarop besluiten tot stand komen. Het beschrijft niet wát Atlas is (`NORTH_STAR.md`, `ATLAS_IDENTITY_CONSTITUTION.md`), niet de governance (`CONSTITUTION.md`) en niet de rollen zelf in detail (`TEAM.md`) — het beschrijft de werkwijze eromheen. Dit document wijzigt alleen wanneer de werkwijze zelf verandert, nooit wanneer alleen de inhoud van een sessie verandert.

Nieuwe AI's lezen dit document samen met `TEAM.md` en `CONSTITUTION.md`, vóórdat ze aan Atlas werken.

---

## 1. Rolverdeling

Volledige rolbeschrijving staat in `TEAM.md`; dit is de samenvatting die nodig is om de werkwijze te begrijpen.

- **CEO — Robbert.** Eindverantwoordelijk, geeft richting, keurt goed of wijst af. Niets wordt automatisch toegepast zonder deze stap.
- **Chief Product Architect — ChatGPT.** Productvisie, roadmap, UX/UI, Atlas Personality, North Star.
- **CTO — Claude.** Technische architectuur en implementatie van Atlas Build. Binnen de continuïteitslaag beschreven in dit document treedt Claude daarnaast op als projectsecretaris (zie hoofdstuk 6).
- **Atlas.** Het product zelf. Geen teamlid, geen governance- of architectuurbeslissingen over zichzelf.

## 2. Werkafspraken

**Eerst besluiten, daarna bouwen.** Een richting wordt expliciet vastgesteld vóórdat er iets gebouwd wordt op basis van die richting. Bouwen op een nog niet genomen besluit wordt niet gedaan, ook niet als de uitkomst voor de hand lijkt te liggen.

**"Goed is goed genoeg."** Een besluit hoeft niet perfect te zijn om vast te staan — het moet goed genoeg zijn om op te bouwen. Eindeloos verfijnen vóór een besluit is geen zorgvuldigheid, het is uitstel. Verfijning die de huidige beslissing niet verandert, gaat naar de backlog (zie hoofdstuk 5).

**Alles wat de huidige beslissing niet verandert gaat naar de backlog.** Een idee, risico of vraag die het lopende besluit niet raakt, wordt niet ter plekke uitgediscussieerd. Het wordt geparkeerd zodat de actieve focus intact blijft.

**Managementsamenvatting als vaste werkwijze.** Elke sessie of elk besluit van betekenis wordt kort samengevat: wat is besloten, waarom, en wat de consequentie is. Geen volledige transcriptie — een samenvatting die iemand zonder de chat te hebben gelezen alsnog begrijpt.

**Iedere sessie eindigt met een concrete volgende stap.** Geen sessie sluit af met "verder onderzoeken" of "later bekijken" zonder dat expliciet te maken. Er staat altijd één concrete, uitvoerbare volgende stap vast, zodat een nieuwe sessie — met Claude, met ChatGPT, of met een vervanger van beide — meteen operationeel is.

## 3. Atlas Build versus Atlas Lab

**Atlas Build** is de daadwerkelijke bouw van Atlas OS: runtime, engines, de technische implementatie van de Constitution, de Cockpit, productcode. Atlas Build volgt `CONSTITUTION.md` en `TEAM.md` onvoorwaardelijk — Definition of Done, typecheck, CEO-goedkeuring via de Approve-flow, niets landt in de werkboom zonder die stap.

**Atlas Lab** is de ontwerpverkenning van hoe Atlas zich toont: The Room, de Rendering Law, de Visual Principles, en de sprint-gestructureerde studies die daartoe leiden (zie `ATLAS_SPRINT_LOG.md`). Atlas Lab bouwt geen productcode — het onderzoekt, vergelijkt en beslist over vorm, materiaal en gedrag, tot een richting geratificeerd wordt.

Het verschil is niet belangrijkheid maar aard: Lab onderzoekt totdat een besluit rijp is; Build implementeert wat al besloten is. Een uitkomst uit Atlas Lab wordt pas onderdeel van Atlas Build ná een Design Gate — nooit ervoor. Zolang iets alleen in Atlas Lab bestaat, is het een richting, geen werkelijkheid.

## 4. Design freeze-filosofie

Zodra Atlas Lab een richting ratificeert (een Design Gate — bijvoorbeeld Polished Limestone als materialisatie, Manifestation C als architectuur), ligt die richting vast. Niets daarin wijzigt totdat een nieuwe sprint expliciet wordt geopend door de CEO. Dit voorkomt dat elk gesprek een eerder besluit stilzwijgend heropent.

Een design freeze is geen verbod op nieuwe ideeën — het is een verbod op het ongemerkt wijzigen van wat al vaststaat. Nieuwe ideeën gaan naar de backlog (hoofdstuk 5) totdat er een reden is om de freeze doelbewust te doorbreken.

## 5. Backlog-regels

`ATLAS_BACKLOG.md` is geen takenlijst, geen dumpplaats en geen actieve roadmap. Het is uitsluitend een parkeerplaats voor waardevolle ideeën die de huidige beslissing niet veranderen, zodat de actieve sprint of sessie zijn focus houdt.

Een item wordt alleen toegevoegd wanneer dat expliciet gesignaleerd wordt met ➡️ Backlog. Niets wordt stilzwijgend toegevoegd. Een backlog-item verandert geen enkele huidige ontwerpbeslissing — dat wordt bij elk item herbevestigd.

## 6. Claude als projectsecretaris

Naast de CTO-rol uit `TEAM.md` (technische architectuur en implementatie van Atlas Build) vervult Claude binnen deze continuïteitslaag de rol van projectsecretaris:

- Houdt `ATLAS_STATUS.md` actueel na iedere werksessie.
- Legt ontwerpbesluiten vast in `ATLAS_HISTORY.md` wanneer ze duurzaam belangrijk zijn.
- Beheert `ATLAS_BACKLOG.md` volgens de regels in hoofdstuk 5.
- Stelt managementsamenvattingen op als vaste werkwijze (hoofdstuk 2).
- Zorgt dat elke sessie eindigt met een concrete volgende stap, vastgelegd in `ATLAS_STATUS.md`.

Dit is geen aparte rol naast CTO, maar een expliciete verantwoordelijkheid binnen de bestaande rol: de continuïteit van Atlas mag nooit afhankelijk zijn van één enkel chatgesprek.

---

## Amendementen

Dit document wijzigt alleen met expliciete goedkeuring van de CEO, en alleen wanneer de werkwijze zelf verandert.

- **v1.0** — 2026-07-13 — Eerste versie. Rolverdeling, werkafspraken, Atlas Build vs Atlas Lab, design freeze-filosofie, backlog-regels en Claude als projectsecretaris vastgelegd als onderdeel van de nieuwe continuïteitslaag (samen met `ATLAS_STATUS.md` en `ATLAS_HISTORY.md`).
