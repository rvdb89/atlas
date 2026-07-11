# Architecture Brief — TIPS-001

> Inferred by Atlas from Mission ID and Constitution. ChatGPT does not write this document.

### Decision Framework

- Constitution · **ATLAS-000**
- Evolution Engine · **ATLAS-001**
- North Star score · 0/10
- Selection rationale · Mijn advies is om Content te verbeteren.
Reden: Content is ontwikkelend volwassen, maar cruciaal voor autonomie.
Aanbevolen initiatief: Atlas Constitution (ATLAS-000). Mission ID TIPS-001 provided — evolution assessment confirms alignment. Selected by evolution value score — not static roadmap priority. North Star alignment score: 7/10. Selected TIPS-001 because it closes the highest-value capability gap (priority 10.00). Departments: Engineering (primary), Quality Assurance (supporting), Operations (supporting).

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

- Mission ID · **TIPS-001**
- Title · **Tips uitbreiden — 14 nieuwe baktips**
- Registry source · engineering/missions/TIPS-001.mission
- Template · Engineering Mission
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:11:35.458Z

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

_No upstream mission dependencies inferred._

## Definition of Done

- [ ] Tips uitbreiden — 14 nieuwe baktips module exists under src/atlas/
- [ ] scripts/atlas/tipsGenerationEngine.ts (nieuw — TIP_MISSIONS["TIPS-001"], runTipsGenerationEngine) implemented per mission scope
- [ ] src/atlas/ai/types/index.ts (nieuw taaktype "tips.write" toegevoegd aan AtlasTaskType) implemented per mission scope
- [ ] src/atlas/ai/tasks/routes.ts (route voor tips.write — copywriter, klein maxTokens-budget, geen zware pipeline) implemented per mission scope
- [ ] src/atlas/ai/providers/provider-config.ts (TASK_PROVIDER_CONFIG + CLAUDE_LIVE_TASKS-entry voor tips.write — dit is de tabel die daadwerkelijk wordt toegepast, niet routes.ts alleen, zie de knowledge.write-toelichting in hetzelfde bestand) implemented per mission scope
- [ ] src/atlas/ai/providers/ClaudeProvider.ts (tips.write toegevoegd aan de live-Claude-taken van de echte provider) implemented per mission scope
- [ ] src/atlas/ai/prompts/tips/index.ts (nieuw — tips.write.v1 prompt, gericht op één zin, 40-160 tekens, geen herhaling van bestaande tips) implemented per mission scope
- [ ] src/atlas/ai/prompts/library.ts (registreert TIPS_PROMPTS + tips.write in TASK_PROMPT_IDS) implemented per mission scope
- [ ] src/modules/doughbert/tips/tips.ts (doelbestand — alleen aanvullen, nooit bestaande tips overschrijven) implemented per mission scope
- [ ] scripts/atlas-runtime.ts (dispatch: isTipsMission(missionId) routeert naar runTipsGenerationEngine, naast de bestaande content- en generieke-executie-branch) implemented per mission scope
- [ ] Constraint respected: De bestaande 31 tips in tips.ts worden woordelijk bewaard — deterministische serialisatie, geen AI-herschrijving van het hele bestand
- [ ] Constraint respected: Nieuwe tips die inhoudelijk overlappen met een bestaande tip (exacte of bijna-exacte tekst) worden stil overgeslagen, niet toegevoegd als duplicaat
- [ ] Constraint respected: Eén gebundelde AI-aanroep per categorie (niet per tip) om het aantal aanroepen laag te houden
- [ ] Constraint respected: Draait via dezelfde CEO Inbox/Apply Engine-flow als elke andere missie — geen enkele tip wordt automatisch toegepast zonder goedkeuring
- [ ] Constraint respected: Wordt niet meteen getriggerd zolang CONTENT-010 nog in de wachtrij/uitvoering staat — deze missie staat klaar voor de eerstvolgende vrije cyclus, niet gedwongen ertussendoor
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission TIPS-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] 14 nieuwe, unieke, publiceerbare tips liggen klaar als reviewbaar voorstel in de CEO Inbox, verdeeld over alle 7 bestaande categorieën, zonder dat er ook maar één bestaande tip is aangeraakt.

---

## Detailed Architecture Brief

## Titel

# TIPS-001 — Tips uitbreiden — 14 nieuwe baktips

## Mission Metadata

