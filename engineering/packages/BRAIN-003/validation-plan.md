# Validation Plan — BRAIN-003

> Inferred by Atlas from Mission ID — no ChatGPT validation instructions required.

- Mission · **BRAIN-003**
- Title · **Context Engine**
- Atlas · 0.26.0 (brain-005)
- Generated · 2026-07-08T07:42:33.385Z

## Required commands

```bash
npm run atlas:mission BRAIN-003
npm run atlas:audit
npm run atlas:audit -- --strict
npx tsc --noEmit
npm run atlas:health
```

## Validation checks

- npx tsc --noEmit
- npm run atlas:health
- npm run atlas:audit
- npm run atlas:mission BRAIN-003
- Bestaande workflows blijven intact
- npm run atlas:constitution
- npm run atlas:decide -- "intent for BRAIN-003"
- npm run atlas:mission BRAIN-003

## Expected outcome

- The Decision Engine's reasoning references context health (empty/partial/healthy) and relevant known entities or knowledge when deciding what to prioritize next.
- Existing Atlas workflows remain intact
- TypeScript compiles without errors
- Release decision allows push (APPROVED or APPROVED_WITH_NOTES)
