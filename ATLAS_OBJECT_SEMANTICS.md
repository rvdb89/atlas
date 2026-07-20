# Atlas Object Semantics

**Version:** 1.0 — Ratified

*A companion to `ATLAS_RENDERING_LAW.md`. The Rendering Law governs how judgment becomes visible. This document governs what an object is — its referent, its one truth, and its boundaries. Every object in The Room must be able to answer all four questions below before it is built. This document is the semantic foundation for every Room object that exists today and every one built after it.*

## The principle: Objects Represent Themselves

Every object in The Room exists because something real exists behind it — a company, a department, a queue of decisions, a capability. An object is never built to fill the Room, to decorate it, or to invite interaction for its own sake. It represents exactly one real thing, and communicates exactly one truth about that thing: how much presence, attention, or condition it currently carries, as Atlas has judged it.

An object is not a UI control. It is not a gesture from Atlas directed at the CEO — Atlas has no location of its own outside the Heart (`ATLAS_VISUAL_PRINCIPLES.md` §2), so no object other than the Heart is ever "Atlas speaking." And an object is not a container for everything that could be said about its referent. The full truth — every detail, every number, every history — lives behind or beyond the object, never crammed into it. The object itself carries only the single judgment that makes it worth noticing right now.

This is the same discipline the Rendering Law already requires of *how* something is expressed, applied here to *what* is being expressed. An object that cannot name its real referent, its one truth, and what it must never say has not yet earned a place in the Room.

---

## Heart

**What it is:** the one fixed point where Atlas's distributed intelligence becomes recognizable and addressable — a point of contact, never a home (`ATLAS_VISUAL_PRINCIPLES.md` §2). It represents Atlas's own presence.

**What it is not:** not a container Atlas lives inside; not the whole of Atlas, which is distributed across every department, agent, decision and memory the company holds; not a status widget; not a report.

**Single truth it communicates:** how present and alive Atlas currently is, drawn from real company condition (`companyState.companyHealth`) — presence, not performance.

**Must never communicate:** a percentage, a score, a chart, power, strength, or urgency. Must never appear weak, damaged, dying, or alarming — a struggling company makes the Heart quieter, never broken.

## Company Doorway (Archway Recess)

**What it is:** a carved threshold representing one specific, real company Atlas oversees — a fixed architectural opening with one variable property, its depth glow.

**What it is not:** not Atlas's invitation to enter (Sprint 13's own ratification: "never a button, never a portal effect"); not the company's full state, which lives behind it in the company's own interior; not a list, a menu, or a card.

**Single truth it communicates:** how much presence that specific company currently carries, as Atlas has judged it — the same relationship Sprint 13 ratified: warmth deepens "as that company carries more presence."

**Must never communicate:** an invitation or call-to-action; the company's metrics, KPIs, or detail; urgency or alarm by default; Atlas's own disposition toward the company.

## Company Interior

**What it is:** the space reached by touching a Company Doorway — the "behind it" the Company Doorway's own definition above already names as where that company's fuller truth lives. Composed entirely of already-ratified elements (the Room's own Heart, the Archway Recess reused as the way back, an ambient warmth field) arranged around that same company's real presence — never a new object, never a new render channel.

**What it is not:** not a dashboard, report, or detail view; not a second, independent judgment about the company — it never computes or holds its own condition value, only carries the one its own Company Doorway already expressed; not a place where a company can appear more or less present than its doorway just showed.

**Single truth it communicates:** the exact same presence value its Company Doorway already expressed, carried through unchanged — never a new number, never a recalculated one.

**Must never communicate:** anything the Company Doorway itself must never communicate (metrics, KPIs, urgency, Atlas's disposition), and additionally: a different condition than the doorway just showed. Two different truths for the same company is always a defect, never a valid state.

## Department Wall

**What it is:** one continuous wall representing the company's departments as a single structure — never separate panels ("de wand breekt nooit op in aparte panelen"). Each department is a fixed Vein with one Warm Vein intensity, coupled to a Grain Shift that never acts as an independent second signal.

**What it is not:** not a grid of department cards; not a KPI table; not a ranked leaderboard.

**Single truth it communicates:** which departments currently carry elevated significance versus calm — the same categorical judgment (`attention`/`critical` vs. everything else) Atlas Control's own operations status already expresses, never a raw score.

**Must never communicate:** department-level metrics, counts, names of specific issues, or a sense of ranking between departments beyond what warmth alone conveys.

## Threshold Stone

**What it is:** a flush floor inlay — a permanent structural seam, plus one warmth intensity — representing CEO Focus: whatever currently deserves the CEO's decision.

**What it is not:** not a notification badge or counter; not the inbox itself, which lives behind it, capped and already judged, never the exhaustive list; not an alert system.

**Single truth it communicates:** whether something currently deserves the CEO's attention, and how urgently — the single highest urgency among whatever is genuinely surfaced right now.

**Must never communicate:** a count of pending items, categories of items, or anything that reads as a badge. At zero, it must read as calm, not as "warmth turned down."

## Small Hollow (AI Tools)

**What it is:** an enclosed volume with a single opening, representing Atlas's available tools and capabilities as one collective object — deliberately never individuated, because nothing today asks any one tool to be distinguished from another (ratified Sprint 12).

**What it is not:** not a toolbar; not an app grid; not a list of individually named tools or icons.

**Single truth it communicates:** today, only that this capability exists and is currently at rest — a placeholder state, honestly presented as one, not yet carrying real signal.

**Must never communicate:** a per-tool list, per-tool icons, or usage metrics. If it ever gains real signal, that signal must still resolve to one collective judgment, never fragment into per-tool detail at the object level — the same discipline every other object already follows.

---

## Before building any new Room object

An object is not ready to be built until it can answer all four:

1. **What real thing does this represent?** It must be a real, existing referent — a company, a department, a real capability, a real decision queue. Never invented to fill space (`ATLAS_VISUAL_PRINCIPLES.md` §1).
2. **What is the one truth, already judged, that deserves to be visible right now?** Exactly one. If two properties would need two different truths to both look correct, the object is wrong, not merely under-tuned (`ATLAS_RENDERING_LAW.md`).
3. **Where does the rest of the truth live, if not here?** Every object's full detail belongs behind or beyond it — in an overlay, a company interior, a destination reached by touching the object — never compressed into the object itself.
4. **What would make this object read as a widget, a dashboard, a button, or a notification — and what, structurally, prevents that?** Not "we will avoid it," but a specific, load-bearing design decision, the way Threshold Stone's cap, Archway Recess's fixed depth, and the Heart's floor each already are.

An object that cannot answer all four does not yet belong in The Room.
