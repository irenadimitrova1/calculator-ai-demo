# Feature doc → issues

How PM-written feature specs become GitHub Issues and shipped code.

## Overview

| Stage | Who | Where |
|-------|-----|--------|
| Product intent | PM / PO | Wiki — `docs/product/features/*.md` |
| Spec + tickets | Engineering | GitHub Issues (via agent skills in Cursor) |
| Code | Engineering | Pull requests linked to issues |

This is **not automated** — there is no GitHub Action. An engineer runs the agent skill chain intentionally in Cursor.

## When a feature doc is ready

Before engineering picks it up, the doc should pass [Definition of Ready](definition-of-ready.md):

- Purpose, Problem, Users, Success metrics, and Scope are filled in
- Out of scope is explicit
- Linked to roadmap or vision where relevant

Use the existing templates under [Features](../product/features/calculator-poc.md) (PoC, v1, v2) as a guide.

## PM step: write the spec

1. Create or edit a page under `docs/product/features/` via the [wiki](../contributing.md) (Edit this page on the live site, or edit in GitHub).
2. For a **new** feature, add a nav entry in [`mkdocs.yml`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/mkdocs.yml).
3. Merge to `main` — the wiki rebuilds automatically.

## Engineering step: the skill chain

Run in **one Cursor session** through ticket creation, then implement per ticket in fresh sessions.

### 1. `/grill-with-docs`

Sharpen the idea against the feature doc. Update `docs/product/features/<name>.md` and `CONTEXT.md` as decisions land. Skip or shorten if the doc is already complete.

### 2. `/to-spec`

Publish **one parent spec issue** on GitHub. The issue links back to the feature doc and adds:

- User stories
- Implementation decisions (modules, seams, architecture)
- Testing decisions

### 3. `/to-tickets`

Split into **tracer-bullet tickets** with blocking edges. Pass the spec issue number (`#N`) or the feature doc path:

```
/to-tickets docs/product/features/calculator-poc.md
```

Review the proposed breakdown (granularity, blockers) before approving. Issues are created on GitHub with `ready-for-agent`.

**Do not** run `/triage` on these tickets — they are already agent-ready.

### 4. `/implement`

Build **one ticket at a time**. Use `/clear` between tickets so each starts with fresh context.

## Context hygiene

Keep `/grill-with-docs` → `/to-spec` → `/to-tickets` in a single context window. Only split after tickets are published.

## Example: calculator features

Work in dependency order:

1. [Calculator PoC](../product/features/calculator-poc.md) — stack + basic arithmetic
2. [Calculator v1](../product/features/calculator-v1.md) — memory, clear, standard UX
3. [Calculator v2](../product/features/calculator-v2.md) — scientific mode

Each gets its own grill → spec → tickets → implement cycle.

## Related

- [How we plan](how-we-plan.md)
- [Definition of Ready](definition-of-ready.md)
- [Contributing to the wiki](../contributing.md)
- [Agent workflow](../agents/workflow.md) — skill-level detail for agents
