---
name: plan
description: Plan one child ticket in Plan mode — grill-me rounds, then a Cursor plan. No code, no git.
disable-model-invocation: true
---

Plan how to build **one child ticket** before any code is written. Run `/grilling` per `/grill-me`. Do **not** write code, commit, push, or run `/code-review`.

## Resolve the target issue first

Fetch the issue the user pointed at (number, URL, or title). Read labels, body, and `## Blocked by` / `## Parent` sections.

| Label | Role | Action |
|-------|------|--------|
| `story` | Parent / umbrella spec from `/to-spec` | **Do not plan the parent.** Go to [Parent `story` issues](#parent-story-issues). |
| `ready-for-agent` | Tracer-bullet ticket from `/to-tickets` | Plan this issue (if blockers are clear). |
| Other | Untriaged or human-only | Stop — tell the user to triage or pick a `ready-for-agent` child ticket. |

**Never** plan a `story` issue directly — it holds user stories and cross-cutting decisions, not a single shippable slice.

### Parent `story` issues

When the target has the `story` label, run `/grilling` per `/grill-me`:

1. Gather **child tickets** — open issues whose body references this parent under `## Parent`. Read each child's title, acceptance criteria, and `## Blocked by`.
2. Compute the **frontier** — children labeled `ready-for-agent` whose blockers are all closed (or `Blocked by: None`).
3. **Grill** the user on which frontier ticket to plan now via `AskQuestion`. Wait for confirmation.
4. Plan the **chosen child ticket** — not the parent.

### Blockers

Before planning, verify the target ticket's blockers are satisfied. If `## Blocked by` references open issues, stop and point the user at the blocking ticket.

## What to read first

Look up facts yourself — do not ask the user to point you at files:

| Material | Path | Why |
|----------|------|-----|
| Target ticket | GitHub issue `#N` | Acceptance criteria, what to build |
| Parent story | `## Parent` in ticket body | Cross-cutting context (read only) |
| Feature doc | `docs/product/features/*.md` → `## Engineering specification` | Stack, behavior, constraints |
| Parent spec | Linked `story` issue body | Seams, testing decisions |
| Domain glossary | `CONTEXT.md` | Ubiquitous language |
| ADRs | `docs/adr/` | Hard decisions already made |
| Codebase | `src/`, `package.json`, etc. | What exists vs what the ticket assumes |

## Enter Plan mode

Call `SwitchMode` with `target_mode_id: "plan"` before grilling and plan authoring.

If `SwitchMode` is unavailable, tell the user to switch to Plan mode manually and continue.

## Grill-me rounds — plan-mode UI

Work the **design tree** in rounds for *this ticket only*: seams, module boundaries, test approach, risky decisions.

Present each round's **frontier** with `AskQuestion` — same interactive picker UI as `/grill-with-docs`. **Do not** dump numbered markdown question lists in chat.

**One `AskQuestion` call per round** for the frontier. Wait for answers before the between-round gate.

### Per-question shape

- **`id`** — stable slug (`q1-seam`, `q2-modules`, …).
- **`prompt`** — short title, then 1–3 sentences of context.
- **`options`** — 2–5 concrete choices. Put your recommendation **first** and suffix with `(Recommended)`.
- **`allow_multiple`** — `false` unless the decision genuinely allows multiple picks.

### Between-round gate — always

After each frontier round, run a **second** `AskQuestion`:

- **`id`** — `round-additions`
- **`prompt`** — *"Anything this round didn't cover? Add constraints or preferences before the next round."*
- **`options`** — `Nothing to add — continue (Recommended)` / `I have requirements to add (I'll type them)`

Do **not** skip the gate.

### When grilling is done

Stop when the frontier is empty and the user confirms shared understanding. Do **not** start coding.

## Produce the plan

Call `CreatePlan` with:

- Linked issue `#N`, parent `story` `#M` (if any), feature doc path
- Acceptance criteria mapped to concrete steps
- Testing seams (from parent spec or engineering spec)
- Explicit out-of-scope for this ticket

Optionally save a copy under `.scratch/plans/<issue>-<slug>.md` for traceability.

Update the feature doc **`## Engineering specification` → `### Ticket progress`** only: set this ticket's row to `planned`. Do **not** edit PM sections.

## Handoff

Tell the dev:

1. Review and approve the plan in Cursor
2. Execute with **Build** (Plan mode) or Agent mode — fine-tune locally
3. Run **`/pr #N`** when ready to commit, open a PR, and update docs

Do **not** commit or push — `/pr` is the explicit ship gate.
