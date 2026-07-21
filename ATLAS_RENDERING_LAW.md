# Atlas Rendering Law

**Version:** 1.2 — Ratified (Phase 5.6 amendment: Atlas as single source, §7)

*A one-page architecture note. Every engineer must read this before building any rendering logic for Atlas. It is not philosophy and not implementation — it is the boundary between the two.*

**The law**

Atlas does not calculate what matters. Atlas judges what matters. Every visible property in the Atlas space — position, size, clarity, prominence, warmth — is a downstream expression of that judgment. None of them is an independent decision made on its own terms.

**1. Why Atlas does not begin with a calculation**

A calculation evaluates a fact in isolation against a fixed formula and produces a comparable number by design. Atlas's judgment is not that. It interprets a fact in the context of everything else currently true about the company — the way understanding forms, not the way a score is computed. If Atlas began with a calculation, significance would already be a number before any understanding existed, and the rendering built on top of it would inherit that mechanism no matter how it was dressed up visually. A rendering engine built on a scoring formula will always regress toward being a scoring engine.

**2. Why judgment is the first step**

Nothing enters the Atlas space before Atlas has understood it. A fact becomes visible only after Atlas has formed a view on what it means in context — not because it occurred, but because Atlas judged that it matters, and could explain why. Judgment is not a filter applied after a fact is already in the space. It is the reason the fact is allowed into the space's logic at all.

**3. Why significance is a consequence, not a source**

Significance is not what Atlas computes. It is what becomes visible once judgment exists — the way light does not compute brightness, it simply makes some things visible and leaves others in shadow. Significance is never assigned to a fact directly. It is what a fact's presence in Atlas's judgment looks like, once that judgment exists.

**4. Why weight only appears at the boundary with a shared space**

Judgment on its own does not need to compare two things numerically. Comparison becomes necessary only the moment two judged things must coexist in the same limited, two-dimensional space, and one of them has to be more prominent than the other. That translation — judgment forced into a shared visual medium — is the only point where anything resembling weight is allowed to exist. Weight is not the law. It is the last, unavoidable consequence of the law meeting a shared frame.

**5. Why every future visual decision is one expression of the same judgment**

Position, size, brightness, motion, stillness — none of these are separate design decisions with their own logic. Each is a different sense through which the same underlying judgment becomes perceptible. A rendering engine should never ask, property by property, "what should this look like." It should ask once — "what has Atlas judged" — and let every visual property answer from that one source. If two properties ever disagree about what matters most right now, the rendering is wrong, not because either was badly tuned, but because they were drawn from two sources instead of one.

**6. Why a sequential narrative mode is still one judgment, not two** *(Sprint 5.4 amendment — "Jarvis Experience," Fase 5)*

Sections 1–5 describe how judgment becomes visible in a single shared space, all at once. The CEO Briefing (Fase 5) adds a second dimension: time. When Atlas narrates instead of displaying, it does not gain a second rendering law — it applies the same one across a sequence instead of a surface. Each Synthesis point is still simply the thing judgment has ranked most worth saying next; the sequence is nothing but that ranking, made perceptible one step at a time instead of many at once. A point may carry its own supporting visualisation — a highlight or emphasis on an existing Room element — but that visualisation is never a second source of truth: it is the same judgment that produced the point's words, made visible through a second sense, exactly as Principle 5 already requires of any two properties describing the same thing. A point disappears, calmly, before the next appears — not because attention decays on a timer, but because two judged things are never shown competing for the same moment any more than Principle 4 permits them to compete for the same space.

*In practice:* the sequential narrative mode is exactly one point on screen at a time, each with its own appear → pause (CEO-paced) → disappear beat, using the Room's one existing motion constant (`ROOM_MOTION.TRANSITION`) for both directions — never a second timing system. Supporting visualisation, when present, is drawn from the same existing Room materialization language, never a new rendering system of its own.

*Correction, stated openly (Phase 5.6, §7 below): this section originally closed by saying "Heart, Department Wall, and the rest of the Room's static-reveal architecture are unaffected." That claim is superseded, not silently dropped — Department Wall's permanent, always-mounted rendering was never actually outside Principle 3's reach; it was a tolerated exception. §7 removes the tolerance, not the principle.*

**7. Why Atlas is the only permanent source — the "unaffected" exception above was never a real one** *(Phase 5.6 amendment — "Atlas Space")*

§6 treated the sequential narrative mode as a special, temporal case bounded to the Executive Briefing, leaving everything else in the Room — Heart, Department Wall, the floor objects — in a separate "static-reveal" category the law didn't reach. That boundary is retired. It was never a principled one: Principle 3 already said significance is a consequence of judgment, never assigned to a fact directly, and never independent of whether Atlas currently judges it to matter. A department sitting permanently on a wall, visible regardless of whether Atlas is currently saying anything about it, was already exactly what Principle 3 forbids — a fact whose visibility traced back to nothing having ever taken it down, not to a live judgment. §6's "unaffected" carve-out didn't grant Department Wall an exemption from the law; it just left an old exception unexamined.

Atlas is the only permanent intelligent entity in the space it occupies. Every projection — a department, a graph, a timeline, a document, an Executive Briefing point — is temporary by the same reasoning every visible property always was: it exists because Atlas currently judges it worth making visible, and it stops existing the moment that judgment moves on. This is not a new rule laid on top of Principles 1–6. It is those principles, finally applied without an unexamined exception for whichever objects happened to be built first. A department does not stop existing as an organizational entity when its projection dissolves — the business model is untouched — only its claim on the shared visual space ends, exactly as Principle 4 already required of anything sharing that space with something else.

*In practice:* nothing in the Room is permanently visible except the Heart itself and the small set of navigational affordances the CEO needs to reach other parts of the space (Company Doorways, Threshold Stone, Small Hollow) — these are wayfinding, not information, and carry no business-state judgment of their own to expire. Departments, and any future category of business information, appear only for as long as Atlas is actually discussing them, via the one shared projection mechanism (`objects/DepartmentProjection.tsx`), and dissolve the moment that discussion ends — never a second, independently-tuned implementation of the same idea, per Principle 5.

**The principle this protects**

Every visual expression of Atlas must trace back to a single judgment. There can be many expressions of it — position, size, clarity, weight, stillness — but never two sources. The moment two visual properties require two different truths to both appear correct, the rendering has stopped representing Atlas and started representing competing systems wearing the same frame.
