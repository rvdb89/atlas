# Architecture Brief — ATLAS-000

## Titel

# ATLAS-000 — Atlas Constitution

## Mission Metadata

- Mission ID · **ATLAS-000**
- Title · **Atlas Constitution**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.19.0 (atlas-001)
- Generated · 2026-07-06T20:11:19.079Z

## Doel

Atlas must understand WHY it exists before deciding WHAT to build. The Constitution becomes the highest source of truth — everything else derives from it.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- Constitution module under src/atlas/constitution/
- North Star, principles, capabilities, systems
- Roadmap and mission derivation rules
- Priority and North Star evaluation rules
- Intent resolver for human input
- MissionKnowledge derives from Constitution
- engineering/constitution/atlas-constitution.md artifact

## Niet doen

- No Doughbert logic in Atlas core
- TypeScript compiles clean
- npm run atlas:brief and atlas:mission keep working
- Auditor approves after implementation
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
- Implement Constitution module under src/atlas/constitution/ using registry-based Atlas patterns.
- Implement North Star, principles, capabilities, systems using registry-based Atlas patterns.
- Implement Roadmap and mission derivation rules using registry-based Atlas patterns.
- Implement Priority and North Star evaluation rules using registry-based Atlas patterns.
- Implement Intent resolver for human input using registry-based Atlas patterns.
- Implement MissionKnowledge derives from Constitution using registry-based Atlas patterns.
- Implement engineering/constitution/atlas-constitution.md artifact using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Atlas Constitution under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver Constitution module under src/atlas/constitution/ with rule-based local logic
- Deliver North Star, principles, capabilities, systems with rule-based local logic
- Deliver Roadmap and mission derivation rules with rule-based local logic
- Deliver Priority and North Star evaluation rules with rule-based local logic
- Deliver Intent resolver for human input with rule-based local logic
- Deliver MissionKnowledge derives from Constitution with rule-based local logic
- Deliver engineering/constitution/atlas-constitution.md artifact with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission ATLAS-000 advances Atlas Constitution toward Atlas autonomy

## Definition of Done

- [ ] Atlas Constitution module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Human input evolves from "Build a Decision Engine" to "I want Atlas to become better at reasoning" — Atlas determines the rest from the Constitution.
- [ ] Constraint gerespecteerd: No Doughbert logic in Atlas core
- [ ] Constraint gerespecteerd: TypeScript compiles clean
- [ ] Constraint gerespecteerd: npm run atlas:brief and atlas:mission keep working
- [ ] Constraint gerespecteerd: Auditor approves after implementation

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert ATLAS-000.md
- npm run atlas:mission ATLAS-000 genereert engineering package
- Mission ATLAS-000 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/ATLAS-000.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor ATLAS-000 gebruiken
- Success criteria: Human input evolves from "Build a Decision Engine" to "I want Atlas to become better at reasoning" — Atlas determines the rest from the Constitution.

---

_Generated by Atlas Mission Brief Generator · 2026-07-06T20:11:19.079Z_
