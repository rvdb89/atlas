# Architecture Brief — EXEC-001

## Titel

# EXEC-001 — Execution Engine

## Mission Metadata

- Mission ID · **EXEC-001**
- Title · **Execution Engine**
- Template · Engineering Mission
- Phase · PHASE 2 — ATLAS ENGINEERING
- Atlas Version · 0.26.0 (brain-005)
- Generated · 2026-07-08T10:20:35.890Z

## Doel

Close the loop from "Atlas generated an engineering package" to "there is real code" — the missing link toward Atlas autonomously building a new app on command.

## Scope

Platform engineering, tooling, CLI en developer experience.

### Focus
- ExecutionEngine module (scripts/atlas/executionEngine.ts) and mission.implement AI task
- Claude drafts a small, focused code proposal from a mission's real architecture brief and validation plan
- Proposed files are written to a review-only proposed-changes/ folder — never the working tree
- Path safety allowlist/denylist so proposals can never touch package.json, .env, node_modules, or escape the repo
- Manual CLI trigger (npm run atlas:execute, entrypoint scripts/atlas-execute.ts) so a human always decides when code gets drafted
- Live repository context gathering, automatic diff application, test execution, and git automation (still missing)

## Niet doen

- No automatic writes to the working tree or git — proposals only, human applies them
- No mock code generation — requires a real ANTHROPIC_API_KEY, fails honestly otherwise
- Every proposed file path validated against an allowlist before it touches disk
- Provider-independent through the existing AI Orchestrator — no Claude-specific coupling in the engine itself
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
- Implement ExecutionEngine module (scripts/atlas/executionEngine.ts) and mission.implement AI task using registry-based Atlas patterns.
- Implement Claude drafts a small, focused code proposal from a mission's real architecture brief and validation plan using registry-based Atlas patterns.
- Implement Proposed files are written to a review-only proposed-changes/ folder — never the working tree using registry-based Atlas patterns.
- Implement Path safety allowlist/denylist so proposals can never touch package.json, .env, node_modules, or escape the repo using registry-based Atlas patterns.
- Implement Manual CLI trigger (npm run atlas:execute, entrypoint scripts/atlas-execute.ts) so a human always decides when code gets drafted using registry-based Atlas patterns.
- Implement Live repository context gathering, automatic diff application, test execution, and git automation (still missing) using registry-based Atlas patterns.

## Technische eisen

- npm scripts voor alle CLI entrypoints
- Rule-based generation zonder AI dependency
- Studio integratie via summary JSON
- Implement Execution Engine under src/atlas/ with index.ts exports
- Integrate with Atlas bootstrap without breaking existing modules
- Deliver ExecutionEngine module (scripts/atlas/executionEngine.ts) and mission.implement AI task with rule-based local logic
- Deliver Claude drafts a small, focused code proposal from a mission's real architecture brief and validation plan with rule-based local logic
- Deliver Proposed files are written to a review-only proposed-changes/ folder — never the working tree with rule-based local logic
- Deliver Path safety allowlist/denylist so proposals can never touch package.json, .env, node_modules, or escape the repo with rule-based local logic
- Deliver Manual CLI trigger (npm run atlas:execute, entrypoint scripts/atlas-execute.ts) so a human always decides when code gets drafted with rule-based local logic
- Deliver Live repository context gathering, automatic diff application, test execution, and git automation (still missing) with rule-based local logic

## Security

- Geen .env of API keys in source control
- Geen secrets in logs
- Provider credentials alleen via environment/config layer
- No mock code generation — requires a real ANTHROPIC_API_KEY, fails honestly otherwise

## North Star

- Atlas als AI Operating System
- Generieke architectuur boven vertical coupling
- Meer autonomie, minder handmatige tussenkomst
- Uitbreidbare planning, memory, context en agents
- Mission EXEC-001 advances Execution Engine toward Atlas autonomy

## Definition of Done

- [ ] Execution Engine module bestaat onder src/atlas/
- [ ] Mission Card parser werkt
- [ ] Brief templates zijn geregistreerd
- [ ] Markdown generator produceert volledige brief
- [ ] npm run atlas:brief werkt
- [ ] Generated brief wordt opgeslagen in engineering/briefs/
- [ ] Command Center toont laatste gegenereerde brief
- [ ] TypeScript compileert clean
- [ ] Running npm run atlas:execute -- <MISSION-ID> for a registered mission produces a real, reviewable code proposal under engineering/packages/<MISSION-ID>/proposed-changes/ with a CHANGES.md summary, and nothing outside that folder changes.
- [ ] Constraint gerespecteerd: No automatic writes to the working tree or git — proposals only, human applies them
- [ ] Constraint gerespecteerd: No mock code generation — requires a real ANTHROPIC_API_KEY, fails honestly otherwise
- [ ] Constraint gerespecteerd: Every proposed file path validated against an allowlist before it touches disk
- [ ] Constraint gerespecteerd: Provider-independent through the existing AI Orchestrator — no Claude-specific coupling in the engine itself

## Validatie

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission <MISSION_ID>
- Bestaande workflows blijven intact
- npm run atlas:brief genereert EXEC-001.md
- npm run atlas:mission EXEC-001 genereert engineering package
- Mission EXEC-001 DoD volledig afvinkbaar

## Rapportage

- Lijst van nieuwe en gewijzigde bestanden
- Architectuur uitleg
- Definition of Done status
- Open items voor volgende sprint
- Generated brief path: engineering/briefs/EXEC-001.md
- Atlas Auditor cross-check via npm run atlas:audit
- Mission Generator status zichtbaar in Command Center

## Claude Output Requirements

- ChatGPT levert alleen een Mission ID (bijv. BRAIN-004)
- ChatGPT schrijft nooit Architecture Briefs
- Atlas inferreert Engineering Standards, North Star, Architecture Rules, Dependencies, DoD en Validation
- Atlas genereert het Engineering Package via npm run atlas:mission
- Claude ontvangt alleen claude-engineering-package.md
- Rapportage na sprint via Atlas Auditor
- Mission card format voor EXEC-001 gebruiken
- Success criteria: Running npm run atlas:execute -- <MISSION-ID> for a registered mission produces a real, reviewable code proposal under engineering/packages/<MISSION-ID>/proposed-changes/ with a CHANGES.md summary, and nothing outside that folder changes.

---

_Generated by Atlas Mission Brief Generator · 2026-07-08T10:20:35.891Z_
