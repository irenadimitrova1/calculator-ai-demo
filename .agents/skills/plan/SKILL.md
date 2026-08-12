---
name: plan
description: Plan one child ticket — branch from main, AskQuestion grill-me in Agent mode, then Plan mode CreatePlan (Build button). No commit.
disable-model-invocation: true
---

Plan how to build **one child ticket** on a feature branch. Run `/grilling` per `/grill-me`. Do **not** commit, push, or open a PR.

**Deliverable:** a **Cursor Plan** (via `CreatePlan`) — the artifact that exposes the **Build** button. A markdown file alone is **not** a completed `/plan`.

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

When the target has the `story` label, stay in **Agent mode** and run `/grilling` per `/grill-me` (AskQuestion — see below):

1. Gather **child tickets** whose body references this parent under `## Parent`.
2. Compute the **frontier** — children labeled `ready-for-agent` whose blockers are all closed.
3. **Grill** the user on which frontier ticket to plan now via `AskQuestion`.
4. Plan the **chosen child ticket**.

### Blockers

Before planning, verify blockers are satisfied. Stop if `## Blocked by` references open issues.

## Start — branch and issue (Agent mode)

Stay in **Agent mode** through branch setup, reading, and grill-me. Do **not** call `SwitchMode` yet.

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

## Grill-me rounds — AskQuestion required (Agent mode)

**Prerequisite:** branch setup done; materials read. **Still in Agent mode.**

Cursor **Plan mode disables `AskQuestion`**. Grill **before** the Plan mode gate so the picker UI works.

Work the **design tree** in rounds for *this ticket only* — same frontier model as `/grilling` and `/grill-with-docs`.

### Start from what's already settled

Before the first round, treat as **already decided** (do not re-grill):

- Ticket acceptance criteria and parent story scope
- `## Engineering specification` in the feature doc (behavior, UI, constraints)
- Resolved **`Answer`** values in `## Questions` (override assumptions)

Grill only **gaps** — ambiguities, implementation seams, or ticket-specific choices not spelled out above. A tracer-bullet ticket like #26 should usually need **one to three** frontier rounds, not dozens.

### One round = the whole frontier (batch questions)

**Never ask one decision per `AskQuestion` call.** That turns every choice into its own round and wastes the user's time.

Each frontier round is **exactly one** `AskQuestion` call whose `questions` array holds **every** decision you can ask *now* — all prerequisites already settled. Typical first round for a child ticket: 4–12 related questions in one picker.

| Belongs in **this** round | Belongs in a **later** round |
|-----------------------------|------------------------------|
| Independent choices (error model, keypad layout, test scope, action naming) | Choices that depend on an answer still open in this round |
| Edge cases you can phrase without guessing a prior pick | e.g. "negative decimal display" only after "+/- on empty → start `-`" is locked |

After the user answers, recompute the frontier. The **next** round contains only newly unlocked questions — often zero (grilling done).

Per-question shape matches `/grill-with-docs`: **`id`**, **`prompt`**, **`options`** (2–5 choices; `(Recommended)` first; **`Record as open question for PM/PO`** last on product uncertainties; **`Other (I'll type it)`** only when needed).

### Between-round gates — after each frontier round only

Run **after** recording answers for a full frontier round — **not** after every single question. Two gates, in order (see `/grill-with-docs`):

1. **`round-additions`** — engineering specs/constraints the frontier missed
2. **`round-pm-questions`** — product questions for PM/PO that surfaced during the round

Do **not** substitute a custom "Continue / Done grilling" gate. Do **not** skip either gate.

**Hard rules:**

- **Always** call `AskQuestion` for frontier rounds and between-round gates.
- **Never** dump numbered markdown question lists in chat as a substitute.
- **Never** chain single-question `AskQuestion` calls when those questions could have been batched.
- **If `AskQuestion` is unavailable** — stop. Tell the user `AskQuestion` is missing (stay in Agent mode; do not switch to Plan mode). Do **not** grill in markdown. Do **not** call `CreatePlan`.

Do **not** write code, **commit**, or run checks during grilling.

## Plan mode gate — CreatePlan only

Run **after** grilling is complete. **Not** before AskQuestion rounds.

1. Call `SwitchMode` with `target_mode_id: "plan"`.
2. **If `SwitchMode` is rejected or unavailable — stop.** Tell the user:
   - Switch to **Plan mode** manually (mode picker in chat/composer).
   - Re-run **`/plan #N`** once in Plan mode **only to finish CreatePlan** (grilling already done — do not re-grill in markdown).
   - Do **not** call `CreatePlan` from Agent mode, do **not** write a standalone plan markdown file, and do **not** set ticket progress to `planned`.
3. **If you are not in Plan mode — stop.** Same message as above.

## Produce the plan — Cursor Plan required

**Prerequisite:** grilling complete and [Plan mode gate](#plan-mode-gate--createplan-only) passed.

1. Call **`CreatePlan`** with issue `#N`, parent `story`, feature doc path, acceptance criteria, testing seams, and out-of-scope. This is the **only** valid plan deliverable — it wires the **Build** button in Cursor.
2. **If `CreatePlan` is unavailable — stop.** Tell the user to switch to Plan mode and re-run `/plan #N`. Do **not** substitute a markdown-only plan.
3. **Do not** write `.scratch/plans/*.md` (or any other file) **instead of** `CreatePlan`. Optionally mirror the approved Cursor Plan to `.scratch/plans/<issue>-<slug>.md` **after** `CreatePlan` succeeds.
4. Update feature doc **`### Ticket progress`**: set row to `planned`. Do **not** edit PM sections.

**Done when:** `CreatePlan` succeeded, ticket progress is `planned`, and the user can review the Cursor Plan and click **Build**.

## Handoff

Tell the dev:

1. Review and approve the **Cursor Plan** (not a `.scratch` markdown copy)
2. Click **Build** on the plan (or run Build from Plan mode) on branch `issue-<N>-<slug>` — two phases in one session ([Build](../../docs/agents/workflow.md#build)):
   - **Implement** the plan
   - **Verify** — run the full checklist from [`/verify` skill](../verify/SKILL.md) **automatically when implementation finishes**
3. Run **`/pr #N`** — commit, push, open PR (only after verify passes)

If you change anything after Build, run optional **`/verify #N`** to re-validate before `/pr`.

**Never commit during Plan Build.** Commits happen only in `/pr`.
