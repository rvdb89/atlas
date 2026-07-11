# Architecture Brief — BRAIN-007

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 6/10
- Selection rationale · Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID BRAIN-007 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 7/10. Selected BRAIN-007 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

## Atlas Inference Pipeline

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

## Mission Metadata

- Mission ID · **BRAIN-007**
- Title · **Kennis-catalogus in Context Engine verbreden**
- Registry source · engineering/missions/BRAIN-007.mission
- Template · Brain Mission
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:25:22.986Z

## Engineering Standards

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Deterministic, rule-based orchestration before AI generation
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star

- Atlas becomes the AI Operating System that translates human intent into autonomous execution — routing work to the correct department, coordinating AI Workers, and generating Execution Packages only when software work is required.
- Atlas interprets natural-language intent and proposes the recommended next initiative
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Execution packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution

## Architecture Rules

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

## Mission Dependencies

- **BRAIN-001** · Planner Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-002** · Memory Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-003** · Context Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-004** · Decision Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-005** · Capability Registry & Roadmap Intelligence · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-006** · Geheugen delen tussen backend en dashboard · _requires_ — Prior BRAIN mission in sequence

## Definition of Done

- [ ] Kennis-catalogus in Context Engine verbreden module exists under src/atlas/
- [ ] src/atlas/brain/context/ContextBuilder.ts (collectKnowledgeContext() — haalt nu de echte catalogus op via tryGetActiveModule().getArticleCatalog(), filtert stub-only artikelen eruit, rangschikt op onderwerp-relevantie) implemented per mission scope
- [ ] src/atlas/publishing/plugin/registry.ts (tryGetActiveModule — bestaande, module-onafhankelijke abstractie, al gebruikt door studioService.ts) implemented per mission scope
- [ ] src/modules/doughbert/plugin.ts (getArticleCatalog() — bestaande implementatie, ongewijzigd) implemented per mission scope
- [ ] src/atlas/brain/context/ContextSnapshot.ts (deriveContextHealth() gelezen ter verificatie — kennis bleek geen onderdeel van de health-berekening te zijn; alleen de documentatie hierover was onjuist, niet de code) implemented per mission scope
- [ ] Constraint respected: Geen directe import van doughbert-specifieke bestanden in de Context Engine — alleen via de bestaande module-abstractie (tryGetActiveModule), zodat de Context Engine module-onafhankelijk blijft
- [ ] Constraint respected: Alleen artikelen met echte inhoud (samenvatting of minstens één sectie) worden meegenomen — nooit een titel-only stub, zelfde regel als hasRealKnowledgeContent elders in de codebase
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-007 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Context-snapshots die de Decision Engine voedt bevatten nu echte, onderwerp-relevante kennis uit de gepubliceerde artikelcatalogus in plaats van drie vaste, betekenisloze placeholder-strings.

---

## Detailed Architecture Brief

## Titel

# BRAIN-007 — Kennis-catalogus in Context Engine verbreden

## Mission Metadata

- Mission ID · **BRAIN-007**
- Title · **Kennis-catalogus in Context Engine verbreden**
- Template · Brain Mission
- Phase · PHASE 2 — ATLAS BRAIN
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:25:22.985Z

## Doel

ContextBuilder.ts's collectKnowledgeContext() injecteerde tot nu toe 3 hardgecodeerde placeholder-ids ("entity-catalog", "intelligence-insights", "publishing-templates", zonder echte inhoud) in élke context-snapshot, ongeacht het onderwerp. Deze mission vervangt dat door de echte, gepubliceerde artikel-catalogus.

## Scope

Atlas Brain capabilities: planning, memory, context, decision en agents.

### Focus
- src/atlas/brain/context/ContextBuilder.ts (collectKnowledgeContext() — haalt nu de echte catalogus op via tryGetActiveModule().getArticleCatalog(), filtert stub-only artikelen eruit, rangschikt op onderwerp-relevantie)
- src/atlas/publishing/plugin/registry.ts (tryGetActiveModule — bestaande, module-onafhankelijke abstractie, al gebruikt door studioService.ts)
- src/modules/doughbert/plugin.ts (getArticleCatalog() — bestaande implementatie, ongewijzigd)
- src/atlas/brain/context/ContextSnapshot.ts (deriveContextHealth() gelezen ter verificatie — kennis bleek geen onderdeel van de health-berekening te zijn; alleen de documentatie hierover was onjuist, niet de code)

