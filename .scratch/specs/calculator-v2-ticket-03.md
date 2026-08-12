## Parent

#36 — [Spec: Calculator v2](https://github.com/irenadimitrova1/calculator-ai-demo/issues/36)

**Feature doc:** [`docs/product/features/calculator-v2.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md)

## What to build

Complete the **scientific keypad** with all unary and remaining function keys: sin, cos, tan, sin⁻¹, cos⁻¹, tan⁻¹, √, x², x^y, 1/x, ln, log.

Unary behavior follows the PM decision on `pm-q1-unary-apply` (see **Blocked by** #37). Until triage resolves #37, do not start this ticket.

## Acceptance criteria

- [ ] Full scientific keypad rows per engineering spec (trig, inverse trig, ln/log, powers)
- [ ] Unary keys behave per triaged **Answer** for `pm-q1-unary-apply` in feature doc `## Questions`
- [ ] User can complete typical homework scenarios (trig, logs, powers) via keypad only
- [ ] Scientific mode still has no repeat-equals
- [ ] % key retains v1 divide-by-100 semantics in Scientific mode
- [ ] Session tests cover unary actions and integration with expression evaluation
- [ ] Domain errors from unary ops (e.g. log of zero) show `Error` state

## Blocked by

- #40 — Mode toggle, dual-engine orchestrator, and scientific arithmetic UI
- #37 — [PM] Unary function key behavior (sin, sqrt, log) — `pm-q1-unary-apply`

## PM/PO assumptions

**Blocked on PM question** — implementation waits on #37 triage. When unblocked, follow **Answer** in `## Questions` → `pm-q1-unary-apply` (not the interim assumption in the engineering spec).
