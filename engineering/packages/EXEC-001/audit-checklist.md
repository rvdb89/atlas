# Audit Checklist — EXEC-001

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **EXEC-001**
- Title · **Execution Engine**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-08T10:20:35.891Z

## Platform audit gates

- [ ] TypeScript compiles clean (npx tsc --noEmit)
- [ ] Atlas health passes (npm run atlas:health)
- [ ] Atlas audit passes (npm run atlas:audit)
- [ ] Strict audit passes (npm run atlas:audit -- --strict)
- [ ] No blockers in audit report
- [ ] Release decision is APPROVED or APPROVED_WITH_NOTES
- [ ] No .env staged or committed
- [ ] No hardcoded API keys in source
- [ ] No Claude references outside provider layer
- [ ] No Doughbert logic in Atlas brain/core
- [ ] npm run atlas:brief still works (backward compatibility)
- [ ] npm run atlas:mission EXEC-001 regenerates package

## Mission-specific checks

- [ ] Execution Engine module exists under src/atlas/
- [ ] ExecutionEngine module (scripts/atlas/executionEngine.ts) and mission.implement AI task implemented per mission scope
- [ ] Claude drafts a small, focused code proposal from a mission's real architecture brief and validation plan implemented per mission scope
- [ ] Proposed files are written to a review-only proposed-changes/ folder — never the working tree implemented per mission scope
- [ ] Path safety allowlist/denylist so proposals can never touch package.json, .env, node_modules, or escape the repo implemented per mission scope
- [ ] Manual CLI trigger (npm run atlas:execute, entrypoint scripts/atlas-execute.ts) so a human always decides when code gets drafted implemented per mission scope
- [ ] Live repository context gathering, automatic diff application, test execution, and git automation (still missing) implemented per mission scope
- [ ] Constraint respected: No automatic writes to the working tree or git — proposals only, human applies them
- [ ] Constraint respected: No mock code generation — requires a real ANTHROPIC_API_KEY, fails honestly otherwise
- [ ] Constraint respected: Every proposed file path validated against an allowlist before it touches disk
- [ ] Constraint respected: Provider-independent through the existing AI Orchestrator — no Claude-specific coupling in the engine itself
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission EXEC-001 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Running npm run atlas:execute -- <MISSION-ID> for a registered mission produces a real, reviewable code proposal under engineering/packages/<MISSION-ID>/proposed-changes/ with a CHANGES.md summary, and nothing outside that folder changes.

## Architecture rules

- [ ] ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- [ ] Generic architecture over vertical coupling
- [ ] Provider independence in Brain and core platform layers
- [ ] Atlas core blijft domein-onafhankelijk
- [ ] Registry pattern voor uitbreidbaarheid
- [ ] Geen vertical-specifieke logica in generieke modules
- [ ] TypeScript-first en strict compileerbaar
- [ ] CLI tools volgen Atlas script conventies
- [ ] Generated artifacts landen in engineering/ directories

## Security standards

- [ ] Geen .env of API keys in source control
- [ ] Geen secrets in logs
- [ ] Provider credentials alleen via environment/config layer