## Niet doen

- Geen directe import van doughbert-specifieke bestanden in de Context Engine — alleen via de bestaande module-abstractie (tryGetActiveModule), zodat de Context Engine module-onafhankelijk blijft
- Alleen artikelen met echte inhoud (samenvatting of minstens één sectie) worden meegenomen — nooit een titel-only stub, zelfde regel als hasRealKnowledgeContent elders in de codebase
- TypeScript blijft compileren zonder nieuwe errors
- Geen breaking changes
- Geen ongevraagde refactors
- Geen externe database zonder expliciete opdracht

## Architectuur

### Principes
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

### Mission Architecture
- Implement src/atlas/brain/context/ContextBuilder.ts (collectKnowledgeContext() — haalt nu de echte catalogus op via tryGetActiveModule().getArticleCatalog(), filtert stub-only artikelen eruit, rangschikt op onderwerp-relevantie) using registry-based Atlas patterns.
- Implement src/atlas/publishing/plugin/registry.ts (tryGetActiveModule — bestaande, module-onafhankelijke abstractie, al gebruikt door studioService.ts) using registry-based Atlas patterns.
- Implement src/modules/doughbert/plugin.ts (getArticleCatalog() — bestaande implementatie, ongewijzigd) using registry-based Atlas patterns.
- Implement src/atlas/brain/context/ContextSnapshot.ts (deriveContextHealth() gelezen ter verificatie — kennis bleek geen onderdeel van de health-berekening te zijn; alleen de documentatie hierover was onjuist, niet de code) using registry-based Atlas patterns.

## Technische eisen

- Clean TypeScript zonder placeholders
- Exports via index.ts barrels
- Bootstrap chain blijft intact
- Implement Kennis-catalogus in Context Engine verbreden under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver src/atlas/brain/context/ContextBuilder.ts (collectKnowledgeContext() — haalt nu de echte catalogus op via tryGetActiveModule().getArticleCatalog(), filtert stub-only artikelen eruit, rangschikt op onderwerp-relevantie) with rule-based local logic
- Deliver src/atlas/publishing/plugin/registry.ts (tryGetActiveModule — bestaande, module-onafhankelijke abstractie, al gebruikt door studioService.ts) with rule-based local logic
- Deliver src/modules/doughbert/plugin.ts (getArticleCatalog() — bestaande implementatie, ongewijzigd) with rule-based local logic
- Deliver src/atlas/brain/context/ContextSnapshot.ts (deriveContextHealth() gelezen ter verificatie — kennis bleek geen onderdeel van de health-berekening te zijn; alleen de documentatie hierover was onjuist, niet de code) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer
- Alleen artikelen met echte inhoud (samenvatting of minstens één sectie) worden meegenomen — nooit een titel-only stub, zelfde regel als hasRealKnowledgeContent elders in de codebase

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution
- Mission BRAIN-007 advances Kennis-catalogus in Context Engine verbreden toward Atlas autonomy

## Definition of Done

- [ ] Kennis-catalogus in Context Engine verbreden module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Context-snapshots die de Decision Engine voedt bevatten nu echte, onderwerp-relevante kennis uit de gepubliceerde artikelcatalogus in plaats van drie vaste, betekenisloze placeholder-strings.
- [ ] Constraint gerespecteerd: Geen directe import van doughbert-specifieke bestanden in de Context Engine — alleen via de bestaande module-abstractie (tryGetActiveModule), zodat de Context Engine module-onafhankelijk blijft
- [ ] Constraint gerespecteerd: Alleen artikelen met echte inhoud (samenvatting of minstens één sectie) worden meegenomen — nooit een titel-only stub, zelfde regel als hasRealKnowledgeContent elders in de codebase
- [ ] Constraint gerespecteerd: TypeScript blijft compileren zonder nieuwe errors

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert BRAIN-007.md
- npm run atlas:mission BRAIN-007 genereert engineering package
- Mission BRAIN-007 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/BRAIN-007.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor BRAIN-007 gebruiken
- Success criteria: Context-snapshots die de Decision Engine voedt bevatten nu echte, onderwerp-relevante kennis uit de gepubliceerde artikelcatalogus in plaats van drie vaste, betekenisloze placeholder-strings.

---

_Generated by Atlas Mission Brief Generator · 2026-07-10T21:25:22.986Z_
