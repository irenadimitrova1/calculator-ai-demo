# Calculator v3

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Keep a usable log of past calculations and remember what matters across a page refresh — so people can pick up where they left off instead of retyping everything.

## Problem

After v1 and v2, the calculator is capable, but every completed equation disappears into the void. Refresh the page and memory is gone too. Users who check their work, reuse a previous result, or bounce between tabs lose trust and waste time. Competitors already show a scrollable history; without it we still feel like a demo.

## Users

- **Everyday users** — want to glance back at “what did I just calculate?” without starting over
- **Students and professionals** — reuse intermediate results from longer problem sets
- **Anyone evaluating us** — expects persistence and history before calling the product “done”

## Success metrics

- After equals, the expression and result appear in a scrollable history list
- Tapping (or selecting) a history entry puts that value back into the active display for further math
- Refreshing the page keeps history and memory available locally — no account required
- Users can clear history when they want a clean slate
- History stays readable with a sensible cap (oldest entries drop off) so the UI never feels endless

## Scope

### In scope

**History panel**

- A scrollable log of **completed** calculations (expression + result)
- Select an entry to recall its result into the active number (ready for the next operation)
- Clear all history in one action
- Cap the number of stored entries so the list stays manageable

**Persistence (local only)**

- Survive page refresh: calculation history and memory value
- No sign-in or cloud account — browser-local storage is enough for this release

**Everything from prior versions**

- Everyday and scientific calculator behavior continue to work; history records completed results from those modes

### Out of scope

- Cloud sync or multi-device accounts
- Downloading, emailing, or sharing history — [Calculator v10](calculator-v10.md)
- Different color themes or skins — [Calculator v4](calculator-v4.md)
- Saving named formulas for reuse — [Calculator v8](calculator-v8.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator PoC](calculator-poc.md)
- [Calculator v1](calculator-v1.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v4](calculator-v4.md)
- [Calculator v10](calculator-v10.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)

## Engineering specification

**Owner:** Engineering  
**Last updated:** 2026-08-12

_Sourced from PM sections above. `/to-spec` reads this section. `/to-tickets` reads this section and `## Questions`._

> **Frozen after grill:** Do not edit stack, behavior, UI, or constraints when PM answers — only **`### Ticket progress`** updates during delivery. PM **Answer** values go in **`## Questions`**.

### Stack

- **Same as v1/v2** — React + Vite + TypeScript, Tailwind + shadcn/ui, Storybook, Vitest + RTL
- **History module** — pure TypeScript module (`src/lib/calculation-history/` or similar): append, cap, clear, select-for-recall; no React in core logic
- **Persistence adapter** — thin `localStorage` read/write layer with versioned JSON schema (`{ version: 1, history: HistoryEntry[], memory: number }`); hydrates on load; writes on successful equals (history append), clear history, and memory mutations
- **`useCalculator` / session** — gains history list state and recall/clear actions; memory already in session — both persist together

### Behavior

- **History entry:** On successful equals (Basic or Scientific), append one **history entry** — full expression string + formatted result (e.g. `5 + 3 × 2 = 16`). Use the same display formatting as the live calculator (~12 visible digits, float-noise cleanup). **Basic repeat-equals:** only the **first** equals of a chain appends an entry; subsequent repeat-equals presses update the display but do **not** add new rows. Scientific mode has no repeat-equals (v2).
- **No error rows:** Failed calculations (error state) are **not** recorded in history.
- **History cap:** Keep at most **25** entries; when a new entry would exceed the cap, drop the **oldest** first (FIFO). **Duplicates allowed** — identical expression/result rows may appear more than once.
- **History recall:** Selecting an entry clears the expression line, sets the entry's **result** as the active number, and enters **entry** phase — ready to chain a new operation. Does not restore the original expression for re-equals.
- **Clear history:** One user action clears all history entries; does **not** clear memory or the active calculation session.
- **Session vs history:** All Clear / Clear / mode switch behave per v1/v2 — they reset the in-progress session but do **not** mutate history (except new entries on successful equals).
- **Persistence scope on refresh:** Restore **calculation history** (capped list) and **memory** value only. Basic/Scientific mode, angle unit, and any in-progress session reset to defaults (Basic mode, degrees, empty session).
- **Memory + history:** Memory clear/recall/M+/M− unchanged from v1; persisted memory survives refresh alongside history.
- **Storage failure:** If `localStorage` is unavailable or throws, keep history **in memory for the current session** only; show a **one-time non-blocking notice** that history won't survive refresh. Memory persistence follows the same degrade path.

### UI / UX

