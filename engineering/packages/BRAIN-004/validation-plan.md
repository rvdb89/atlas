# Validation Plan — BRAIN-004

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **BRAIN-004**
- Title · **Decision Engine**
- Atlas · 0.23.0 (brain-004)
- Generated · 2026-07-06T21:13:13.454Z

## Required commands

```bash
npm run atlas:mission BRAIN-004
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-004
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for BRAIN-004"
- npm run atlas:mission BRAIN-004

## Expected outcome

- npm run atlas:decide -- "I want Atlas to improve decision making." recommends BRAIN-004 and explains WHY.
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
