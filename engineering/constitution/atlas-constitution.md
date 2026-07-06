# Atlas Constitution

> **ATLAS-000** · Constitution v1.0.0 · Highest source of truth for Atlas

## Hierarchy

```
Constitution
↓
North Star
↓
Principles
↓
Capabilities
↓
Systems
↓
Roadmap
↓
Mission Registry
↓
Engineering Packages
↓
Claude
↓
Atlas Auditor
```

## Why Atlas Exists

Atlas exists to translate human intent into autonomous execution. Humans express what they want; Atlas determines how to build, validate, and release platform capability without requiring humans to author architecture briefs, missions, or engineering instructions.

## North Star

Atlas becomes an AI Operating System that translates human intent into autonomous execution — with less manual intervention per workflow and more trustworthy release decisions.

## Principles

- Constitution is the highest source of truth — everything else derives from it
- Humans define intent; Atlas defines missions, roadmap, and engineering packages
- ChatGPT must not define missions or write Architecture Briefs
- Generic architecture over vertical coupling
- Provider independence in Brain and core platform layers
- Deterministic, rule-based orchestration before AI generation
- Registry pattern for extensibility across systems
- Small focused changes with TypeScript strictness
- Atlas Auditor validates whether work advances the North Star
- Release decisions follow blockers — warnings inform, never block alone

## Long-term Vision

- Atlas interprets natural-language intent and proposes the next mission
- Roadmap self-updates from Constitution, audit findings, and capability gaps
- Brain layers (planner, memory, context, decision) operate as one autonomy stack
- Engineering packages are generated without external brief writing
- Studio surfaces Constitution alignment, roadmap, and release readiness
- Vertical modules plug into Atlas without polluting generic core
- Atlas learns from audit history to prioritize North Star progress

## Capabilities

- **Reasoning** (reasoning) — Decision-making, policies, and autonomous judgment
- **Memory** (memory) — Persistent knowledge of workflows, projects, and preferences
- **Context** (context) — Situational awareness for planning and execution
- **Planning** (planning) — Goal decomposition and execution queues
- **Orchestration** (orchestration) — Mission pipeline from intent to engineering package
- **Self-review** (audit) — Atlas Auditor and release decision engine
- **Engineering** (engineering) — Brief generation, packages, and platform tooling
- **Studio** (studio) — Mission Control, Command Center, and operator UX

## Systems

- **Atlas Brain** (brain) — Planner, memory, context, and decision layers for autonomy
  - Evolution: Extend with new brain modules via registry; never embed vertical or provider logic
- **Engineering Orchestrator** (engineering) — Mission registry, inference pipeline, and engineering packages
  - Evolution: Add missions to registry; packages derive from Constitution hierarchy
- **Atlas Auditor** (auditor) — Rule-based self-review, scoring, and release decisions
  - Evolution: Expand rules without bypassing Constitution principles
- **Atlas Studio** (studio) — Operator interface for status, health, and mission visibility
  - Evolution: Thin panels reading from Constitution-backed services
- **AI Orchestrator** (ai) — Provider abstraction and task routing for execution agents
  - Evolution: New providers via adapter layer only

## How Systems Evolve

- New systems require a Constitution amendment or roadmap entry before implementation
- Systems evolve through registered missions — not ad-hoc features
- Breaking changes require explicit Constitution principle review
- Retired systems remain documented in roadmap history
- Capability gaps trigger roadmap proposals — not immediate code changes

## How Missions Are Derived

- Missions derive from Roadmap items linked to Systems and Capabilities
- Mission Registry stores mission cards — humans do not author full briefs
- npm run atlas:mission <ID> generates Engineering Packages from Registry + Constitution
- Intent input maps to capabilities first, then roadmap, then mission ID
- Every mission passes through the Decision Framework before Engineering Package generation
- ATLAS-000 Constitution must exist before downstream missions are prioritized

## How Atlas Decides Priorities

- Constitution and platform integrity outrank feature velocity
- Missions that unblock autonomy (Brain, Orchestrator, Auditor) rank higher
- Security blockers override all other priorities
- Roadmap priority number determines default sequencing
- Auditor warnings become follow-up missions — not release blockers

## How Atlas Evaluates North Star Progress

- Work advances the North Star when it reduces manual steps toward autonomous execution
- Missions must map to at least one Capability and one System
- Generic architecture preservation is required for North Star credit
- Vertical-only convenience without platform reuse does not advance the North Star
- Atlas Auditor release decision confirms North Star alignment at merge time

## Decision Framework

> **ATLAS-001** · Decision Framework v1.0.0

The Constitution defines who Atlas is. The Decision Framework defines how Atlas makes decisions.

### Decision hierarchy

```
Intent
↓
North Star
↓
Principles
↓
Capabilities
↓
Systems
↓
Roadmap
↓
Mission Registry
↓
Engineering Package
```

### Decision rules

- Every mission must pass through the Decision Framework before an Engineering Package is generated
- Intent is interpreted before any mission ID is accepted
- North Star alignment is evaluated before roadmap selection
- Capabilities map to Systems before Missions are chosen
- Atlas must explain WHY a mission was selected
- The next best mission is recommended after the primary selection
- Mission Registry must contain the selected mission before package generation
- Humans provide intent — Atlas derives missions, packages, and validation

## Roadmap

- **ATLAS-000** · Atlas Constitution (P0) — Define why Atlas exists before deciding what to build
- **ATLAS-001** · Decision Framework (P1) — Teach Atlas how to think before deciding what to build
- **BRAIN-001** · Planner Engine (P5) — Planning capability enables goal decomposition and execution queues
- **BRAIN-002** · Memory Engine (P10) — Persistent memory enables contextual autonomy
- **BRAIN-003** · Context Engine (P20) — Context awareness feeds planning and decisions
- **BRAIN-004** · Decision Engine (P30) — Reasoning and decision policies advance autonomy
- **ENG-002** · Mission Brief Generator (P40) — Rule-based brief generation from mission cards
- **ENG-006B** · Engineering Package Structure (P50) — Package becomes primary Claude artifact

---

_Generated from Atlas Constitution module · 2026-07-06T00:00:00.000Z_
