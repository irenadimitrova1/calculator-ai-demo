## Parent

#46 — [Spec: Calculator v3](https://github.com/irenadimitrova1/calculator-ai-demo/issues/46)

**Feature doc:** [`docs/product/features/calculator-v3.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md)

## What to build

A pure TypeScript **calculation history** module — the in-memory engine for completed calculation logs. No React, no `localStorage` in this ticket.

Append **history entries** on demand (expression + formatted result), enforce FIFO cap at **25** (oldest dropped first), clear all entries, and produce recall payload (result string for active number). Format combined display lines as `expression = result`. Allow duplicate rows.

## Acceptance criteria

- [ ] `HistoryEntry` shape: `id`, `expression`, `result` strings
- [ ] Append adds entry; list is **newest first**
- [ ] Cap at 25: adding a 26th entry drops the oldest
- [ ] Clear removes all entries
- [ ] Recall payload returns the entry's **result** string only (not full expression replay)
- [ ] Combined-line formatter produces `expression = result`
- [ ] Table-driven Vitest: append, cap FIFO, clear, duplicates allowed, recall payload, combined-line formatting

## Blocked by

- #36 — [Spec: Calculator v2](https://github.com/irenadimitrova1/calculator-ai-demo/issues/36) — v3 builds on shipped v2 dual-engine behavior; close the v2 `story` before starting.

## PM/PO assumptions

Not applicable.
