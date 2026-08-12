## Parent

#46 — [Spec: Calculator v3](https://github.com/irenadimitrova1/calculator-ai-demo/issues/46)

**Feature doc:** [`docs/product/features/calculator-v3.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md)

## What to build

Ship the visible **calculation history** panel — scrollable list beside the calculator (responsive), wired to session recall and clear actions.

Users see completed calculations as `expression = result` rows (newest first), an empty-state placeholder when history is empty, and a **Clear history** control. Click/tap a row to **recall** its result into the active number. Long expressions truncate with ellipsis; full text in tooltip. Layout: beside calculator at `md+`, stacked below on narrow viewports.

**Do not start until PM questions #47–#50 are triaged** — layout, clear confirmation, timestamps, and history a11y are product decisions.

## Acceptance criteria

- [ ] History panel visible with scrollable list; newest entry at top
- [ ] Rows show `expression = result` per triaged **Answer** for `pm-q3-timestamps` (no timestamps unless PM chooses otherwise)
- [ ] Empty state message when history is empty (panel still visible)
- [ ] Clear history per triaged **Answer** for `pm-q2-clear-confirm`
- [ ] Panel layout per triaged **Answer** for `pm-q1-panel-layout` (engineering responsive fallback: stack below on narrow screens unless PM says otherwise)
- [ ] Recall interaction per triaged **Answer** for `pm-q4-history-a11y`
- [ ] Click/tap recall updates display (expression cleared, result on active-number line)
- [ ] Clear history does not clear memory or in-progress calculation
- [ ] RTL tests: list render, recall click, clear button

## Blocked by

- #52 — Persistence adapter and session history integration
- #47 — [PM] History panel layout (`pm-q1-panel-layout`)
- #48 — [PM] Clear history confirmation (`pm-q2-clear-confirm`)
- #49 — [PM] History row timestamps (`pm-q3-timestamps`)
- #50 — [PM] History accessibility (`pm-q4-history-a11y`)

## PM/PO assumptions

**Blocked on PM questions** — implementation waits on #47–#50 triage. When unblocked, follow **Answer** values in feature doc `## Questions` (not interim assumptions in engineering spec).
