# Audit Checklist — ENG-006B

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **ENG-006B**
- Title · **Engineering Package Structure**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-10T21:19:17.724Z

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
- [ ] npm run atlas:mission ENG-006B regenerates package

## Mission-specific checks

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
