---
name: to-tickets
description: Break a plan, spec, or the current conversation into a set of tracer-bullet tickets, each declaring its blocking edges, published to the configured tracker — edges as text in one file per ticket locally, or native blocking links on a real tracker.
disable-model-invocation: true
---

# To Tickets

Break a plan, spec, or conversation into a set of **tickets** — tracer-bullet vertical slices, each declaring the tickets that **block** it.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

### 1. Gather context

Work from whatever is already in the conversation context. If the user passes a reference (a spec path, an issue number or URL, or a feature doc path) as an argument, fetch it and read its full body and comments.

When the source is a feature doc at `docs/product/features/<name>.md`:

- Read **`## Engineering specification`** for implementation requirements — not the PM sections above it.
- Read **`## Questions`** for open product questions, documented **Assumption** values, resolved **Answer** values, and linked tracker issues (`needs-info` / `answered`).
- Also use `CONTEXT.md`, relevant ADRs, the codebase, and the parent **`story`** issue from `/to-spec`.

#### Prerequisites — stop if missing

**`/to-tickets` runs only after `/to-spec`.** Before drafting tickets, verify on the tracker:

| Prerequisite | How to check | If missing |
|--------------|--------------|------------|
| Parent **`story`** issue | Open issue labelled `story` whose body links to this feature doc (or user passed `#N`) | **Stop.** Tell the user to run **`/to-spec`** on the feature doc first. Do **not** publish implementation tickets. Do **not** create the `story` or `needs-info` issues here — that is `/to-spec`'s job. |
| PM question issues | Each **open** row in `## Questions` has a `#N` link in the **Issue** column pointing at a **`needs-info`** (or **`answered`**) issue | **Stop.** Tell the user to run **`/to-spec`** (or finish its PM-question publish step). Do **not** publish with placeholder text like "not yet published". |
| Ticket progress empty | Feature doc **`### Ticket progress`** has no prior child rows for this feature (or user explicitly asked to replace) | If rows already exist, confirm with the user before republishing — avoid duplicate child issues. |

If the user passes a **`story`** issue number directly (e.g. `/to-tickets #18`), use that as the parent — still require PM **Issue** column links when open rows exist.

For each **open** row in `## Questions` (`Status:` `open`):

| Source | Use in ticket draft |
|--------|---------------------|
| **Prompt** / **Options** | Identify which tracer bullets depend on the answer |
| **Assumption (if blocked)** | Default behaviour if tickets proceed before PM/PO answers |
| **Answer** | When **Status:** `resolved`, use **Answer** (`option-id` — label; not **Assumption**) for acceptance criteria — eng spec above stays unchanged |
| **Issue** column (`#N`) | Existing `needs-info` or `answered` issue from `/to-spec` — do **not** republish as `ready-for-agent` |

**Do not** create duplicate PM question issues in `/to-tickets` — those come from `/to-spec`. Implementation tickets may **block on** PM question `#N` or **proceed on assumption** with the assumption called out in the ticket body and acceptance criteria.

### 2. Explore the codebase (optional)

If you have not already explored the codebase, do so to understand the current state of the code. Ticket titles and descriptions should use the project's domain glossary vocabulary, and respect ADRs in the area you're touching.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Each slice cuts a narrow but COMPLETE path through every layer (schema, API, UI, tests) — vertical, NOT a horizontal slice of one layer
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges** — the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Cross-feature dependencies:** When the feature doc's **`## Engineering specification`** or parent **`story`** body states the work **depends on a prior feature** (e.g. v2 builds on shipped v1 `calculation-session`), block the **first** child ticket of the new feature on the prior feature's **`story`** issue — not on individual prior child tickets. The prior `story` stays open until all its children are **`implemented`** and closed, so this gate means "prior feature shipped." Add the edge in **`## Blocked by`** and as a **native blocking link** on GitHub (see [issue-tracker](../../docs/agents/issue-tracker.md)). Later tickets in the same feature inherit the gate through their in-feature chain — only the frontier ticket needs the cross-feature edge. **Do not** label the first ticket `ready-for-agent` without this edge when the dependency is documented.

**PM/PO open questions:** When a slice touches behaviour covered by an **open** `## Questions` row, either:

- **Block** on the linked PM question issue (`needs-info` / `answered`) in **Blocked by**, or
- **Proceed on assumption** — cite the row ID (`pm-q1`, …) and the table's **Assumption** in **What to build** and acceptance criteria.

Call out which tickets use which approach in the draft list. Flag risky assumption-based tickets in the **`tickets-pm-questions`** review below.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change — rename a column, retype a shared symbol — whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket — green is promised only there.

### 4. Quiz the user — plan-mode UI

Present the proposed breakdown as a **compact numbered list** in chat (title, **Blocked by**, what it delivers, **PM/PO** note if assumption-based or blocked on `#N`) — framing only. **Do not** dump a "Questions for you" markdown section or bullet quiz in prose.

