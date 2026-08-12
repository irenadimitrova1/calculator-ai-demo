**Question ID:** `pm-q1-unary-apply`  
**Feature doc:** [`docs/product/features/calculator-v2.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md)  
**Anchor:** [`### pm-q1-unary-apply`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md#pm-q1-unary-apply)

## Prompt

Unary functions — how should sin, √, x², 1/x, and log keys behave? This couples to the evaluation model but is a separate UX choice.

## Options

| id | label |
|----|-------|
| `immediate-unary` | Immediate unary — sin/cos/tan/√/x²/1/x apply to the active number on press (classic scientific keypad) *(Recommended)* |
| `expression-token` | Expression token — functions build the expression string; everything evaluates on equals |
| `record-open` | Record as open question for PM/PO |

## Assumption (if blocked)

`immediate-unary` — immediate unary apply on press until PM/PO confirms. Engineering interim detail: apply to active number and **insert the computed numeric result** into the building expression.

## Parent

#36 — [Spec: Calculator v2](https://github.com/irenadimitrova1/calculator-ai-demo/issues/36)
