# Audit Checklist — STUDIO-002

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **STUDIO-002**
- Title · **Branch Director Debrief Flow**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-06T21:52:01.159Z

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
- [ ] npm run atlas:mission STUDIO-002 regenerates package

## Mission-specific checks

- [ ] Branch Director Debrief Flow module exists under src/atlas/
- [ ] Branch Director Debrief after release completion implemented per mission scope
- [ ] Dutch CEO-facing debrief narrative implemented per mission scope
- [ ] Ja, ga door / Nee, aanpassen decision flow implemented per mission scope
- [ ] Continue to next initiative or propose adjustments implemented per mission scope
- [ ] No terminal-first or raw git language in CEO UI implemented per mission scope
- [ ] Constraint respected: Internal technical terms may remain in services and audit layers
- [ ] Constraint respected: CEO must explicitly choose continue or adjust
- [ ] Constraint respected: Extend STUDIO-001 CEO Workflow — no breaking changes
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission STUDIO-002 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Mission completed successfully.

## Architecture rules

- [ ] ChatGPT (Chief Architect) defines architecture and strategic direction — never manages workers
- [ ] Generic architecture over vertical coupling
- [ ] Provider independence in Brain and core platform layers
- [ ] Atlas core blijft domein-onafhankelijk
- [ ] Registry pattern voor uitbreidbaarheid
- [ ] Geen vertical-specifieke logica in generieke modules
- [ ] TypeScript-first en strict compileerbaar
- [ ] Studio gebruikt registries voor widgets, commands en panels
- [ ] UI panels blijven thin — geen businesslogica duplicatie

## Security standards

- [ ] Geen .env of API keys in source control
- [ ] Geen secrets in logs
- [ ] Provider credentials alleen via environment/config layer