If `## Questions` has **open** rows, summarize them in one line before the ticket list (ID, assumption, linked issue).

Run **`AskQuestion`** for the review. **One call** with **four** questions in the `questions` array. Wait for answers before revising or publishing.

#### Per-question shape

**Granularity** — `id`: `tickets-granularity`

- **`prompt`** — *"Granularity — N tickets proposed. Too coarse, too fine, or about right?"* Include one-line examples if helpful (e.g. merge #4+#5, split #3 from #2).
- **`options`** —
  - `About right (Recommended)` — when the draft breakdown is balanced
  - `Too coarse — merge or fewer tickets`
  - `Too fine — split or more tickets`
  - `I'll describe changes (I'll type them)`

**Blocking edges** — `id`: `tickets-blocking`

- **`prompt`** — *"Blocking edges — does each ticket only block on tickets that genuinely gate it?"* Summarize the dependency chain in one sentence (e.g. whether #5 should block on #3 or only #2).
- **`options`** —
  - `Blocking edges look correct (Recommended)`
  - `One or more edges are wrong (I'll describe)`

**Merge / split** — `id`: `tickets-merge-split`

- **`prompt`** — *"Any tickets to combine or break apart before we publish?"*
- **`options`** —
  - `No merge or split needed (Recommended)`
  - `Merge tickets (I'll describe)`
  - `Split tickets (I'll describe)`

**PM/PO open questions** — `id`: `tickets-pm-questions`

- **`prompt`** — *"Open PM/PO questions — how should tickets handle them?"* List open row IDs and which proposed tickets they affect. Skip or mark **N/A — no open PM/PO rows** when the table is empty or all **resolved**.
- **`options`** —
  - `Proceed on documented assumptions (Recommended)` — when assumptions in the table are acceptable for `/plan`
  - `Block affected tickets on PM question issues until triage resolves them`
  - `I'll describe changes (I'll type them)`

Put **`(Recommended)`** on the option that matches your draft assessment — only one recommended option per question.

#### Iterate

If any answer requests changes, wait for freeform input, revise the draft breakdown, show the updated list briefly, and run **`AskQuestion`** again with the same four questions.

Do **not** publish until all four pick an approving option (or **I'll describe** followed by a revised draft they accept on the next round).

#### Confirm before publish

When the breakdown is approved, run a **second** `AskQuestion`:

- **`id`** — `tickets-publish-confirm`
- **`prompt`** — *"Publish N tickets to the issue tracker with `ready-for-agent` in dependency order?"*
- **`options`** —
  - `Publish tickets (Recommended)`
  - `Revise breakdown (I'll describe changes)`
  - `Cancel — don't publish yet`

**Do not** call `gh issue create` or write local ticket files until the user picks **Publish tickets**.

If `AskQuestion` is unavailable, use compact markdown from `/grilling` — still no long "Questions for you" header blocks.

### 5. Publish the tickets to the configured tracker

Publish the approved tickets. **How** depends on the tracker `/setup-matt-pocock-skills` configured — the tickets are the same either way, only the shape of the blocking edges changes:

- **Local files** → write one file per ticket under `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, numbered from `01` in dependency order (blockers first). Each file's "Blocked by" lists the numbers/titles it depends on. Use the per-ticket file template below — one ticket per file, never a single combined file.
- **A real issue tracker (GitHub, Linear, …)** → publish one issue per ticket in dependency order (blockers first) so each ticket's blocking edges can reference real identifiers. Use the platform's native blocking / sub-issue relationship where it has one; otherwise set each ticket's "Blocked by" to the blocking issues. Apply the `ready-for-agent` triage label unless instructed otherwise — the tickets are agent-grabbable by construction.

Work the **frontier**: any ticket whose blockers are all done. For a purely linear chain that means top to bottom.

Do NOT close or modify any parent issue or existing **`needs-info`** / **`answered`** PM question issues.

After publishing on GitHub, append rows to the feature doc **`### Ticket progress`** table (engineering section) for each new `ready-for-agent` child ticket.

<local-ticket-template>

# <NN> — <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective — not a layer-by-layer implementation list.

**Blocked by:** the numbers/titles of the tickets that gate this one, or "None — can start immediately".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2

</local-ticket-template>

<issue-template>

## Parent

Link to the parent **`story`** issue from `/to-spec` (required when publishing from a feature doc).

## What to build

The end-to-end behaviour this ticket makes work, from the user's perspective — not layer-by-layer implementation.

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Blocked by

- A reference to each blocking ticket, or "None — can start immediately".
- PM question issues (`needs-info` / `answered`) when this ticket waits on PM/PO — link `#N` and row ID (`pm-q1`, …).

## PM/PO assumptions

- When proceeding on assumption: cite `## Questions` row ID and the assumption text. When **Answer** exists, cite **Answer** instead. Omit when not applicable.

</issue-template>

In either form, avoid specific file paths or code snippets — they go stale fast. Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.
