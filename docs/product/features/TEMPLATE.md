# Title <!-- Feature title — e.g. Calculator v3 -->

**Owner:** PM / PO  
**Last updated:** <!-- YYYY-MM-DD -->

## Purpose

<!-- One or two sentences: what this feature delivers and why now. -->

## Problem

<!-- What pain exists today? What happens if we don't build this? -->

## Users

<!-- Who benefits? Use bold labels per audience. -->

- **<!-- Audience -->** — <!-- what they need from this feature -->

## Success metrics

<!-- How will we know this shipped successfully? Prefer observable outcomes. -->

- <!-- metric -->

## Scope

### In scope

<!-- Group related bullets under bold subheadings when helpful. -->

**<!-- Area -->**

- <!-- capability or requirement -->

### Out of scope

<!-- Be explicit. Link to other feature docs when deferring work. -->

- <!-- deferred item --> — <!-- optional: link to other feature doc -->

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Feature template](TEMPLATE.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- <!-- Sibling or dependent features -->
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)

## Engineering specification

**Owner:** Engineering  
**Last updated:** <!-- YYYY-MM-DD — filled in by /grill-with-docs -->  
**Status:** not-started | in-progress | done

_Sourced from PM sections above. `/to-spec` reads this section for the parent spec. `/to-tickets` reads this section **and** `## Questions` below._

> PM/PO: leave **`## Engineering specification`** and **`## Questions`** for engineering. Do not edit below this line unless you are running `/grill-with-docs` (spec + questions only) or updating **`### Ticket progress`** during delivery.

> **Immutability:** After `/grill-with-docs`, do **not** edit stack, behavior, UI, or constraints when PM answers — record answers in **`## Questions`** only. **`### Ticket progress`** is the only engineering subsection that changes during `/to-tickets` → merge.

### Ticket progress

| Issue | Title | Status |
|-------|-------|--------|
| #N | <!-- ticket title --> | ready-for-agent / planned / in-review / implemented |

`/to-tickets` sets **`ready-for-agent`**. `/plan` may set **`planned`**. `/pr` sets **`in-review`**. On merge, set **`implemented`**. Set feature **Status:** to `done` when all child tickets are **`implemented`**.

### Stack

<!-- e.g. framework, language, build tool, UI library, CSS approach -->

### Behavior

<!-- How the system should work — edge cases, data rules, interaction model -->

### UI / UX

<!-- Layout, visual direction, accessibility bar, responsive behavior -->

### Constraints

<!-- Dependencies, performance, compatibility, what must not change -->

### Open questions

<!-- Engineering-internal only. Product questions → ## Questions below. -->

<!-- _None_ once settled -->

## Questions

**Owner:** Engineering (from `/grill-with-docs`)  
**Last updated:** <!-- YYYY-MM-DD -->

_`/to-spec` → **`needs-info`**. PM replies → **`answered`**. **`/triage #N`** fills **Answer** here (never edits `## Engineering specification` above). **`/to-tickets`** uses open rows for blocking/assumptions; resolved **Answer** overrides assumption._

Each item mirrors one **`AskQuestion`** call — copy **`id`**, **`prompt`**, and **`options`** verbatim from the tool. Do **not** paraphrase into a prose “Question” column.

| ID | Issue | Status |
|----|-------|--------|
| <!-- pm-q1-slug --> | <!-- #N --> | open / resolved |

### <!-- pm-q1-slug --> {#<!-- pm-q1-slug -->}

**Prompt:** <!-- same string as AskQuestion `prompt` -->

**Options:**

| id | label |
|----|-------|
| <!-- option-id --> | <!-- option label; suffix *(Recommended)* on the grill-time pick --> |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** <!-- `option-id` — label of the interim engineering choice -->

**Answer:** <!-- filled by `/triage`: `option-id` — label, or freeform when PM typed a custom answer -->

<!-- Repeat `###` block per question. `_None._` in the index table when empty. -->
