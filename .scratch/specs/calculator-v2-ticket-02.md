## Parent

#36 — [Spec: Calculator v2](https://github.com/irenadimitrova1/calculator-ai-demo/issues/36)

**Feature doc:** [`docs/product/features/calculator-v2.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md)

## What to build

Wire **Basic** and **Scientific** modes end-to-end for arithmetic expressions — mode toggle, dual-engine orchestrator, and a demoable Scientific UI slice (without unary function keys yet).

Users can switch Basic ↔ Scientific; Basic keeps all v1 behavior unchanged. Scientific mode builds parenthesized expressions, evaluates on equals via the expression module, shows DEG/RAD (default degrees), horizontal scroll on long expressions, wider card, and two-line result layout after equals. Mode switch clears the calculation session but preserves shared memory.

Scientific keypad in this ticket: digits, operators, parentheses, π, e, power (`^` or x^y), equals, AC/C, memory, %, +/− — enough to demo `(2 + 3) × 4 = 20`.

## Acceptance criteria

- [ ] Segmented **Basic** / **Scientific** toggle; obvious which mode is active
- [ ] Basic mode: existing calculation-session behavior unchanged; existing session tests pass
- [ ] Scientific mode: expression builds on top line; overflow scrolls horizontally to tail
- [ ] Scientific equals evaluates via expression module; `(2 + 3) × 4 =` → result `20` on active-number line
- [ ] DEG/RAD toggle with on-screen label; degrees default
- [ ] Mode switch triggers AC-equivalent reset; memory register survives mode switch
- [ ] Wider card in Scientific mode than Basic
- [ ] Invalid scientific evaluation enters v1 error state (`Error`, input blocked until AC/C)
- [ ] Session-orchestrator tests: mode toggle, dual dispatch, mode-switch reset, shared memory
- [ ] Thin UI verification: switch to Scientific, complete one PEMDAS expression via keypad

## Blocked by

- #39 — Scientific expression evaluator module

## PM/PO assumptions

Not applicable.
