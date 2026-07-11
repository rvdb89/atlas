# Execution Package — CONTENT-002

> **Branch Director Mission Control** — Humans provide intent or Mission ID. Atlas derives everything from the Constitution.

## Constitution

- **Constitution ID:** ATLAS-000
- **Source of truth:** `engineering/constitution/atlas-constitution.md`
- **North Star alignment:** Review needed (3/10)

- Mission CONTENT-002 is on the Constitution roadmap (62 catalog Knowledge Bite articles across 6 categories are title-only stubs with zero real content — starts with the smallest, best-grounded category (hydratatie, 6 articles) as a small, reviewable first pass rather than one large content dump).
- Evaluated against: Work advances the North Star when it reduces manual steps toward autonomous execution
- Evaluated against: Missions must map to at least one Capability and one System
- North Star: Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.

## Organizational Model

- **Atlas role:** Branch Director (Vestigingsdirecteur)
- **Organization model:** ATLAS-002
- **Departments:** Engineering, Quality Assurance, Operations
- **Workers assigned:** 4
- **Execution Package required:** Yes

Atlas (Branch Director) routes software work to Engineering department. Execution Package will be generated for Claude Engineer execution. ChatGPT defines architecture; Atlas operationalizes execution.

## Evolution Engine

- **Engine ID:** ATLAS-001
- **North Star aligned:** Yes (9/10)
- **Selected mission:** CONTENT-002
- **Recommended Next Initiative:** ATLAS-001

Mijn advies is om Content te verbeteren.
Reden: Content is zeer laag volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Kennisartikelen Hydratatie vullen (CONTENT-002). Mission ID CONTENT-002 provided — evolution assessment confirms alignment. Roadmap context: 62 catalog Knowledge Bite articles across 6 categories are title-only stubs with zero real content — starts with the smallest, best-grounded category (hydratatie, 6 articles) as a small, reviewable first pass rather than one large content dump Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected CONTENT-002 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

### Where are we / where we want to be

- **Today:** Atlas platform maturity averages 75%. Developing: Memory, Context, Planning, Execution, Content. Evolution Engine assesses live capability state — not blind roadmap order.
- **Target:** Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- **Gaps:** Content (70% gap), Memory (25% gap), Planning (22% gap), Context (15% gap), Execution (15% gap), Orchestration (10% gap)
- **Highest value:** Content

### Evolution steps

- **Intent** (pass) — Intent recognized
- **Capability** (pass) — 1 capability(ies) mapped
- **Department(s)** (pass) — 3 department(s) selected
- **Worker Assignment** (pass) — 4 worker(s) assigned
- **Execution Plan** (pass) — 4 step(s) planned
- **Current State** (pass) — 10 platform capabilities assessed
- **North Star** (pass) — North Star alignment confirmed
- **Capability Gaps** (pass) — 6 platform gap(s) identified
- **Recommended Evolution** (pass) — CONTENT-002 · Kennisartikelen Hydratatie vullen
- **Mission Registry** (pass) — CONTENT-002 registered
- **Execution Package** (pass) — Ready to generate

## Input received

```
CONTENT-002
```

No additional instructions from ChatGPT are required or expected.

Humans may express intent (e.g. "better at reasoning"); Atlas maps intent to missions via the Constitution.

## Atlas inference pipeline

```
Constitution
↓
North Star
↓
Principles
↓
Capabilities
↓
Systems
↓
Roadmap
↓
Mission Registry
↓
Execution Packages
↓
Claude
↓
Branch Director Review
```

## Mission (from Registry)

- **Mission ID:** CONTENT-002
- **Title:** Kennisartikelen Hydratatie vullen
- **Registry source:** engineering/missions/CONTENT-002.mission
- **Template:** engineering
- **Atlas:** 0.26.0 (brain-005)
- **Generated:** 2026-07-08T20:03:50.775Z

## Goal

De categorie "hydratatie" in de Kennisbibliotheek bestaat uit 6 artikelen (hydratatie, bakers-percentage, waterabsorptie, hoge-hydratatie, lage-hydratatie, hydratatie-berekenen) die vandaag alleen een titel hebben — geen samenvatting, geen secties. Dit is één van zes lege categorieën (samen 62 artikelen zonder echte inhoud) die de gebruiker letterlijk leeg ziet in de app. Deze mission pakt de kleinste, best onderbouwde categorie als eerste, echte stap: schrijf publish-klare Nederlandse content voor deze 6 artikelen, met dezelfde kwaliteit en structuur als de al voltooide meel-bloem categorie (zie flour/tarwebloem.ts), en baseer je waar mogelijk op al bestaande, echte hydratatie-kennis die al in de repository staat (painDeCampagneKnowledge.hydrationScience, recipe.hydration percentages) in plaats van alles te verzinnen.

## Implementation focus

- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de 6 hydratatie-stubs — vul hier per entry een echt `content: { summary, sections }` veld en zet status op "published" zodra een entry echt gevuld is)
- src/modules/doughbert/knowledge/flour/tarwebloem.ts (kwaliteitsvoorbeeld: een volledig artikel — 8-11 secties via createStandardSection, met een goed geschreven summary — dit is de lat, geen mission om onder te gaan zitten)
- src/modules/doughbert/knowledge/painDeCampagneKnowledge.ts (bevat een echt geschreven hydrationScience-blok — bruikbare, al bestaande feiten over hydratatie, hergebruik deze in plaats van nieuwe cijfers te verzinnen)
- src/modules/doughbert/knowledge/knowledgeBiteContent.ts (createStandardSection, createKnowledgeBiteSection, mergeKnowledgeBiteBody — bestaande helpers, hergebruiken)
- src/modules/doughbert/types/knowledgeBite.ts (KnowledgeBiteSectionId — alleen deze vaste set section-ids gebruiken: what-is-it, properties, comparison, science, when-to-use, when-not-to-use, common-mistakes, doughbert-tip, faq, did-you-know)