- Mission ID · **TIPS-001**
- Title · **Tips uitbreiden — 14 nieuwe baktips**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:11:35.457Z

## Doel

Content-capability's grootste openstaande gat is voor het grootste deel al onderweg (CONTENT-010), maar tips.ts bleef daarbij buiten beeld: 31 losse, korte baktips over 7 categorieën, laatst uitgebreid toen de app werd opgezet. Dit is een bewust apart, kleiner vervolg — tips zijn een heel andere, veel simpelere databron dan de KnowledgeBite-artikelen (één zin, geen secties, geen bronnen, geen links), dus dit gebruikt een eigen, lichte generatie-engine (tipsGenerationEngine.ts) in plaats van de zware copywriter/fact-checker/link-engine-pipeline die daar overkill voor zou zijn. Deze eerste missie voegt 2 nieuwe tips toe aan elk van de 7 bestaande categorieën (14 in totaal) — de bestaande 31 tips blijven volledig ongewijzigd.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- scripts/atlas/tipsGenerationEngine.ts (nieuw — TIP_MISSIONS["TIPS-001"], runTipsGenerationEngine)
- src/atlas/ai/types/index.ts (nieuw taaktype "tips.write" toegevoegd aan AtlasTaskType)
- src/atlas/ai/tasks/routes.ts (route voor tips.write — copywriter, klein maxTokens-budget, geen zware pipeline)
- src/atlas/ai/providers/provider-config.ts (TASK_PROVIDER_CONFIG + CLAUDE_LIVE_TASKS-entry voor tips.write — dit is de tabel die daadwerkelijk wordt toegepast, niet routes.ts alleen, zie de knowledge.write-toelichting in hetzelfde bestand)
- src/atlas/ai/providers/ClaudeProvider.ts (tips.write toegevoegd aan de live-Claude-taken van de echte provider)
- src/atlas/ai/prompts/tips/index.ts (nieuw — tips.write.v1 prompt, gericht op één zin, 40-160 tekens, geen herhaling van bestaande tips)
- src/atlas/ai/prompts/library.ts (registreert TIPS_PROMPTS + tips.write in TASK_PROMPT_IDS)
- src/modules/doughbert/tips/tips.ts (doelbestand — alleen aanvullen, nooit bestaande tips overschrijven)
- scripts/atlas-runtime.ts (dispatch: isTipsMission(missionId) routeert naar runTipsGenerationEngine, naast de bestaande content- en generieke-executie-branch)

## Niet doen

