# Audit Checklist — BRAIN-004

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **BRAIN-004**
- Title · **Decision Engine**
- Atlas · 0.23.0 (brain-004)
- Generated · 2026-07-06T21:13:13.454Z

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
- [ ] npm run atlas:mission BRAIN-004 regenerates package

## Mission-specific checks

- [ ] Decision Engine module exists under src/atlas/
- [ ] Decision Engine composing Constitution, capabilities, Organization, and Roadmap implemented per mission scope
- [ ] Decision Policies and Decision Registry implemented per mission scope
- [ ] Reasoning layer explaining every recommended initiative implemented per mission scope
- [ ] Execution Package trigger when engineering is required implemented per mission scope
- [ ] Constraint respected: No breaking changes to Evolution Engine or Organizational Model APIs
- [ ] Constraint respected: Provider-independent Brain module under src/atlas/brain/decision/
- [ ] Constraint respected: Every future initiative originates from the Decision Engine
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-004 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] npm run atlas:decide -- "I want Atlas to improve decision making." recommends BRAIN-004 and explains WHY.

## Architecture rules

- [ ] ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- [ ] Generic architecture over vertical coupling
- [ ] Provider independence in Brain and core platform layers
- [ ] Atlas core blijft domein-onafhankelijk
- [ ] Registry pattern voor uitbreidbaarheid
- [ ] Geen vertical-specifieke logica in generieke modules
- [ ] TypeScript-first en strict compileerbaar
- [ ] Brain modules blijven provider-onafhankelijk
- [ ] Geen Claude- of Doughbert-logica in brain core

## Security standards

- [ ] Geen .env of API keys in source control
- [ ] Geen secrets in logs
- [ ] Provider credentials alleen via environment/config layer
