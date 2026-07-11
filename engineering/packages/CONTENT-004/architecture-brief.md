# Architecture Brief — CONTENT-004

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 0/10
- Selection rationale · Mijn advies is om Content te verbeteren.
Reden: Content is laag volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Atlas Constitution (ATLAS-000). Mission ID CONTENT-004 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 9/10. Selected CONTENT-004 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

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

- Mission ID · **CONTENT-004**
- Title · **Kennisartikelen Fermentatie vullen**
- Registry source · engineering/missions/CONTENT-004.mission
- Template · Engineering Mission
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-09T20:30:54.273Z

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

- **CONTENT-001** · Recipe Knowledge Content Wiring · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-002** · Kennisartikelen Hydratatie vullen · _requires_ — Prior CONTENT mission in sequence
- **CONTENT-003** · Kennisartikelen Temperaturen vullen · _requires_ — Prior CONTENT mission in sequence

## Definition of Done

- [ ] Kennisartikelen Fermentatie vullen module exists under src/atlas/
- [ ] scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-004"]) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/fermentatie/index.ts (nieuw bestand, wordt aangemaakt) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) implemented per mission scope
- [ ] src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen) implemented per mission scope
- [ ] Constraint respected: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint respected: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
- [ ] Constraint respected: TypeScript blijft compileren zonder nieuwe errors
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission CONTENT-004 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Alle 7 artikelen in de fermentatie-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.

---

## Detailed Architecture Brief

## Titel

# CONTENT-004 — Kennisartikelen Fermentatie vullen

## Mission Metadata

- Mission ID · **CONTENT-004**
- Title · **Kennisartikelen Fermentatie vullen**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-09T20:30:54.273Z

## Doel

De categorie "fermentatie" in de Kennisbibliotheek bestaat uit 7 artikelen (bulkfermentatie, narijs, cold-proof, warm-fermenteren, overproof, underproof, fermentatieschemas) die vandaag alleen een titel hebben. Deze mission wordt uitgevoerd door de echte copywriter/fact-checker/link-engine agent-ploeg (zie scripts/atlas/contentGenerationEngine.ts) in plaats van de generieke code-schrijver, en schrijft alle 7 artikelen, elk via een eigen AI-call, op hetzelfde kwaliteitsniveau als de al voltooide hydratatie- en temperaturen-categorieën.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-004"])
- src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld)
- src/modules/doughbert/knowledge/fermentatie/index.ts (nieuw bestand, wordt aangemaakt)
- src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array)
- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen)

## Niet doen

- Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
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
- CLI tools volgen Atlas script conventies
- Generated artifacts landen in engineering/ directories

### Mission Architecture
- Implement scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-004"]) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/fermentatie/index.ts (nieuw bestand, wordt aangemaakt) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Kennisartikelen Fermentatie vullen under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-004"]) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/fermentatie/index.ts (nieuw bestand, wordt aangemaakt) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer
- Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission CONTENT-004 advances Kennisartikelen Fermentatie vullen toward Atlas autonomy

## Definition of Done

- [ ] Kennisartikelen Fermentatie vullen module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Alle 7 artikelen in de fermentatie-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.
- [ ] Constraint gerespecteerd: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint gerespecteerd: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
- [ ] Constraint gerespecteerd: TypeScript blijft compileren zonder nieuwe errors

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert CONTENT-004.md
- npm run atlas:mission CONTENT-004 genereert engineering package
- Mission CONTENT-004 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/CONTENT-004.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor CONTENT-004 gebruiken
- Success criteria: Alle 7 artikelen in de fermentatie-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.

---

_Generated by Atlas Mission Brief Generator · 2026-07-09T20:30:54.273Z_
