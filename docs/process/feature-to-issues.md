# Feature doc → issues

How PM-written feature specs become GitHub Issues and shipped code.

## Overview

| Stage | Who | Where |
|-------|-----|--------|
| Product intent | PM / PO | Wiki — `docs/product/features/*.md` (sections above `## Engineering specification`) |
| Engineering spec | Engineering | Same file — `## Engineering specification` (via `/grill-with-docs`) |
| Spec + tickets | Engineering | GitHub Issues (via agent skills in Cursor) |
| Code | Engineering | Pull requests linked to issues |

This is **not automated** — there is no GitHub Action. An engineer runs the agent skill chain intentionally in Cursor.

## When a feature doc is ready

Before engineering picks it up, the doc should pass [Definition of Ready](definition-of-ready.md):

- Purpose, Problem, Users, Success metrics, and Scope are filled in
- Out of scope is explicit
- Linked to roadmap or vision where relevant

Use [TEMPLATE.md](../product/features/TEMPLATE.md) for new features, or the existing calculator docs (PoC, v1, v2) as examples.

## PM step: write the spec

1. Create or edit a page under `docs/product/features/` via the [wiki](../contributing.md) (Edit this page on the live site, or edit in GitHub).
2. For a **new** feature, add a nav entry in [`mkdocs.yml`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/mkdocs.yml).
3. Merge to `main` — the wiki rebuilds automatically.

## Engineering step: the skill chain

Run in **one Cursor session** through ticket creation, then **plan → build → pr** per ticket in separate sessions (optional `/verify` after post-Build edits).

### 1. `/grill-with-docs`

Sharpen the idea against the PM sections of the feature doc. **Do not edit PM/PO content.** Append or update `## Engineering specification` at the bottom of the same file, plus `CONTEXT.md` and ADRs as decisions land. Skip or shorten if the PM doc is already complete.

`/to-spec` and `/to-tickets` read **only** `## Engineering specification` from the feature doc when generating issues.

### 2. `/to-spec`

Publish **one parent spec issue** on GitHub with the **`story`** label (umbrella — not directly implementable). The issue links back to the feature doc and synthesizes from `## Engineering specification` (plus `CONTEXT.md`, ADRs, and codebase exploration):

- User stories
- Implementation decisions (modules, seams, architecture)
- Testing decisions

Do **not** apply `ready-for-agent` to the parent issue.

### 3. `/to-tickets`

Split into **tracer-bullet tickets** with blocking edges. Pass the spec issue number (`#N`) or the feature doc path:

```
/to-tickets docs/product/features/calculator-poc.md
```

Review the proposed breakdown (granularity, blockers) before approving. Child issues are created on GitHub with **`ready-for-agent`** only.

**Do not** run `/triage` on these tickets — they are already agent-ready.

### 4. `/plan` → Build → `/pr` (per child ticket)

For each **`ready-for-agent`** child ticket:

1. **`/plan #N`** — branch from `main`, assign you, `ready-for-agent` → `in-progress`; Plan mode + grill-me; Cursor plan. **No commit.**
2. **Build** — execute the plan on the feature branch; **automatically run verify checklist** at the end (lint, tests, Storybook, docs). **No commit.**
3. **`/verify #N`** *(optional)* — re-validate after post-Build edits.
4. **`/pr #N`** — commit, confirm, push, open PR, remove `in-progress`. Then **`/clear`**.

When the last child merges and closes, the parent **`story`** issue closes too.

Use `/clear` between tickets.

## Context hygiene

Keep `/grill-with-docs` → `/to-spec` → `/to-tickets` in a single context window. Split after tickets are published — one `/plan` + Build + `/pr` cycle per child ticket.

## Example: calculator features

Work in dependency order:

1. [Calculator PoC](../product/features/calculator-poc.md) — stack + basic arithmetic
2. [Calculator v1](../product/features/calculator-v1.md) — memory, clear, standard UX
3. [Calculator v2](../product/features/calculator-v2.md) — scientific mode

Each gets its own grill → spec → tickets → plan/pr cycle.

## Related

- [How we plan](how-we-plan.md)
- [Definition of Ready](definition-of-ready.md)
- [Contributing to the wiki](../contributing.md)
- [Agent workflow](../agents/workflow.md) — skill-level detail for agents
