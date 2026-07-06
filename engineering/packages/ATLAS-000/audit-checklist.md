# Audit Checklist — ATLAS-000

> Inferred by Atlas from Mission ID and platform audit rules.

- Mission · **ATLAS-000**
- Title · **Atlas Constitution**
- Atlas · 0.19.0 (atlas-001)
- Generated · 2026-07-06T20:11:19.079Z

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
- [ ] npm run atlas:mission ATLAS-000 regenerates package

## Mission-specific checks

- [ ] Atlas Constitution module exists under src/atlas/
- [ ] Constitution module under src/atlas/constitution/ implemented per mission scope
- [ ] North Star, principles, capabilities, systems implemented per mission scope
- [ ] Roadmap and mission derivation rules implemented per mission scope
- [ ] Priority and North Star evaluation rules implemented per mission scope
- [ ] Intent resolver for human input implemented per mission scope
- [ ] MissionKnowledge derives from Constitution implemented per mission scope
- [ ] engineering/constitution/atlas-constitution.md artifact implemented per mission scope
- [ ] Constraint respected: No Doughbert logic in Atlas core
- [ ] Constraint respected: TypeScript compiles clean
- [ ] Constraint respected: npm run atlas:brief and atlas:mission keep working
- [ ] Constraint respected: Auditor approves after implementation
- [ ] TypeScript compiles clean
- [ ] npm run atlas:mission ATLAS-000 regenerates package
- [ ] npm run atlas:audit -- --strict returns APPROVED or APPROVED_WITH_NOTES
- [ ] Human input evolves from "Build a Decision Engine" to "I want Atlas to become better at reasoning" — Atlas determines the rest from the Constitution.

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
