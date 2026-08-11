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
   - **`/plan #N`** — Plan mode + grill-me rounds; produces a Cursor plan (no code, no git). If pointed at a **`story`** parent, runs grill-me to pick the next unblocked child first.
   - **Build** — execute the plan in Cursor (Build or Agent); fine-tune locally.
   - **`/pr #N`** — verify, code-review, update docs, commit, push, open PR.

Use **`/clear`** between tickets so each `/plan` starts fresh.

## Context hygiene

| Session | Skills | Clear after? |
|---------|--------|--------------|
| Spec chain | grill-with-docs → to-spec → to-tickets | No until tickets published |
| Plan | `/plan #N` | After plan approved (optional `/clear` before Build) |
| Build | Manual / Cursor Build | — |
| Ship | `/pr #N` | Yes — fresh `/plan` for next ticket |

Keep steps 1–3 in **one unbroken context window**. Each `/plan` starts fresh for the next ticket.

## Incoming work (different path)

**`/triage`** is only for raw external issues and bugs — things you did not create via `/to-tickets`. Triaged issues that become `ready-for-agent` also use **`/plan` → Build → `/pr`**.

## Skill reinstall note

`ask-matt` is installed from `mattpocock/skills` and may be overwritten by `npx skills@latest add`. This file is the canonical project flow when skills disagree. Re-apply the "This repo" patch in `ask-matt` after a skill reinstall if needed.

## Related

- [Feature doc → issues](../process/feature-to-issues.md) — human-facing walkthrough
- [Issue tracker](issue-tracker.md) — `gh` CLI conventions