- De bestaande 31 tips in tips.ts worden woordelijk bewaard — deterministische serialisatie, geen AI-herschrijving van het hele bestand
- Nieuwe tips die inhoudelijk overlappen met een bestaande tip (exacte of bijna-exacte tekst) worden stil overgeslagen, niet toegevoegd als duplicaat
- Eén gebundelde AI-aanroep per categorie (niet per tip) om het aantal aanroepen laag te houden
- Draait via dezelfde CEO Inbox/Apply Engine-flow als elke andere missie — geen enkele tip wordt automatisch toegepast zonder goedkeuring
- Wordt niet meteen getriggerd zolang CONTENT-010 nog in de wachtrij/uitvoering staat — deze missie staat klaar voor de eerstvolgende vrije cyclus, niet gedwongen ertussendoor
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
- Implement scripts/atlas/tipsGenerationEngine.ts (nieuw — TIP_MISSIONS["TIPS-001"], runTipsGenerationEngine) using registry-based Atlas patterns.
- Implement src/atlas/ai/types/index.ts (nieuw taaktype "tips.write" toegevoegd aan AtlasTaskType) using registry-based Atlas patterns.
- Implement src/atlas/ai/tasks/routes.ts (route voor tips.write — copywriter, klein maxTokens-budget, geen zware pipeline) using registry-based Atlas patterns.
- Implement src/atlas/ai/providers/provider-config.ts (TASK_PROVIDER_CONFIG + CLAUDE_LIVE_TASKS-entry voor tips.write — dit is de tabel die daadwerkelijk wordt toegepast, niet routes.ts alleen, zie de knowledge.write-toelichting in hetzelfde bestand) using registry-based Atlas patterns.
- Implement src/atlas/ai/providers/ClaudeProvider.ts (tips.write toegevoegd aan de live-Claude-taken van de echte provider) using registry-based Atlas patterns.
- Implement src/atlas/ai/prompts/tips/index.ts (nieuw — tips.write.v1 prompt, gericht op één zin, 40-160 tekens, geen herhaling van bestaande tips) using registry-based Atlas patterns.
- Implement src/atlas/ai/prompts/library.ts (registreert TIPS_PROMPTS + tips.write in TASK_PROMPT_IDS) using registry-based Atlas patterns.
- Implement src/modules/doughbert/tips/tips.ts (doelbestand — alleen aanvullen, nooit bestaande tips overschrijven) using registry-based Atlas patterns.
- Implement scripts/atlas-runtime.ts (dispatch: isTipsMission(missionId) routeert naar runTipsGenerationEngine, naast de bestaande content- en generieke-executie-branch) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Tips uitbreiden — 14 nieuwe baktips under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver scripts/atlas/tipsGenerationEngine.ts (nieuw — TIP_MISSIONS["TIPS-001"], runTipsGenerationEngine) with rule-based local logic
- Deliver src/atlas/ai/types/index.ts (nieuw taaktype "tips.write" toegevoegd aan AtlasTaskType) with rule-based local logic
- Deliver src/atlas/ai/tasks/routes.ts (route voor tips.write — copywriter, klein maxTokens-budget, geen zware pipeline) with rule-based local logic
- Deliver src/atlas/ai/providers/provider-config.ts (TASK_PROVIDER_CONFIG + CLAUDE_LIVE_TASKS-entry voor tips.write — dit is de tabel die daadwerkelijk wordt toegepast, niet routes.ts alleen, zie de knowledge.write-toelichting in hetzelfde bestand) with rule-based local logic
- Deliver src/atlas/ai/providers/ClaudeProvider.ts (tips.write toegevoegd aan de live-Claude-taken van de echte provider) with rule-based local logic
- Deliver src/atlas/ai/prompts/tips/index.ts (nieuw — tips.write.v1 prompt, gericht op één zin, 40-160 tekens, geen herhaling van bestaande tips) with rule-based local logic
- Deliver src/atlas/ai/prompts/library.ts (registreert TIPS_PROMPTS + tips.write in TASK_PROMPT_IDS) with rule-based local logic
- Deliver src/modules/doughbert/tips/tips.ts (doelbestand — alleen aanvullen, nooit bestaande tips overschrijven) with rule-based local logic
- Deliver scripts/atlas-runtime.ts (dispatch: isTipsMission(missionId) routeert naar runTipsGenerationEngine, naast de bestaande content- en generieke-executie-branch) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission TIPS-001 advances Tips uitbreiden — 14 nieuwe baktips toward Atlas autonomy

## Definition of Done

- [ ] Tips uitbreiden — 14 nieuwe baktips module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] 14 nieuwe, unieke, publiceerbare tips liggen klaar als reviewbaar voorstel in de CEO Inbox, verdeeld over alle 7 bestaande categorieën, zonder dat er ook maar één bestaande tip is aangeraakt.
- [ ] Constraint gerespecteerd: De bestaande 31 tips in tips.ts worden woordelijk bewaard — deterministische serialisatie, geen AI-herschrijving van het hele bestand
- [ ] Constraint gerespecteerd: Nieuwe tips die inhoudelijk overlappen met een bestaande tip (exacte of bijna-exacte tekst) worden stil overgeslagen, niet toegevoegd als duplicaat
- [ ] Constraint gerespecteerd: Eén gebundelde AI-aanroep per categorie (niet per tip) om het aantal aanroepen laag te houden
- [ ] Constraint gerespecteerd: Draait via dezelfde CEO Inbox/Apply Engine-flow als elke andere missie — geen enkele tip wordt automatisch toegepast zonder goedkeuring
- [ ] Constraint gerespecteerd: Wordt niet meteen getriggerd zolang CONTENT-010 nog in de wachtrij/uitvoering staat — deze missie staat klaar voor de eerstvolgende vrije cyclus, niet gedwongen ertussendoor

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert TIPS-001.md
- npm run atlas:mission TIPS-001 genereert engineering package
- Mission TIPS-001 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/TIPS-001.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor TIPS-001 gebruiken
- Success criteria: 14 nieuwe, unieke, publiceerbare tips liggen klaar als reviewbaar voorstel in de CEO Inbox, verdeeld over alle 7 bestaande categorieën, zonder dat er ook maar één bestaande tip is aangeraakt.

---

_Generated by Atlas Mission Brief Generator · 2026-07-10T21:11:35.458Z_
