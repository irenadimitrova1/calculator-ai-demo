**Feature doc:** [`docs/product/features/calculator-v3.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md)  
**Engineering spec:** [`## Engineering specification`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md#engineering-specification)  
**ADRs:** [ADR-0001](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/adr/0001-react-vite-typescript.md), [ADR-0002](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/adr/0002-tailwind-shadcn-storybook.md)

**Blocked by:** #36 — Calculator v2 `story` must close (all v2 child tickets `implemented`) before v3 implementation begins.

## Problem Statement

After v1 and v2, the calculator can handle everyday and scientific math, but every completed calculation vanishes when the user moves on. Refresh the page and memory is gone too. People who want to check their work, reuse a previous result, or switch tabs lose trust and time. Without a scrollable history and local persistence, the product still feels like a demo next to calculators that remember what you ran.

## Solution

Add a **calculation history** panel — a scrollable log of completed calculations (`expression = result`) — plus **local persistence** so history and **memory** survive page refresh. Selecting a **history entry** recalls its result into the **active number** for further math. Users can clear all history in one action. History is capped at 25 entries (oldest dropped first). Basic and Scientific modes from v2 continue unchanged; successful equals in either mode appends to history. No account or cloud sync required.

## User Stories

1. As an everyday user, I want each completed calculation to appear in a scrollable history list, so that I can glance back at what I just calculated.
2. As an everyday user, I want history rows to show both the expression and the result (e.g. `5 + 3 × 2 = 16`), so that I understand what each entry represents.
3. As a student, I want to tap a history entry and have its result appear as the active number, so that I can reuse it in my next calculation without retyping.
4. As a student, I want history recall to clear the expression line and start a fresh entry phase, so that I am ready to chain a new operation.
5. As a professional, I want history recall to put the result value only — not replay the original expression — so that I can continue from that number.
6. As a user, I want to clear all history in one action, so that I can get a clean slate when I want one.
7. As a user, I want clearing history to leave memory and my current calculation untouched, so that I do not lose stored values or in-progress work accidentally.
8. As a user, I want the most recent calculation at the top of the history list, so that I find what I just ran quickly.
9. As a user, I want history capped at 25 entries with the oldest dropping off, so that the list never feels endless.
10. As a user, I want duplicate calculations to appear as separate rows when I run the same thing twice, so that each completion is recorded.
11. As a user, I want failed calculations (Error state) not to appear in history, so that the log only shows successful results.
12. As a user in Basic mode, I want only the first equals of a repeat-equals chain to add a history row, so that pressing `=` repeatedly does not spam duplicate entries.
13. As a user in Scientific mode, I want each successful equals to add one history row, so that PEMDAS results are logged like Basic calculations.
14. As a user, I want refreshing the page to restore my calculation history, so that I can pick up where I left off without an account.
15. As a user, I want refreshing the page to restore my memory value, so that stored numbers survive a browser reload.
16. As a user, I want mode (Basic/Scientific), angle unit, and any in-progress calculation to reset on refresh, so that persistence scope stays predictable.
17. As a user, I want All Clear, Clear, and mode switch to behave as in v1/v2 without wiping history, so that session reset and history are independent.
18. As a user evaluating the product, I want history to work in both Basic and Scientific modes, so that the feature feels complete across the app.
19. As a user on a laptop, I want the history panel beside the calculator with a scrollable list, so that I can see history and keypad together (interim assumption — `needs-info` on layout).
20. As a user on a narrow screen, I want the history panel to stack below the calculator, so that the layout remains usable on mobile.
21. As a user, I want long expressions in history to truncate with ellipsis and show the full text on hover, so that rows stay readable.
22. As a user, I want an empty-state message when history is empty, so that I know the panel is working and not broken.
23. As a user, I want a Clear history control that clears immediately without a confirmation dialog, so that one action gives a clean slate (interim assumption — `needs-info` on confirmation).
24. As a user whose browser blocks storage, I want history and memory to work for the current session with a one-time notice, so that the app still works without silent failure.
25. As a user, I want history rows without timestamps, so that the list stays focused on math (interim assumption — `needs-info` on timestamps).
26. As a pointer user, I want to click or tap a history row to recall, so that recall is obvious (interim assumption — `needs-info` on keyboard/a11y scope).
27. As a developer, I want table-driven tests on the pure history module, so that cap, append, clear, and recall logic are verified without React.
28. As a developer, I want persistence round-trip tests with a versioned localStorage schema, so that refresh hydration is reliable.
29. As a demo audience member, I want Storybook stories for populated, empty, at-cap, and post-recall history states, so that UI is reviewable without manual setup.

## Implementation Decisions

- **Calculation history module:** New pure TypeScript module owning the history list — append on successful equals, FIFO cap at 25, clear all, and recall payload (result string for active number). Each **history entry** stores expression and formatted result; combined display line is `expression = result`. No React in core logic.
- **History entry shape:**

```ts
type HistoryEntry = {
  id: string
  expression: string
  result: string
}
```

- **Persistence adapter:** Thin `localStorage` layer with versioned JSON schema `{ version: 1, history: HistoryEntry[], memory: number }`. Hydrate on app load; persist on history append, clear history, and memory mutations. Does not persist mode, angle unit, or in-progress session.
- **Session integration:** Extend the calculator hook/session layer to hold history list state, dispatch recall and clear-history actions, append history when equals succeeds (Basic: first equals only in repeat-equals chain; Scientific: every successful equals), and sync memory + history to persistence. Recall clears expression line, sets entry result as active number, entry phase.
- **Storage failure:** If `localStorage` throws or is unavailable, keep history in memory for the session only; show one-time non-blocking notice; memory follows same degrade path.
- **UI — History panel component:** Scrollable list, newest first, Clear history button, empty placeholder. Layout beside calculator at `md+`, stacked below on narrow viewports (interim assumption: beside-right — `pm-q1-panel-layout`).
- **UI — Clear history:** Immediate clear, no dialog (interim assumption — `pm-q2-clear-confirm`).
- **UI — Recall:** Click/tap row only in v3; no dedicated keyboard navigation (interim assumption — `pm-q4-history-a11y`).
- **UI — Timestamps:** None on rows (interim assumption — `pm-q3-timestamps`).
- **Stack:** React + Vite + TypeScript, Tailwind + shadcn/ui, Storybook, Vitest + RTL — unchanged from v1/v2. No new npm dependencies.

## Testing Decisions

**What makes a good test:** Assert externally visible outcomes — history list contents and order, recall effect on expression line and active number, memory after refresh, cap behavior, empty and at-cap UI — not internal storage keys or private module fields.

**Seams:**

1. **Calculation history module (primary)** — table-driven Vitest: append, FIFO cap at 25, clear, duplicate rows allowed, recall payload, combined-line formatting. Pure functions; no React.
2. **Persistence adapter** — Vitest with mocked `localStorage`: schema version, round-trip hydrate/save, corrupt/missing data handling, graceful failure path.
3. **Session orchestrator** — integration-style tests on hook or session+history wiring: equals appends entry, repeat-equals first-only in Basic, recall resets session, clear history leaves session/memory, AC/C/mode switch do not mutate history.
4. **Thin UI smoke** — HistoryPanel RTL (list render, click recall, clear button) plus App smoke for hydration; Storybook for panel states. Not the main verification surface.

**Prior art:** `calculation-session.test.ts` (table-driven session scenarios), `format-display.test.ts` (display string rules), `App.test.tsx` (UI smoke), `Calculator.stories.tsx` (visual states).

## Out of Scope

- Cloud sync, multi-device accounts, or sign-in.
- Exporting, emailing, or sharing history (v10).
- Themes and skins (v4).
- Saved named formulas (v8).
- Timestamps or audit-trail metadata unless PM chooses otherwise via open question.
- Dedicated history keyboard navigation unless PM chooses otherwise via open question.
- Persisting Basic/Scientific mode, angle unit, or in-progress session on refresh.
- Recording error-state calculations in history.

## Further Notes

- **Open PM questions:** Panel layout (`pm-q1-panel-layout`), clear confirmation (`pm-q2-clear-confirm`), timestamps (`pm-q3-timestamps`), history accessibility (`pm-q4-history-a11y`) — see linked `needs-info` issues. Implementation may proceed on documented assumptions.
- **Depends on v2:** Block on #36 until all v2 children (#39–#42) are `implemented`. v3 builds on dual-engine Basic + Scientific behavior.
- **Domain glossary:** Calculation history, History entry, History recall, History cap, Local persistence — see `CONTEXT.md`.
