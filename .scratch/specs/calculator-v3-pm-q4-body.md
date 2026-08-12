**Question ID:** `pm-q4-history-a11y`  
**Feature doc:** [`docs/product/features/calculator-v3.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md)  
**Anchor:** [`### pm-q4-history-a11y`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md#pm-q4-history-a11y)

## Prompt

History accessibility — how should assistive tech and keyboard users interact with the history list?

v1 already uses aria-live on the display region.

## Options

| id | label |
|----|-------|
| `click-only` | Pointer/tap only — no dedicated history keyboard nav in v3 *(Recommended)* |
| `keyboard-nav` | Keyboard navigable list — arrow keys + Enter to recall; proper aria roles |
| `record-open` | Record as open question for PM/PO |

## Assumption (if blocked)

`click-only` — Pointer/tap only — no dedicated history keyboard nav in v3.

## Parent

#46 � [Spec: Calculator v3](https://github.com/irenadimitrova1/calculator-ai-demo/issues/46)
