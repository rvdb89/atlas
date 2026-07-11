# Architecture Brief — CONTENT-007

## Titel

# CONTENT-007 — Kennisartikelen Technieken vullen

## Mission Metadata

- Mission ID · **CONTENT-007**
- Title · **Kennisartikelen Technieken vullen**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-09T22:28:11.961Z

## Doel

De categorie "technieken" in de Kennisbibliotheek bestaat uit 22 artikelen (handmatig-mengen t/m pizza-bakken-op-steen — mix- en vouwtechnieken, vorm- en bakspecifieke technieken) die vandaag alleen een titel hebben. Dit is de grootste van de zes lege categorieën en wordt als laatste opgepakt. Deze mission wordt uitgevoerd door de echte copywriter/fact-checker/link-engine agent-ploeg (zie scripts/atlas/contentGenerationEngine.ts) in plaats van de generieke code-schrijver.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-007"])
- src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld)
- src/modules/doughbert/knowledge/techniques/index.ts (bestaande lege map, wordt gevuld — categoryId blijft het Nederlandse "technieken", alleen de mapnaam op disk is Engels omdat die al zo was aangemaakt)
- src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array)
- src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen)

## Niet doen

- Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
- 22 losse AI-aanroepen na elkaar — reken op een aanzienlijk langere cyclusduur dan de andere content-missies; overweeg desnoods deze mission in delen te draaien als één cyclus te lang duurt
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
- Implement scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-007"]) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/techniques/index.ts (bestaande lege map, wordt gevuld — categoryId blijft het Nederlandse "technieken", alleen de mapnaam op disk is Engels omdat die al zo was aangemaakt) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/collectSources.ts (krijgt automatisch een import + toevoeging aan de raw-array) using registry-based Atlas patterns.
- Implement src/modules/doughbert/knowledge/bulk/catalogArticles.ts (de engine verwijdert hier automatisch de oude title-only stub-entries voor exact de artikelen die deze keer echte content kregen) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Kennisartikelen Technieken vullen under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver scripts/atlas/contentGenerationEngine.ts (voert deze mission uit — CONTENT_MISSIONS["CONTENT-007"]) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/hydratatie/index.ts (kwaliteitsvoorbeeld) with rule-based local logic
- Deliver src/modules/doughbert/knowledge/techniques/index.ts (bestaande lege map, wordt gevuld — categoryId blijft het Nederlandse "technieken", alleen de mapnaam op disk is Engels omdat die al zo was aangemaakt) with rule-based local logic
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
- Mission CONTENT-007 advances Kennisartikelen Technieken vullen toward Atlas autonomy

## Definition of Done

- [ ] Kennisartikelen Technieken vullen module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Alle 22 artikelen in de technieken-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.
- [ ] Constraint gerespecteerd: Deze mission draait via de content-pipeline (contentGenerationEngine.ts), niet via de generieke mission.implement-flow
- [ ] Constraint gerespecteerd: Alleen artikelen die de publicatiedrempel halen (minimaal 3 echte secties + samenvatting) worden meegenomen; een artikel dat te dun blijft wordt overgeslagen en gerapporteerd
- [ ] Constraint gerespecteerd: 22 losse AI-aanroepen na elkaar — reken op een aanzienlijk langere cyclusduur dan de andere content-missies; overweeg desnoods deze mission in delen te draaien als één cyclus te lang duurt
- [ ] Constraint gerespecteerd: TypeScript blijft compileren zonder nieuwe errors

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert CONTENT-007.md
- npm run atlas:mission CONTENT-007 genereert engineering package
- Mission CONTENT-007 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/CONTENT-007.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor CONTENT-007 gebruiken
- Success criteria: Alle 22 artikelen in de technieken-categorie tonen echte, leesbare content in de Kennisbibliotheek, geschreven door de echte agent-ploeg.

---

_Generated by Atlas Mission Brief Generator · 2026-07-09T22:28:11.962Z_
