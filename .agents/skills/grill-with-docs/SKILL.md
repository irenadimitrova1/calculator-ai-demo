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

| `## Engineering specification` | Engineering | **Write here.** All grilling output lands in this section. |



If `## Engineering specification` does not exist yet, **append** it after `## Related` — do not reorder or rewrite PM sections.



`/to-spec` and `/to-tickets` read **only** `## Engineering specification` from the feature doc (not the PM sections above). Write it to be self-contained: stack, behavior, constraints, open questions resolved, and how engineering interprets the PM intent — without duplicating the PM prose.



## What to write as decisions land



Update **inline during the session** — don't batch until the end:



- **`docs/product/features/<name>.md` → `## Engineering specification` only** — settled technical and behavioral decisions

- **`CONTEXT.md`** — new or refined domain terms (`/domain-modeling` format)

- **`docs/adr/000N-slug.md`** — only when a decision is hard to reverse, surprising, and came from a real trade-off



### Engineering specification template



Create or update this block at the bottom of the feature doc:



```md

## Engineering specification



**Owner:** Engineering  

**Last updated:** YYYY-MM-DD



_Sourced from PM sections above. `/to-spec` and `/to-tickets` read only this section._



### Stack



…



### Behavior



…



### UI / UX



…



### Constraints



…



### Open questions



_None — or list anything still unresolved._

```



Add subsections as needed. Remove or empty `### Open questions` as the grill completes.



## Questions — plan-mode UI



Present each round's **frontier** with the `AskQuestion` tool — the same interactive picker UI as Plan mode. **Do not** dump numbered markdown question lists in chat.



**One `AskQuestion` call per round** for the frontier. Put every frontier question in that call's `questions` array (one object per decision). Then wait for answers before the between-round gate.



### Per-question shape



- **`id`** — stable slug for the round (`q1-feature`, `q2-stack`, …).

- **`prompt`** — short title on the first line, then 1–3 sentences of context. Put the trade-off here, not in option labels.

- **`options`** — 2–5 concrete choices. Put your recommendation **first** and suffix its label with `(Recommended)`.

- **`allow_multiple`** — `false` unless the decision genuinely allows multiple picks.



Include **Other (I'll type it)** only when the listed options might not cover the user's situation. Never duplicate it as both "Other" and "Something else".



### Between-round gate — always



After recording a round's answers, run a **second** `AskQuestion` call before the next frontier round. The frontier cannot cover everything — styling, UI libraries, tooling, naming, constraints the user already has in mind.



One question, every time:



- **`id`** — `round-additions`

- **`prompt`** — e.g. *"Anything the questions above didn't cover? Add specs, constraints, or preferences before the next round."*

- **`options`** —

  - `Nothing to add — continue` `(Recommended)`

  - `I have requirements to add (I'll type them)`



If they pick **I have requirements to add**, wait for their freeform message. Integrate what they write into `## Engineering specification`, `CONTEXT.md`, or an ADR as appropriate — then run the next frontier round. Treat user-supplied specs as settled decisions, not suggestions.



Do **not** skip the gate to save a turn, even when the frontier felt complete.



### Chat around the picker



Use prose **only** for framing — what you're grilling, what's settled so far, facts you looked up. Keep it short. The decisions themselves live in `AskQuestion`, not in the message body.



### After each round



1. Record settled terms in `CONTEXT.md` and update `## Engineering specification` inline (`/domain-modeling`).

2. Offer an ADR only when the domain-modeling skill's three ADR criteria all apply.

3. Run the **between-round gate** (`round-additions`).

4. If the user added requirements, record those in `## Engineering specification` too — then recompute the frontier and call `AskQuestion` again.



### Fallback



If `AskQuestion` is unavailable, use the markdown format from `/grilling` — but keep it compact; still no long option lists in prose when choices are fixed.


