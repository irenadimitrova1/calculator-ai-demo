---
name: plan
description: Plan one child ticket in Plan mode — branch from main, grill-me, Cursor plan. No commit.
disable-model-invocation: true
---

Plan how to build **one child ticket** on a feature branch. Run `/grilling` per `/grill-me`. Do **not** commit, push, or open a PR.

## Resolve the target issue first

Fetch the issue the user pointed at (number, URL, or title). Read labels, body, and `## Blocked by` / `## Parent` sections.

| Label | Role | Action |
|-------|------|--------|
| `story` | Parent / umbrella spec from `/to-spec` | **Do not plan the parent.** Go to [Parent `story` issues](#parent-story-issues). |
| `ready-for-agent` | Tracer-bullet ticket from `/to-tickets` | Plan this issue (if blockers are clear). |
| `in-progress` | Ticket already claimed | Continue on the linked branch — skip branch setup unless branch is missing. |
| Other | Untriaged or human-only | Stop — tell the user to triage or pick a `ready-for-agent` child ticket. |

**Never** plan a `story` issue directly.

### Parent `story` issues

When the target has the `story` label, run `/grilling` per `/grill-me`:

1. Gather **child tickets** whose body references this parent under `## Parent`.
2. Compute the **frontier** — children labeled `ready-for-agent` whose blockers are all closed.
3. **Grill** the user on which frontier ticket to plan now via `AskQuestion`.
4. Plan the **chosen child ticket**.

### Blockers

Before planning, verify blockers are satisfied. Stop if `## Blocked by` references open issues.

## Start — branch and issue (before Plan mode)

Run **once** when the ticket has `ready-for-agent` (skip branch setup if already `in-progress` with a linked branch — see below).

1. **Fetch latest `main`:** `git fetch origin main`
2. **Create and link branch** (GitHub **Development** sidebar — not a comment):
   ```bash
   gh issue develop <N> --name issue-<N>-<slug> --base main --checkout
   ```
   Slug from ticket title (lowercase, hyphenated). This creates the branch on the remote from `main`, **links it to the issue**, and checks it out locally.
3. **Confirm link:** `gh issue develop --list <N>` — must show `issue-<N>-<slug>`.
4. **Assign and label the issue:**
   - `gh issue edit <N> --add-assignee @me`
   - `gh issue edit <N> --remove-label ready-for-agent --add-label in-progress`

Do **not** use `gh issue comment` for branch linking — comments do not appear under **Development**.

Planning and **Build** both happen on this branch. **Do not commit** during `/plan` or during Plan **Build**.

### Already `in-progress`

- **Linked branch exists** (`gh issue develop --list <N>` shows it): `git checkout issue-<N>-<slug>` and continue.
- **Branch exists but not linked** (old workflow): run step 2 again with the same `--name` — `gh` links the existing branch.
- **Wrong branch / no branch:** run step 2 from a clean `main` fetch.

Create the **`in-progress`** and **`implemented`** labels on GitHub if they do not exist yet.

## What to read first

| Material | Path | Why |
|----------|------|-----|
| Target ticket | GitHub issue `#N` | Acceptance criteria |
| Parent story | `## Parent` in ticket body | Context (read only) |
| Feature doc | `## Engineering specification` + `## Questions` | Stack, behavior, constraints; each question is an AskQuestion-shaped block (`Prompt`, `Options` table); resolved **Answer** overrides **Assumption** |
| `CONTEXT.md`, ADRs, codebase | repo root | Facts and vocabulary |

## Enter Plan mode

Call `SwitchMode` with `target_mode_id: "plan"` before grilling and plan authoring.

If `SwitchMode` is unavailable, tell the user to switch to Plan mode manually.

## Grill-me rounds — plan-mode UI

Work the **design tree** in rounds for *this ticket only*.

Present each frontier with `AskQuestion` — same shape as `/grill-with-docs`: **`id`**, **`prompt`**, **`options`** (2–5 choices; `(Recommended)` first; **`Other (I'll type it)`** only when needed). **Between-round gate** every round (`round-additions`). Do **not** skip the gate.

Do **not** write code, **commit**, or run checks during grilling.

## Produce the plan

Call `CreatePlan` with issue `#N`, parent `story`, feature doc path, acceptance criteria, testing seams, and out-of-scope.

Optionally save under `.scratch/plans/<issue>-<slug>.md`.

Update feature doc **`### Ticket progress`**: set row to `planned`. Do **not** edit PM sections.

## Handoff

Tell the dev:

1. Review and approve the plan in Cursor
2. **Build** on branch `issue-<N>-<slug>` — two phases in one session ([Build](../../docs/agents/workflow.md#build)):
   - **Implement** the plan
   - **Verify** — run the full checklist from [`/verify` skill](../verify/SKILL.md) **automatically when implementation finishes**
3. Run **`/pr #N`** — commit, push, open PR (only after verify passes)

If you change anything after Build, run optional **`/verify #N`** to re-validate before `/pr`.

**Never commit during Plan Build.** Commits happen only in `/pr`.
