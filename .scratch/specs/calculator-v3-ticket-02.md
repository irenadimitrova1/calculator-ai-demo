## Parent

#46 — [Spec: Calculator v3](https://github.com/irenadimitrova1/calculator-ai-demo/issues/46)

**Feature doc:** [`docs/product/features/calculator-v3.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md)

## What to build

Wire **calculation history** and **local persistence** into the calculator session layer end-to-end (no history panel UI yet).

Add a **persistence adapter** with versioned `localStorage` schema `{ version: 1, history: HistoryEntry[], memory: number }`. Hydrate history + memory on load; persist on successful equals (history append), clear history, and memory mutations. On refresh, restore history + memory only — mode, angle unit, and in-progress session reset to defaults.

Extend the calculator hook/session: append history on successful equals in Basic and Scientific modes (Basic: **first equals only** in repeat-equals chain; errors skip history); **history recall** clears expression line and sets result as active number; **clear history** leaves session and memory untouched; AC/C/mode switch do not mutate history. If `localStorage` fails, keep history + memory in session memory for current visit only (one-time notice deferred to ticket #4).

## Acceptance criteria

- [ ] Persistence round-trip tests: save/load history + memory; corrupt/missing data handled safely
- [ ] Successful Basic equals appends one history row; repeat-equals does not add more rows
- [ ] Successful Scientific equals appends one history row
- [ ] Error-state equals do not append history
- [ ] Recall clears expression line, sets entry result as active number, entry phase
- [ ] Clear history empties list without clearing memory or in-progress session
- [ ] AC, Clear, and mode switch do not remove or alter existing history entries
- [ ] Simulated refresh restores history cap/list order and memory value
- [ ] Integration tests cover equals → history, recall, clear, and refresh hydration

## Blocked by

- #51 — Calculation history module

## PM/PO assumptions

Not applicable.
