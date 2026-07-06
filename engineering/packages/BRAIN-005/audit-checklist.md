# Audit Checklist — BRAIN-005

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **BRAIN-005**
- Title · **Capability Registry & Roadmap Intelligence**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-06T22:21:18.035Z

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
- [ ] npm run atlas:mission BRAIN-005 regenerates package

## Mission-specific checks

- [ ] Capability Registry & Roadmap Intelligence module exists under src/atlas/
- [ ] Capability Registry with maturity, gaps, systems, initiatives, and strategic value implemented per mission scope
- [ ] Roadmap Intelligence answering where we are weak and what to build next implemented per mission scope
- [ ] Decision Engine integration with Branch Director Dutch advice implemented per mission scope
- [ ] Atlas Studio capability scores for CEO visibility implemented per mission scope
- [ ] Constraint respected: No new meta-frameworks — extend Brain registry pattern
- [ ] Constraint respected: Build on Constitution capabilities and Current State Registry
- [ ] Constraint respected: CEO-facing output uses Branch Director language, not git or CLI terms
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission BRAIN-005 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Atlas answers "Where are we weak?", "What should we build next?", and "Why is this the best next step?"

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
