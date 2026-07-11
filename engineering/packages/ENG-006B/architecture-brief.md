# Architecture Brief — ENG-006B

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 9/10
- Selection rationale · Mijn advies is om Orchestration te verbeteren.
Reden: Orchestration is volwassen volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Evolution Engine (ATLAS-001). Mission ID ENG-006B provided — evolution assessment confirms alignment. Roadmap context: Package becomes primary Claude artifact Selected by evolution value score — not static roadmap priority. North Star alignment score: 7/10. Selected ENG-006B because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

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

- Mission ID · **ENG-006B**
- Title · **Engineering Package Structure**
- Registry source · engineering/missions/ENG-006B.mission
- Template · Engineering Mission
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:19:17.724Z

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

## Architecture Rules

- ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Atlas core blijft domein-onafhankelijk
- Registry pattern voor uitbreidbaarheid
- Geen vertical-specifieke logica in generieke modules
- TypeScript-first en strict compileerbaar
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

## Mission Dependencies

- **ATLAS-000** · Atlas Constitution · _requires_ — Packages derive from Constitution
- **ENG-002** · Mission Brief Generator · _related_ — Brief generator remains backward compatible
- **ENG-006** · Mission Orchestrator · _extends_ — Extends mission orchestrator with package structure

## Definition of Done

- [ ] Engineering Package Structure module exists under src/atlas/
- [ ] Engineering Package folder implemented per mission scope
- [ ] Package manifest implemented per mission scope
- [ ] Claude entrypoint implemented per mission scope
- [ ] Architecture brief inference implemented per mission scope
- [ ] Validation plan implemented per mission scope
- [ ] Audit checklist implemented per mission scope
- [ ] Release notes stub implemented per mission scope
- [ ] Constraint respected: Geen breaking changes
- [ ] Constraint respected: npm run atlas:brief blijft werken
- [ ] Constraint respected: ChatGPT schrijft nooit meer Architecture Briefs
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ENG-006B regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:mission BRAIN-004 levert het volledige Engineering Package zonder extra ChatGPT instructies.

---

## Detailed Architecture Brief

## Titel

# ENG-006B — Engineering Package Structure

## Mission Metadata

- Mission ID · **ENG-006B**
- Title · **Engineering Package Structure**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:19:17.723Z

## Doel

Mission Orchestrator genereert een compleet Engineering Package vanuit alleen een Mission ID.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- Engineering Package folder
- Package manifest
- Claude entrypoint
- Architecture brief inference
- Validation plan
- Audit checklist
- Release notes stub

## Niet doen

- Geen breaking changes
- npm run atlas:brief blijft werken
- ChatGPT schrijft nooit meer Architecture Briefs
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
- Implement Engineering Package folder using registry-based Atlas patterns.
- Implement Package manifest using registry-based Atlas patterns.
- Implement Claude entrypoint using registry-based Atlas patterns.
- Implement Architecture brief inference using registry-based Atlas patterns.
- Implement Validation plan using registry-based Atlas patterns.
- Implement Audit checklist using registry-based Atlas patterns.
- Implement Release notes stub using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Engineering Package Structure under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Engineering Package folder with rule-based local logic
- Deliver Package manifest with rule-based local logic
- Deliver Claude entrypoint with rule-based local logic
- Deliver Architecture brief inference with rule-based local logic
- Deliver Validation plan with rule-based local logic
- Deliver Audit checklist with rule-based local logic
- Deliver Release notes stub with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission ENG-006B advances Engineering Package Structure toward Atlas autonomy

## Definition of Done

- [ ] Engineering Package Structure module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] npm run atlas:mission BRAIN-004 levert het volledige Engineering Package zonder extra ChatGPT instructies.
- [ ] Constraint gerespecteerd: Geen breaking changes
- [ ] Constraint gerespecteerd: npm run atlas:brief blijft werken
- [ ] Constraint gerespecteerd: ChatGPT schrijft nooit meer Architecture Briefs

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert ENG-006B.md
- npm run atlas:mission ENG-006B genereert engineering package
- Mission ENG-006B DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/ENG-006B.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor ENG-006B gebruiken
- Success criteria: npm run atlas:mission BRAIN-004 levert het volledige Engineering Package zonder extra ChatGPT instructies.

---

_Generated by Atlas Mission Brief Generator · 2026-07-10T21:19:17.724Z_
