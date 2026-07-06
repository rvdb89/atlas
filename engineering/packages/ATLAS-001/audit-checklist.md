# Audit Checklist — ATLAS-001

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **ATLAS-001**
- Title · **Evolution Engine**
- Atlas · 0.20.0 (atlas-001-evolution)
- Generated · 2026-07-06T20:24:45.813Z

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
- [ ] npm run atlas:mission ATLAS-001 regenerates package

## Mission-specific checks

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

## Architecture rules

- [ ] ChatGPT must not define missions or write Architecture Briefs
- [ ] Generic architecture over vertical coupling
- [ ] Provider independence in Brain and core platform layers
- [ ] Registry pattern for extensibility across systems
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
