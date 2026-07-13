# Atlas History

Dit document beschrijft uitsluitend de belangrijkste ontwerpbesluiten van Atlas en waarom ze genomen zijn. Geen volledige gespreksgeschiedenis, geen procesdetails — alleen de besluiten die later nodig zijn om te begrijpen waarom Atlas is zoals het is. Details en volledige definitieve teksten staan in de bronnen waarnaar verwezen wordt, met name `ATLAS_SPRINT_LOG.md`.

---

## Waarom Atlas geen dashboard is

Atlas is de operationele intelligentie van het bedrijf zelf, niet een laag die erbovenop ligt en niet het scherm waarin de CEO het bekijkt (`ATLAS_IDENTITY_CONSTITUTION.md`, hoofdstuk 1). Een dashboard rapporteert wat er gebeurde; Atlas oordeelt wat betekenis heeft. Zodra een object in de ruimte een cijfer, score of statuslijn toont, is het een widget geworden en is het gestopt Atlas te zijn (`ATLAS_VISUAL_PRINCIPLES.md`, principe 3). Dit is geen stijlkeuze maar een grens: de Rendering Law bestaat juist om te voorkomen dat de renderlogica alsnog terugvalt op een score-engine (`ATLAS_RENDERING_LAW.md`).

## Waarom The Room is gekozen

In Sprint 3 zijn vijf ruimtelijke manifestaties onderzocht (Radial, Anatomical, Depth, Terrain, Conversational). The Room is gekozen als de manifestatie om op te bouwen omdat het, van de vijf, het meest natuurlijk ondersteunt dat het bedrijf één continue ruimte is rond het hart, zonder dat enig onderdeel op zichzelf als los paneel kan bestaan (`ATLAS_VISUAL_PRINCIPLES.md`, principe 4 en 9). De volledige vergelijking van de vijf manifestaties staat in `ATLAS_SPRINT_LOG.md`.

## Waarom Manifestation C is gekozen

In Sprint 5 zijn drie low-fidelity composities vergeleken (Grounded, Ascendant, Intimate). Manifestation C — "Intimate" is gekozen als referentiecompositie. De naam wijst op wat de doorslag gaf: nabijheid tot het hart als de directe uitdrukking van betekenis, in lijn met het principe dat positie en nabijheid signaleren hoe dicht iets op dit moment bij wat telt staat, niet tot welk systeem het behoort (`ATLAS_VISUAL_PRINCIPLES.md`, principe 4). De volledige vergelijking staat in `ATLAS_SPRINT_LOG.md`.

## Waarom Polished Limestone is gekozen

Binnen de gekozen richting Stone & Ember zijn vijf steenvarianten vergeleken (Raw Quarry, Sea-Worn Stone, Dense Basalt, Warm Sandstone, Polished Limestone). Polished Limestone is geratificeerd als officiële materialisatie (Design Gate, Sprint 5) omdat het, als enige, verfijnd en glad aanvoelt zonder naar de hardheid van Dense Basalt te neigen, en neutraal-warm blijft — de directe vertaling van "premium, not luxurious": bewerkt, maar niet opzichtig. Warm Sandstone is bewaard als referentievariant omdat het de oorspronkelijke Stone & Ember-paring het dichtst benaderde. De overige drie blijven ontwerpgeschiedenis. Volledige tekst in `ATLAS_SPRINT_LOG.md`, Sprint 5.

## Waarom de Rendering Law is ontstaan

De Rendering Law legt vast dat Atlas nooit berekent wat betekenis heeft, maar oordeelt wat betekenis heeft — en dat elke zichtbare eigenschap (positie, grootte, helderheid, nadruk) een afgeleide is van dat ene oordeel, nooit een losse beslissing op zichzelf. Ze is ontstaan om te voorkomen dat een renderingsysteem, ongeacht hoe het visueel is aangekleed, altijd terugvalt naar een scoring-engine zodra het begint met een berekening in plaats van met begrip. Het principe dat ze beschermt: elke zichtbare uitdrukking van Atlas herleidt tot één judgment; zodra twee eigenschappen twee verschillende waarheden nodig hebben om allebei kloppend te lijken, is de rendering fout — niet slecht afgesteld (`ATLAS_RENDERING_LAW.md`).

## Waarom Atlas Build en Atlas Lab zijn gesplitst

Atlas Build (de daadwerkelijke implementatie van Atlas OS, gebonden aan Definition of Done en CEO-goedkeuring) en Atlas Lab (de ontwerpverkenning van hoe Atlas zich toont, gestructureerd in sprints met een eigen reviewmethodiek en design freezes) zijn uit elkaar gehaald zodat exploratief ontwerponderzoek nooit per ongeluk de stabiliteit van wat al gebouwd en goedgekeurd is aantast, en omgekeerd, zodat geleverd werk nooit hoeft te wachten op een nog niet afgeronde ontwerpverkenning. Een uitkomst uit Atlas Lab wordt pas onderdeel van Atlas Build ná een expliciete Design Gate. Vastgelegd op 2026-07-13 als onderdeel van de continuïteitslaag (`ATLAS_BOOTSTRAP.md`).

## Waarom we zijn overgestapt van eindeloos onderzoeken naar iteratief bouwen

Sprint 5 sloot af met een expliciete design freeze: architectuur, objecten, gedrag en materialisatie liggen vast totdat een nieuwe sprint expliciet wordt geopend — geen wijziging meer "en passant" in een gesprek. Sprint 6 voegde daar een vaste reviewmethodiek aan toe (Space → Architecture → Materiality → Constitution → Rendering Law → CEO Test, vóór esthetiek), met als expliciete regel dat een render beoordeeld wordt op of Atlas eerlijker zichtbaar wordt, nooit op of het mooier oogt. Deze twee mechanismen samen — freeze plus vaste volgorde van toetsing — maakten het mogelijk om besluiten daadwerkelijk te laten staan in plaats van ze bij elk volgend gesprek opnieuw open te breken, en zijn de directe voorlopers van de werkafspraak "eerst besluiten, daarna bouwen" en "goed is goed genoeg" in `ATLAS_BOOTSTRAP.md`.

## The Room became executable

Tot dit moment bestond The Room als geratificeerde architectuur en visuele ontwerptaal. Met Prototype 1 werd The Room voor het eerst een werkende React-interface met zichtbare en klikbare objecten. Dit markeert de overgang van ruimtelijk ontwerp naar daadwerkelijke softwareontwikkeling.

---

## Amendementen

Dit document wijzigt alleen met expliciete goedkeuring van de CEO. Nieuwe ontwerpbesluiten worden toegevoegd wanneer ze duurzaam belangrijk blijken; bestaande secties worden niet stilzwijgend herschreven.

- **v1.0** — 2026-07-13 — Eerste versie. Zeven ontwerpbesluiten vastgelegd als onderdeel van de nieuwe continuïteitslaag (samen met `ATLAS_BOOTSTRAP.md` en `ATLAS_STATUS.md`).
- **v1.1** — 2026-07-13 — Eén mijlpaal toegevoegd, expliciet goedgekeurd door de CEO: "The Room became executable" (Prototype 1).
