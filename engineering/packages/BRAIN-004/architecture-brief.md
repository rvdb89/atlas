# Architecture Brief — BRAIN-004

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 9/10
- Selection rationale · Mission ID BRAIN-004 provided — evolution assessment confirms alignment. Roadmap context: Reasoning and decision policies advance autonomy Selected by evolution value score — not static roadmap priority.

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
Engineering Packages
↓
Claude
↓
Atlas Auditor
```

## Mission Metadata

- Mission ID · **BRAIN-004**
- Title · **Decision Engine**
- Registry source · engineering/missions/BRAIN-004.mission
- Template · Brain Mission
- Atlas · 0.20.0 (atlas-001-evolution)
- Generated · 2026-07-06T20:24:45.623Z

## Engineering Standards

- All engineering knowledge derives from the Atlas Constitution
- Humans provide intent or Mission ID — not Architecture Briefs
- ChatGPT must not define missions or write Architecture Briefs
- Deterministic, rule-based orchestration before AI generation
- Small focused changes with TypeScript strictness
- Atlas Auditor validates whether work advances the North Star
- Release decisions follow blockers — warnings inform, never block alone
- Mission packages generated via npm run atlas:mission
- Legacy brief output remains backward compatible only

## North Star

- Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.
- Atlas interprets natural-language intent and proposes the next mission
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Engineering packages are generated without external brief writing
- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution

## Architecture Rules

- ChatGPT must not define missions or write Architecture Briefs
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Registry pattern for extensibility across systems
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- Brain modules blijven provider-onafhankelijk
- Geen Claude- of Doughbert-logica in brain core

## Mission Dependencies

- **ATLAS-000** · Atlas Constitution · _requires_ — Constitution is the highest source of truth
- **BRAIN-001** · Planner Engine · _requires_ — Prior BRAIN mission in sequence
- **BRAIN-002** · Memory Engine · _requires_ — Memory engine supplies decision history
- **BRAIN-003** · Context Engine · _requires_ — Context engine informs decision inputs

## Definition of Done

- [ ] Decision Engine module exists under src/atlas/
- [ ] Decision Engine implemented per mission scope
- [ ] Decision Policies implemented per mission scope
- [ ] Decision Registry implemented per mission scope
- [ ] Constraint respected: Geen breaking changes
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-004 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Decision Engine volledig operationeel.

---

## Detailed Architecture Brief

## Titel

# BRAIN-004 — Decision Engine

## Mission Metadata

- Mission ID · **BRAIN-004**
- Title · **Decision Engine**
- Template · Brain Mission
- Phase · PHASE 2 — ATLAS BRAIN
- Atlas Version · 0.20.0 (atlas-001-evolution)
- Generated · 2026-07-06T20:24:45.622Z

## Doel

Atlas leert beslissingen nemen.

## Scope

Atlas Brain capabilities: planning, memory, context, decision en agents.

### Focus
- Decision Engine
- Decision Policies
- Decision Registry

## Niet doen

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
- Implement Decision Engine using registry-based Atlas patterns.
- Implement Decision Policies using registry-based Atlas patterns.
- Implement Decision Registry using registry-based Atlas patterns.

## Technische eisen

- Clean TypeScript zonder placeholders
- Exports via index.ts barrels
- Bootstrap chain blijft intact
- Implement Decision Engine under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Decision Engine with rule-based local logic
- Deliver Decision Policies with rule-based local logic
- Deliver Decision Registry with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Autonome besluitvorming via Decision Engine
- Context-aware execution
- Mission BRAIN-004 advances Decision Engine toward Atlas autonomy

## Definition of Done

- [ ] Decision Engine module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Decision Engine volledig operationeel.
- [ ] Constraint gerespecteerd: Geen breaking changes

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert BRAIN-004.md
- npm run atlas:mission BRAIN-004 genereert engineering package
- Mission BRAIN-004 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/BRAIN-004.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor BRAIN-004 gebruiken
- Success criteria: Decision Engine volledig operationeel.

---

_Generated by Atlas Mission Brief Generator · 2026-07-06T20:24:45.622Z_
