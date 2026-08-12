**Question ID:** `pm-q1-panel-layout`  
**Feature doc:** [`docs/product/features/calculator-v3.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md)  
**Anchor:** [`### pm-q1-panel-layout`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md#pm-q1-panel-layout)

## Prompt

History panel layout — where does the scrollable history list live relative to the calculator card?

v2 widens the scientific card; history should stay readable on laptop/tablet per PM success metrics.

## Options

| id | label |
|----|-------|
| `beside-right` | Panel beside calculator — history on the right, scrollable *(Recommended)* |
| `below` | Panel below calculator — history under keypad |
| `collapsible-drawer` | Collapsible side drawer — hidden by default, toggle to open |
| `record-open` | Record as open question for PM/PO |

## Assumption (if blocked)

`beside-right` — Panel beside calculator — history on the right, scrollable. Engineering also stacks below calculator on narrow viewports at sub-`md` breakpoints.

## Parent

#46 � [Spec: Calculator v3](https://github.com/irenadimitrova1/calculator-ai-demo/issues/46)
