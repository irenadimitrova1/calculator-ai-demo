# Feature doc → issues

How PM-written feature specs become GitHub Issues and shipped code.

## Overview

| Stage | Who | Where |
|-------|-----|--------|
| Product intent | PM / PO | Wiki — `docs/product/features/*.md` (sections above `## Engineering specification`) |
| Engineering spec | Engineering | Same file — `## Engineering specification` (via `/grill-with-docs`) |
| PM/PO questions | Engineering → PM/PO | Same file — `## Questions`; `/to-spec` → `needs-info` issues; **`/triage`** fills **Answer** without editing spec above |
| Spec + tickets | Engineering | GitHub Issues (via agent skills in Cursor) |
| Code | Engineering | Pull requests linked to issues |

This is **not automated** — there is no GitHub Action. An engineer runs the agent skill chain intentionally in Cursor.

## When a feature doc is ready

Before engineering picks it up, the doc should pass [Definition of Ready](definition-of-ready.md):

- Purpose, Problem, Users, Success metrics, and Scope are filled in
- Out of scope is explicit
- Linked to roadmap or vision where relevant

Use [TEMPLATE.md](../product/features/TEMPLATE.md) for new features, or the existing calculator docs (PoC through v10) as examples.

## PM step: write the spec

1. Create or edit a page under `docs/product/features/` via the [wiki](../contributing.md) (Edit this page on the live site, or edit in GitHub).
2. For a **new** feature, add a nav entry in [`mkdocs.yml`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/mkdocs.yml).
3. Merge to `main` — the wiki rebuilds automatically.

## Engineering step: the skill chain

Run in **one Cursor session** through ticket creation, then **plan → build → pr** per ticket in separate sessions (optional `/verify` after post-Build edits).

### 1. `/grill-with-docs`

Sharpen the idea against the PM sections of the feature doc. **Do not edit PM/PO content.** Append or update `## Engineering specification` and `## Questions` (product uncertainties captured with `AskQuestion` during grilling), plus `CONTEXT.md` and ADRs as decisions land. Skip or shorten if the PM doc is already complete.

`/to-spec` reads **`## Engineering specification`** for the parent spec and **`## Questions`** for `needs-info` issues. **`/to-tickets`** reads both — open rows inform blocking/assumptions; resolved **Answer** overrides assumption for implementation. **Do not** edit the engineering spec when PM answers — only the **Answer** column changes.

### 2. `/to-spec`

Publish **one parent spec issue** on GitHub with the **`story`** label (umbrella — not directly implementable). Also publish **`needs-info`** issues — one per **open** row in `## Questions`. The parent links back to the feature doc and synthesizes from `## Engineering specification` (plus `CONTEXT.md`, ADRs, and codebase exploration):

- User stories
- Implementation decisions (modules, seams, architecture)
- Testing decisions

Do **not** apply `ready-for-agent` to the parent issue or to **`needs-info`** PM question issues.

**PM question label flow:** **`needs-info`** (open) → PM replies → **`answered`** (`gh issue edit <N> --remove-label needs-info --add-label answered`) → **`/triage #N`** incorporates → close and **`--remove-label answered`**. Doc row **resolved** when the issue closes.

When PM/PO answers, apply the **`answered`** swap before **`/triage`** incorporates — do not close while still **`needs-info`**. Choose **resolved** or a new **`ready-for-agent`** implementation ticket via **`/triage`**.

**Before `/to-tickets`:** confirm the feature doc **`## Questions`** table has `#N` in the **Issue** column for every open row, and you know the parent **`story`** issue number.

### 3. `/to-tickets`

Split into **tracer-bullet tickets** with blocking edges. Pass the **`story`** issue number (`#N`) or the feature doc path — if only the doc path is given, **`/to-tickets` stops** when the `story` or PM links are missing and asks you to run `/to-spec` first.

```
/to-tickets docs/product/features/calculator-poc.md
```

Review the proposed breakdown with **`AskQuestion`** (granularity, blocking edges, merge/split), confirm publish, then create child issues on GitHub with **`ready-for-agent`** only.

**Do not** run `/triage` on these tickets — they are already agent-ready.

### 4. `/plan` → Build → `/pr` (per child ticket)

For each **`ready-for-agent`** child ticket:

1. **`/plan #N`** — branch from `main`, assign you, `ready-for-agent` → `in-progress`; **Plan mode required**; grill-me; **`CreatePlan`** (enables **Build** button). **No commit.** Do not finish with markdown-only output.
2. **Build** — execute the plan on the feature branch; **automatically run verify checklist** at the end (lint, tests, Storybook, docs). **No commit.**
3. **`/verify #N`** *(optional)* — re-validate after post-Build edits.
4. **`/pr #N`** — commit, confirm, push, open PR, remove `in-progress`, doc row **`in-review`**. Then **`/clear`**.

On **merge**, the PR's `Closes #N` closes the child issue; apply label **`implemented`** and set the doc row to **`implemented`**.

When the last child is **`implemented`**, close the parent **`story`** and set feature doc **`Status:`** to `done`.

Use `/clear` between tickets.

## Context hygiene

Keep `/grill-with-docs` → `/to-spec` → `/to-tickets` in a single context window. Split after tickets are published — one `/plan` + Build + `/pr` cycle per child ticket.

## Example: calculator features

Work in dependency order:

1. [Calculator PoC](../product/features/calculator-poc.md) — stack + basic arithmetic
2. [Calculator v1](../product/features/calculator-v1.md) — memory, clear, standard UX
3. [Calculator v2](../product/features/calculator-v2.md) — scientific mode
4. [Calculator v3](../product/features/calculator-v3.md) — history + persistence
5. [Calculator v4](../product/features/calculator-v4.md) — themes & skins
6. [Calculator v5](../product/features/calculator-v5.md) — unit conversion
7. [Calculator v6](../product/features/calculator-v6.md) — programmer mode
8. [Calculator v7](../product/features/calculator-v7.md) — graphing
9. [Calculator v8](../product/features/calculator-v8.md) — saved formulas & macros
10. [Calculator v9](../product/features/calculator-v9.md) — advanced math (complex, matrices, stats)
11. [Calculator v10](../product/features/calculator-v10.md) — export / share + light AI assist

Each gets its own grill → spec → tickets → plan/pr cycle.

## Related

- [How we plan](how-we-plan.md)
- [Definition of Ready](definition-of-ready.md)
- [Contributing to the wiki](../contributing.md)
- [Agent workflow](../agents/workflow.md) — skill-level detail for agents