## Constraints

- Verzin geen baktechnische claims die nergens in de repository of in gangbare, algemeen bekende bakkennis onderbouwd zijn — bij twijfel liever een sectie weglaten dan een onjuist feit opnemen
- Gebruik alleen de vaste KnowledgeBiteSectionId-waarden, geen nieuwe section-ids verzinnen
- Zet status alleen op "published" voor een entry die ook echt gevulde sections heeft — nooit blind alles wijzigen
- Raak de mock AI Studio en de publicationStore-pipeline niet aan — dat is een apart, bewust ongebruikt systeem
- Klein en gefocust: dit is alleen de "hydratatie"-categorie (6 artikelen) — de andere vijf lege categorieën (bakwetenschap, technieken, starter, fermentatie, temperaturen) zijn expliciet geen onderdeel van deze mission en volgen later als eigen mission
- TypeScript blijft compileren zonder nieuwe errors

## Engineering Standards (inferred)

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Deterministic, rule-based orchestration before AI generation
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star (inferred)

- Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- Atlas interprets natural-language intent and proposes the recommended next initiative
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Execution packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents

## Architecture Rules (inferred)

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

## Mission Dependencies (inferred)

- **CONTENT-001** · Recipe Knowledge Content Wiring · _requires_ — Prior CONTENT mission in sequence

## Definition of Done

- [ ] Kennisartikelen Hydratatie vullen module exists under src/atlas/
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de 6 hydratatie-stubs — vul hier per entry een echt `content: { summary, sections }` veld en zet status op "published" zodra een entry echt gevuld is) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/flour/tarwebloem.ts (kwaliteitsvoorbeeld: een volledig artikel — 8-11 secties via createStandardSection, met een goed geschreven summary — dit is de lat, geen mission om onder te gaan zitten) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/painDeCampagneKnowledge.ts (bevat een echt geschreven hydrationScience-blok — bruikbare, al bestaande feiten over hydratatie, hergebruik deze in plaats van nieuwe cijfers te verzinnen) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/knowledgeBiteContent.ts (createStandardSection, createKnowledgeBiteSection, mergeKnowledgeBiteBody — bestaande helpers, hergebruiken) implemented per mission scope
- [ ] src/modules/doughbert/types/knowledgeBite.ts (KnowledgeBiteSectionId — alleen deze vaste set section-ids gebruiken: what-is-it, properties, comparison, science, when-to-use, when-not-to-use, common-mistakes, doughbert-tip, faq, did-you-know) implemented per mission scope
- [ ] Constraint respected: Verzin geen baktechnische claims die nergens in de repository of in gangbare, algemeen bekende bakkennis onderbouwd zijn — bij twijfel liever een sectie weglaten dan een onjuist feit opnemen
- [ ] Constraint respected: Gebruik alleen de vaste KnowledgeBiteSectionId-waarden, geen nieuwe section-ids verzinnen
- [ ] Constraint respected: Zet status alleen op "published" voor een entry die ook echt gevulde sections heeft — nooit blind alles wijzigen
- [ ] Constraint respected: Raak de mock AI Studio en de publicationStore-pipeline niet aan — dat is een apart, bewust ongebruikt systeem
- [ ] Constraint respected: Klein en gefocust: dit is alleen de "hydratatie"-categorie (6 artikelen) — de andere vijf lege categorieën (bakwetenschap, technieken, starter, fermentatie, temperaturen) zijn expliciet geen onderdeel van deze mission en volgen later als eigen mission
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-002 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Alle 6 artikelen in de hydratatie-categorie tonen echte, leesbare content in de Kennisbibliotheek in plaats van een lege pagina, met een kwaliteitsniveau vergelijkbaar met de meel-bloem categorie.

## Validation Plan

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission CONTENT-002
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for CONTENT-002"
- npm run atlas:mission CONTENT-002

## Commands to run before finishing

```bash
npm run atlas:mission CONTENT-002
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Claude instructions

1. Implement this mission under `src/atlas/` using the focus areas above.
2. Follow all Engineering Standards, Architecture Rules, and Constraints.
3. Respect Mission Dependencies — do not rebuild upstream missions unless required.
4. Do **not** write a new Architecture Brief — Atlas already generated the engineering package.
5. Keep changes small, TypeScript strict, and registry-aligned.
6. Complete the Definition of Done checklist before marking the mission done.
7. Run validation commands and ensure Branch Director Release Decision is APPROVED or APPROVED_WITH_NOTES.
8. Fill in `release-notes.md` after implementation.

## Success criteria

Alle 6 artikelen in de hydratatie-categorie tonen echte, leesbare content in de Kennisbibliotheek in plaats van een lege pagina, met een kwaliteitsniveau vergelijkbaar met de meel-bloem categorie.

---

_Generated by Atlas Mission Orchestrator · 2026-07-08T20:03:50.775Z_
