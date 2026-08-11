# Workflow: feature doc → ship

How engineering skills should take a PM feature spec from `docs/product/features/` through to implemented code on GitHub Issues.

## Primary entry

An approved feature doc at `docs/product/features/*.md`. Read the full doc before starting. Use vocabulary from `CONTEXT.md` if it exists.

## Engineering chain

Run in order:

1. **`/grill-with-docs`** — sharpen the idea against the feature doc; append or update `## Engineering specification` in the same file and `CONTEXT.md`. **Do not edit PM/PO sections.** Shorten or skip if the wiki doc is already complete and passes [Definition of Ready](../process/definition-of-ready.md).

2. **`/to-spec`** — publish one **parent** spec issue on GitHub with the **`story`** label (not `ready-for-agent`). The issue body must link to the feature doc path. Synthesize from `## Engineering specification` only (plus `CONTEXT.md`, ADRs, and codebase) — not the PM sections above it.

3. **`/to-tickets`** — split into tracer-bullet tickets with blocking edges. Pass the spec issue (`#N`) or the feature doc path (`docs/product/features/<file>.md`). Read `## Engineering specification` only from the feature doc. Quiz the user on granularity and blockers before publishing. Apply **`ready-for-agent`** to child tickets only — do **not** run `/triage` on these tickets.

4. **Per child ticket** (repeat until all children ship):
   - **`/plan #N`** — `gh issue develop` to create/link branch from `main`, assign `@me`, swap `ready-for-agent` → `in-progress`; Plan mode + grill-me; Cursor plan. **No commit.**
   - **Build** — see [Build](#build) below. **No commit.**
   - **`/verify #N`** *(optional)* — re-run checks after post-Build edits, before `/pr`.
   - **`/pr #N`** — commit, confirm, push, open PR, remove `in-progress`, **`/clear`**.

Use **`/clear`** after each `/pr` so the next `/plan` starts fresh.

## Build

Cursor **Build** runs on the feature branch after the plan is approved. It is **two phases in one session** — verify is not a separate mandatory step:

| Phase | What runs | When |
|-------|-----------|------|
| **1. Implement** | Write code, tests, and Storybook stories per the approved plan | First |
| **2. Verify** | Full verify checklist: typecheck, lint, tests, production build, Storybook build, docs (`mkdocs`), `/code-review`, update feature doc ticket progress | **Automatically, when implementation finishes** |

Phase 2 uses the same checklist as the optional [`/verify`](../../.agents/skills/verify/SKILL.md) skill. You do **not** need to invoke `/verify` after a normal Build — only if you edit code or docs **after** Build and want to re-validate before `/pr`.

**Do not commit** during either phase. Commits happen only in `/pr`.

## Context hygiene

| Session | Skills | Clear after? |
|---------|--------|--------------|
| Spec chain | grill-with-docs → to-spec → to-tickets | No until tickets published |
| Plan | `/plan #N` | Optional before Build |
| Build + verify | Build (verify runs at end) | — |
| Ship | `/pr #N` | **Yes** — `/clear` before next ticket |

Keep steps 1–3 in **one unbroken context window**. Each `/plan` starts fresh for the next ticket.

## Parent story closure

When the **last** child issue is merged and closed (`Closes #N` on its PR), close the parent **`story`** issue and set the feature doc **`Status:`** to `done`. `/pr` handles this when all siblings are closed (including after re-invoke post-merge).

## Incoming work (different path)

**`/triage`** is only for raw external issues and bugs — things you did not create via `/to-tickets`. Triaged issues that become `ready-for-agent` also use **`/plan` → Build → `/pr`** (optional `/verify` after edits).

## Skill reinstall note

`ask-matt` is installed from `mattpocock/skills` and may be overwritten by `npx skills@latest add`. This file is the canonical project flow when skills disagree. Re-apply the "This repo" patch in `ask-matt` after a skill reinstall if needed.

## Related

- [Feature doc → issues](../process/feature-to-issues.md) — human-facing walkthrough
- [Issue tracker](issue-tracker.md) — `gh` CLI conventions
