---

name: grill-with-docs

description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.

disable-model-invocation: true

---



Sharpen a PM feature spec into an engineering-ready plan. Run a `/grilling` session using the `/domain-modeling` skill.



## What to read first



The **feature doc** is the subject of the grill — usually `docs/product/features/<name>.md`. Read the **PM/PO sections** fully before asking anything, but **do not edit them**.



Also read what frames it (look up facts yourself; don't ask the user to point you at files):



| Material | Path | Why |

|----------|------|-----|

| Feature spec (PM) | `docs/product/features/*.md` — sections above `## Engineering specification` | Purpose, scope, success metrics — the plan under test |

| Engineering spec | `## Engineering specification` in the same file | Decisions already settled in a prior grill |

| Sibling features | other files in `docs/product/features/` | Dependency order (e.g. PoC → v1 → v2) and what's deferred |

| Definition of Ready | `docs/process/definition-of-ready.md` | Whether the PM doc is complete enough to grill or skip |

| Vision & roadmap | `docs/product/vision.md`, `docs/product/roadmap.md` | Product north star when the feature doc is ambiguous |

| Domain glossary | `CONTEXT.md` (repo root) | Existing ubiquitous language — challenge conflicts |

| ADRs | `docs/adr/` | Hard technical decisions already made |

| Codebase | `src/`, `package.json`, etc. | Facts about what exists vs what the doc assumes |



If the user didn't name a feature doc, list what's in `docs/product/features/` (exclude `TEMPLATE.md`) and ask which one to grill (dependency order is the default recommendation). For a **new** feature, point PMs at `docs/product/features/TEMPLATE.md`.



## PM vs engineering — do not cross the line



Each feature doc has two owners:



| Section | Owner | Grill behavior |

|---------|-------|----------------|

| Title through `## Related` (PM content) | PM / PO | **Read only.** Never edit Purpose, Problem, Users, Success metrics, Scope, or Out of scope. |

| `## Engineering specification` | Engineering | **Write here.** Settled technical and behavioral decisions from grilling. |
| `## Questions` | Engineering captures; PM/PO answers | **Write here.** Product uncertainties that engineering cannot resolve alone. **Answer** column filled by **`/triage`** — never edit spec above. |



If `## Engineering specification` does not exist yet, **append** it after `## Related`. Append `## Questions` **after** `## Engineering specification`. Do not reorder or rewrite PM sections.



`/to-spec` and `/to-tickets` read **`## Engineering specification`**. Both also use **`## Questions`** — `/to-spec` publishes open rows; `/to-tickets` uses assumptions, blockers, and resolved **Answer** values.



## What to write as decisions land



Update **inline during the session** — don't batch until the end:



- **`docs/product/features/<name>.md` → `## Engineering specification`** — settled technical and behavioral decisions
- **`docs/product/features/<name>.md` → `## Questions`** — open product questions for PM/PO/client (see [PM/PO uncertainties](#pm-po-uncertainties--askquestion))

- **`CONTEXT.md`** — new or refined domain terms (`/domain-modeling` format)

- **`docs/adr/000N-slug.md`** — only when a decision is hard to reverse, surprising, and came from a real trade-off



### Engineering specification template



Create or update this block at the bottom of the feature doc:



```md

## Engineering specification



**Owner:** Engineering  

**Last updated:** YYYY-MM-DD



_Sourced from PM sections above. `/to-spec` reads this section. `/to-tickets` reads this section and `## Questions`._

> **Frozen after grill:** Do not edit stack, behavior, UI, or constraints when PM answers — only **`### Ticket progress`** updates during delivery. PM **Answer** values go in **`## Questions`**.



### Stack



…



### Behavior



…



### UI / UX



…



### Constraints



…



### Open questions

_Engineering-internal only. Product questions for PM/PO go in `## Questions` — not here._

_None — or list anything engineering still needs to resolve without PM input._

```

Append **`## Questions`** immediately after the engineering block (same file):

```md
## Questions

**Owner:** Engineering (from `/grill-with-docs`)  
**Last updated:** YYYY-MM-DD

_`/to-spec` → **`needs-info`**. PM replies → **`answered`**. **`/triage #N`** fills **Answer** here — never edits spec above._

| ID | Issue | Status |
|----|-------|--------|
| pm-q1-slug | #N | open / resolved |

### pm-q1-slug {#pm-q1-slug}

**Prompt:** <!-- verbatim from AskQuestion `prompt` -->

**Options:**

| id | label |
|----|-------|
| option-a | First concrete choice *(Recommended)* |
| option-b | Second concrete choice |
| record-open | Record as open question for PM/PO |

**Assumption (if blocked):** option-a — label of interim choice

**Answer:** <!-- /triage: option-id — label -->
```

Add subsections to the engineering block as needed. Empty `### Open questions` when engineering-internal items are settled. Leave the PM/PO table empty or with `_None._` when there are no open product questions.

## PM/PO uncertainties — AskQuestion

When grilling hits **product** uncertainty — scope, UX policy, success metrics, client preference, anything only PM/PO/client can answer — **do not guess**. Run **`AskQuestion`** before continuing.

**One call per uncertainty** (or batch closely related ones in one call). Use the **product** AskQuestion shape — concrete decision options, not the meta handler (`Answer now` / `Proceed with assumption`):

- **`id`** — `pm-q1-<slug>`, `pm-q2-<slug>`, … (match the index row and `###` heading)
- **`prompt`** — state the question plainly; include why engineering cannot decide alone
- **`options`** — 2–4 **product** choices; put your recommendation **first** with `(Recommended)`; **always last:** `Record as open question for PM/PO` (`id`: `record-open`)

**After answers:**

| Pick | Action |
|------|--------|
| A concrete product option (or **Answer now — I'll type it**) | Fill **Answer** on the matching `###` block as `` `option-id` — label `` (or freeform). Do **not** edit **`## Engineering specification`** for PM decisions. |
| Record as open question for PM/PO | Add index row + `###` block copying **`id`**, **`prompt`**, **`options`** from the AskQuestion call; set index **Status:** `open`. Set **Assumption** to the `(Recommended)` option. |
| Proceed with assumption (meta pick during grill) | Set **Assumption** on the block (and note in eng spec behavior bullets); optional open row if PM must still confirm later. |

When persisting to the feature doc, **copy the AskQuestion fields verbatim** into the matching `### {id}` block — do not rewrite as prose columns.

### End-of-grill PM sweep

Before handing off to `/to-spec`, run one **`AskQuestion`**:

- **`id`** — `pm-questions-sweep`
- **`prompt`** — *"Any product questions we should send to PM/PO or the client before `/to-spec`?"*
- **`options`** —
  - `No open PM/PO questions (Recommended)` — when the table is empty or all rows are resolved
  - `Add PM/PO questions (I'll type them)` — wait for freeform input; add rows to `## Questions`

Do **not** skip the sweep when any PM/PO row is still **open**.

## Open question option — every AskQuestion

**Decision** `AskQuestion` calls — engineering frontier items and dedicated PM uncertainty prompts — must include **`Record as open question for PM/PO`** as the **last option** in each question's `options` array.

**Do not** add it to **`round-additions`** or **`round-pm-questions`** — those gate questions have their own purpose (see [Between-round gate](#between-round-gate--always)).

When the user picks **Record as open question for PM/PO** on a decision question:

1. Add an index row + `### {id}` block in `## Questions` — copy **`prompt`** and **`options`** from the AskQuestion call; set index **Status:** `open`.
2. Set **Assumption (if blocked)** to the `(Recommended)` option (`option-id` — label).
3. If grilling continues, note the same assumption in `## Engineering specification` behavior bullets.
4. Do **not** treat the decision as settled — leave the frontier item open or skip until resolved.

## Engineering decisions — plan-mode UI



Present each round's **frontier** with the `AskQuestion` tool — the same interactive picker UI as Plan mode. **Do not** dump numbered markdown question lists in chat.



**One `AskQuestion` call per round** for the frontier. Put every frontier question in that call's `questions` array (one object per decision). Then wait for answers before the [between-round gate](#between-round-gate--always).



### Per-question shape



- **`id`** — stable slug for the round (`q1-feature`, `q2-stack`, …).

- **`prompt`** — short title on the first line, then 1–3 sentences of context. Put the trade-off here, not in option labels.

- **`options`** — 2–5 concrete choices for the decision. Put your recommendation **first** and suffix its label with `(Recommended)`. **Always append last:** `Record as open question for PM/PO` (see [Open question option](#open-question-option--every-askquestion)).

- **`allow_multiple`** — `false` unless the decision genuinely allows multiple picks.



Include **Other (I'll type it)** only when the listed options might not cover the user's situation. Never duplicate it as both "Other" and "Something else".



### Between-round gate — always

After recording a round's answers, run **one** `AskQuestion` call before the next frontier round. Put **both** gate questions in that call's `questions` array — do **not** split them into separate rounds. Do **not** skip the gate.

**No** `Record as open question for PM/PO` on either gate question — engineering additions belong in the spec; PM/PO capture uses the second gate's freeform path.

#### Engineering additions (`round-additions`)

The frontier cannot cover everything — styling, UI libraries, tooling, naming, constraints the user already has in mind.

- **`id`** — `round-additions`
- **`prompt`** — *"Anything the questions above didn't cover? Add specs, constraints, or preferences before the next round."*
- **`options`** —
  - `Nothing to add — continue` `(Recommended)`
  - `I have requirements to add (I'll type them)`

#### Additional PM/PO questions (`round-pm-questions`)

Capture product questions that surfaced during the round but were not tied to a single frontier decision.

- **`id`** — `round-pm-questions`
- **`prompt`** — *"Any additional questions for PM/PO or the client before the next round?"*
- **`options`** —
  - `No additional PM/PO questions` `(Recommended)`
  - `Add PM/PO questions (I'll type them)`

**After answers:** If **I have requirements to add**, wait for freeform input and integrate into `## Engineering specification`, `CONTEXT.md`, or an ADR. If **Add PM/PO questions**, wait for freeform input; for each uncertainty run a product **`AskQuestion`** (concrete options + `record-open`), add the index row + `###` block, and document interim **Assumption** in the engineering spec if grilling continues. Then recompute the frontier.



### Chat around the picker



Use prose **only** for framing — what you're grilling, what's settled so far, facts you looked up. Keep it short. The decisions themselves live in `AskQuestion`, not in the message body.



### After each round



1. Record settled terms in `CONTEXT.md` and update `## Engineering specification` inline (`/domain-modeling`). Skip items answered with **Record as open question for PM/PO** — those go only in `## Questions`.

2. Offer an ADR only when the domain-modeling skill's three ADR criteria all apply.

3. Run the between-round gate — **one** `AskQuestion` with **`round-additions`** and **`round-pm-questions`** together (every frontier round).

4. If the user added engineering requirements or PM/PO questions, record those — then recompute the frontier and call `AskQuestion` again.



### Fallback



If `AskQuestion` is unavailable, use the markdown format from `/grilling` — but keep it compact; still no long option lists in prose when choices are fixed.