- **History panel:** _Pending PM/PO (`pm-q1-panel-layout`). Assumption until answered:_ scrollable list **beside** the calculator card (right side); calculator + history share a horizontal layout on laptop/tablet.
- **List order:** **Newest first** — most recent completed calculation at the top of the scrollable list.
- **Row format:** Single combined line per entry — `expression = result` (e.g. `5 + 3 × 2 = 16`); long expressions truncate with ellipsis, full text in `title` tooltip.
- **Clear history control:** _Pending PM/PO (`pm-q2-clear-confirm`). Assumption until answered:_ one **Clear history** button clears all entries immediately with no confirmation dialog.
- **Recall interaction:** _Pending PM/PO (`pm-q4-history-a11y`). Assumption until answered:_ click/tap a history row to recall its result into the active number (fresh entry phase); pointer/tap only — no dedicated history keyboard navigation in v3.
- **Row timestamps:** _Pending PM/PO (`pm-q3-timestamps`). Assumption until answered:_ no timestamps — each row shows `expression = result` only.
- **Empty state:** When history is empty, show a short placeholder (e.g. "No calculations yet") — panel remains visible.
- Carry forward v1/v2 display formatting, error presentation, and mode-specific card widths; widen outer layout to accommodate history panel without shrinking keypad buttons below usable size.
- **Responsive:** On narrow viewports, history panel **stacks below** the calculator; beside-right layout at `md` breakpoint and up (per `pm-q1-panel-layout` assumption).

### Constraints

- **Depends on v2:** Do not start v3 until the v2 **`story`** is closed — all v2 child tickets **`implemented`**. v3 builds on dual-engine Basic + Scientific behavior.
- Build on shipped v1 session module and v2 expression/scientific stack; no new dependencies
- PM out-of-scope still applies: no cloud sync, no export/share, no themes, no named formulas
- **Tests:** Table-driven Vitest on history module (append, cap FIFO, clear, recall payload); persistence adapter round-trip; integration tests for equals → history, recall → session, refresh hydration
- **Storybook:** Calculator stories with history panel populated, empty, at-cap, and post-recall states

### Open questions

_Engineering-internal only. Product questions for PM/PO go in `## Questions` — not here._

_None._

## Questions

**Owner:** Engineering (from `/grill-with-docs`)  
**Last updated:** 2026-08-12

_`/to-spec` → **`needs-info`**. PM replies → **`answered`**. **`/triage #N`** fills **Answer** here — never edits spec above._

| ID | Issue | Status |
|----|-------|--------|
| pm-q1-panel-layout | | open |
| pm-q2-clear-confirm | | open |
| pm-q3-timestamps | | open |
| pm-q4-history-a11y | | open |

### pm-q1-panel-layout {#pm-q1-panel-layout}

**Prompt:** History panel layout — where does the scrollable history list live relative to the calculator card?

v2 widens the scientific card; history should stay readable on laptop/tablet per PM success metrics.

**Options:**

| id | label |
|----|-------|
| `beside-right` | Panel beside calculator — history on the right, scrollable *(Recommended)* |
| `below` | Panel below calculator — history under keypad |
| `collapsible-drawer` | Collapsible side drawer — hidden by default, toggle to open |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `beside-right` — Panel beside calculator — history on the right, scrollable

**Answer:** <!-- /triage: option-id — label -->

### pm-q2-clear-confirm {#pm-q2-clear-confirm}

**Prompt:** Clear all history — PM says one action for a clean slate. Should it require confirmation?

**Options:**

| id | label |
|----|-------|
| `immediate` | Clear immediately — one tap, no confirmation *(Recommended)* |
| `confirm-dialog` | Confirm dialog before clearing all history |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `immediate` — Clear immediately — one tap, no confirmation

**Answer:** <!-- /triage: option-id — label -->

### pm-q3-timestamps {#pm-q3-timestamps}

**Prompt:** Timestamps — should history rows show when each calculation was completed?

PM success metrics focus on expression, result, and recall — not audit trails.

**Options:**

| id | label |
|----|-------|
| `no-timestamps` | No timestamps — expression = result only *(Recommended)* |
| `show-time` | Show time-of-day on each row (e.g. "2:34 PM") |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `no-timestamps` — No timestamps — expression = result only

**Answer:** <!-- /triage: option-id — label -->

### pm-q4-history-a11y {#pm-q4-history-a11y}

**Prompt:** History accessibility — how should assistive tech and keyboard users interact with the history list?

v1 already uses aria-live on the display region.

**Options:**

| id | label |
|----|-------|
| `click-only` | Pointer/tap only — no dedicated history keyboard nav in v3 *(Recommended)* |
| `keyboard-nav` | Keyboard navigable list — arrow keys + Enter to recall; proper aria roles |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `click-only` — Pointer/tap only — no dedicated history keyboard nav in v3

**Answer:** <!-- /triage: option-id — label -->
