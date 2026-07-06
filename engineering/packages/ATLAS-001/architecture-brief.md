# Architecture Brief — ATLAS-001

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 9/10
- Selection rationale · Mission ID ATLAS-001 provided — evolution assessment confirms alignment. Roadmap context: Teach Atlas how to evolve itself by comparing current state to North Star gaps Selected by evolution value score — not static roadmap priority.

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

- Mission ID · **ATLAS-001**
- Title · **Evolution Engine**
- Registry source · engineering/missions/ATLAS-001.mission
- Template · Engineering Mission
- Atlas · 0.20.0 (atlas-001-evolution)
- Generated · 2026-07-06T20:24:45.813Z

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

## Architecture Rules

- ChatGPT must not define missions or write Architecture Briefs
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Registry pattern for extensibility across systems
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

## Mission Dependencies

- **ATLAS-000** · Atlas Constitution · _requires_ — Evolution Engine derives from Constitution

## Definition of Done

- [ ] Evolution Engine module exists under src/atlas/
- [ ] Evolution Engine module under src/atlas/constitution/ implemented per mission scope
- [ ] Current State Registry with capability maturity implemented per mission scope
- [ ] Gap analysis and value-scored evolution recommendations implemented per mission scope
- [ ] Evolution answers: where we are, where we want to be, why next step implemented per mission scope
- [ ] Wire into Mission Orchestrator before package generation implemented per mission scope
- [ ] npm run atlas:evolve CLI implemented per mission scope
- [ ] Constraint respected: Derives from ATLAS-000 Constitution
- [ ] Constraint respected: No Doughbert logic in Atlas core
- [ ] Constraint respected: TypeScript compiles clean
- [ ] Constraint respected: Humans provide intent only — no Architecture Briefs
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ATLAS-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:evolve -- "I want Atlas to become better at planning." determines everything else and generates Engineering Package.

---

## Detailed Architecture Brief

## Titel

# ATLAS-001 — Evolution Engine

## Mission Metadata

- Mission ID · **ATLAS-001**
- Title · **Evolution Engine**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.20.0 (atlas-001-evolution)
- Generated · 2026-07-06T20:24:45.813Z

## Doel

Teach Atlas how to evolve itself. Atlas continuously compares Current State against the North Star, identifies capability gaps, and recommends evolution by value — not blind roadmap order.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- Evolution Engine module under src/atlas/constitution/
- Current State Registry with capability maturity
- Gap analysis and value-scored evolution recommendations
- Evolution answers: where we are, where we want to be, why next step
- Wire into Mission Orchestrator before package generation
- npm run atlas:evolve CLI

## Niet doen

- Derives from ATLAS-000 Constitution
- No Doughbert logic in Atlas core
- TypeScript compiles clean
- Humans provide intent only — no Architecture Briefs
- Geen breaking changes
- Geen ongevraagde refactors
- Geen externe database zonder expliciete opdracht

## Architectuur

### Principes
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

### Mission Architecture
- Implement Evolution Engine module under src/atlas/constitution/ using registry-based Atlas patterns.
- Implement Current State Registry with capability maturity using registry-based Atlas patterns.
- Implement Gap analysis and value-scored evolution recommendations using registry-based Atlas patterns.
- Implement Evolution answers: where we are, where we want to be, why next step using registry-based Atlas patterns.
- Implement Wire into Mission Orchestrator before package generation using registry-based Atlas patterns.
- Implement npm run atlas:evolve CLI using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Evolution Engine under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Evolution Engine module under src/atlas/constitution/ with rule-based local logic
- Deliver Current State Registry with capability maturity with rule-based local logic
- Deliver Gap analysis and value-scored evolution recommendations with rule-based local logic
- Deliver Evolution answers: where we are, where we want to be, why next step with rule-based local logic
- Deliver Wire into Mission Orchestrator before package generation with rule-based local logic
- Deliver npm run atlas:evolve CLI with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission ATLAS-001 advances Evolution Engine toward Atlas autonomy

## Definition of Done

- [ ] Evolution Engine module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] npm run atlas:evolve -- "I want Atlas to become better at planning." determines everything else and generates Engineering Package.
- [ ] Constraint gerespecteerd: Derives from ATLAS-000 Constitution
- [ ] Constraint gerespecteerd: No Doughbert logic in Atlas core
- [ ] Constraint gerespecteerd: TypeScript compiles clean
- [ ] Constraint gerespecteerd: Humans provide intent only — no Architecture Briefs

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert ATLAS-001.md
- npm run atlas:mission ATLAS-001 genereert engineering package
- Mission ATLAS-001 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/ATLAS-001.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor ATLAS-001 gebruiken
- Success criteria: npm run atlas:evolve -- "I want Atlas to become better at planning." determines everything else and generates Engineering Package.

---

_Generated by Atlas Mission Brief Generator · 2026-07-06T20:24:45.813Z_
