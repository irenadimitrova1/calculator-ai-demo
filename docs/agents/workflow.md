# Workflow: feature doc → ship

How engineering skills should take a PM feature spec from `docs/product/features/` through to implemented code on GitHub Issues.

## Primary entry

An approved feature doc at `docs/product/features/*.md`. Read the full doc before starting. Use vocabulary from `CONTEXT.md` if it exists.

## Engineering chain

Run in order:

1. **`/grill-with-docs`** — sharpen the idea against the feature doc; append or update `## Engineering specification` and `## Questions` (PM/PO uncertainties via `AskQuestion`); update `CONTEXT.md`. **Do not edit PM sections above.** Shorten or skip if the wiki doc is already complete and passes [Definition of Ready](../process/definition-of-ready.md).

2. **`/to-spec`** — publish **`story`** parent + **`needs-info`** PM question issues. PM replies → **`answered`** → **`/triage #N`** records **Answer** in `## Questions` (spec above unchanged). Parent synthesizes from `## Engineering specification`; body links to the feature doc. **Gate:** `/to-tickets` refuses to publish if the `story` or PM **Issue** column links are missing.

3. **`/to-tickets`** — split into tracer-bullet tickets **after `/to-spec`**. Read **`## Engineering specification`** and **`## Questions`** (open rows → block on linked `#N` or proceed on **Assumption**; resolved **Answer** overrides assumption). When the spec depends on a **prior feature**, block the **first** child on that feature's **`story`** issue (native GitHub dependency + `## Blocked by`). Review via **`AskQuestion`**, confirm, publish **`ready-for-agent`** children only. Each child links **`## Parent`** → the `story` issue.

4. **Per child ticket** (repeat until all children ship):
   - **`/plan #N`** — `gh issue develop` to create/link branch from `main`, assign `@me`, swap `ready-for-agent` → `in-progress`; **AskQuestion grill-me**, then **`CreatePlan`** in the same session (Cursor Plan with **Build** button). **No commit.** A `.scratch/plans/*.md` file is not a substitute.
   - **Build** — see [Build](#build) below. **No commit.**
   - **`/verify #N`** *(optional)* — re-run checks after post-Build edits, before `/pr`.
   - **`/pr #N`** — commit, confirm, push, open PR, remove `in-progress`, doc row **`in-review`**, **`/clear`**.

Child ticket label flow: **`ready-for-agent`** → **`in-progress`** (`/plan`) → **`implemented`** (PR merged; issue closed; label applied by CI).

Use **`/clear`** after each `/pr` so the next `/plan` starts fresh.

## Build

Cursor **Build** runs on the feature branch after the **Cursor Plan** from `/plan` is approved. `/plan` must call **`CreatePlan`** — the plan appears in **Plan mode** with the **Build** button. A `.scratch/plans/*.md` mirror or a handoff to `~/.cursor/plans/...` is not a completed `/plan`.

Cursor **Build** is **two phases in one session** — verify is not a separate mandatory step:

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

## AI usage tracking

Skills and hooks register each agent session on GitHub; `/pr` posts token and cost roll-up on the parent **`story`** when all children ship. See [usage-tracking.md](usage-tracking.md).

## Parent story closure

When the **last** child issue is merged (`Closes #N` on its PR), CI applies label **`implemented`**, set the doc row to **`implemented`**, close the parent **`story`** issue, and set the feature doc **`Status:`** to `done`. `/pr` handles doc/story closure when all siblings are closed (including after re-invoke post-merge).

## PM/PO question lifecycle

Separate from the spec chain — runs whenever PM/PO replies on a **`needs-info`** issue from `/to-spec`:

| Step | Who | Label | Action |
|------|-----|-------|--------|
| 1 | `/to-spec` | **`needs-info`** | Publish PM question issue; doc row **Status:** `open` |
| 2 | PM/PO (or **`/triage`** on reply) | **`needs-info`** → **`answered`** | `gh issue edit <N> --remove-label needs-info --add-label answered` when a decision comment lands — **before** incorporating into the spec |
| 3 | **`/triage #N`** | **`answered`** | Record **Answer** in **`## Questions`** only (never edit spec above); **`AskQuestion`**: resolved / new dev ticket / back to **`needs-info`** |
| 4 | **`/triage`** (resolved) | *(none on close)* | Close PM issue; **`gh issue edit <N> --remove-label answered`**; doc row **Status:** `resolved` |

Do **not** close a PM question issue while it still has **`needs-info`** — swap to **`answered`** first. Do **not** leave **`answered`** on a closed issue.

## Incoming work (different path)

**`/triage`** is only for raw external issues and bugs — things you did not create via `/to-tickets`. Triaged issues that become `ready-for-agent` also use **`/plan` → Build → `/pr`** (optional `/verify` after edits).

## Skill reinstall note

`ask-matt` is installed from `mattpocock/skills` and may be overwritten by `npx skills@latest add`. This file is the canonical project flow when skills disagree. Re-apply the "This repo" patch in `ask-matt` after a skill reinstall if needed.

## Related

- [Feature doc → issues](../process/feature-to-issues.md) — human-facing walkthrough
- [Issue tracker](issue-tracker.md) — `gh` CLI conventions
