## Parent

#36 — [Spec: Calculator v2](https://github.com/irenadimitrova1/calculator-ai-demo/issues/36)

**Feature doc:** [`docs/product/features/calculator-v2.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md)

## What to build

A pure TypeScript **expression** module that parses and evaluates scientific expressions with PEMDAS — the math engine for Scientific mode. No React, no new npm dependencies. Accept an expression string plus angle unit (`deg` | `rad`); return a numeric result or signal domain errors (divide by zero, log of zero, √(negative), etc.).

Support: parentheses; binary `+ − × ÷ ^` (right-associative power); constants π and e; sin/cos/tan and sin⁻¹/cos⁻¹/tan⁻¹ with degree/radian awareness; ln and base-10 log.

## Acceptance criteria

- [ ] `(2 + 3) × 4` evaluates to `20` (PEMDAS, not left-to-right)
- [ ] `2^3^2` evaluates to `512` (right-associative `^`)
- [ ] π and e constants evaluate correctly in expressions
- [ ] Trig respects DEG vs RAD (e.g. sin(30) in degrees → `0.5`)
- [ ] Inverse trig keys' math is covered (asin/acos/atan with correct unit handling)
- [ ] ln and log (base-10) work; invalid domains return error (not throw uncaught)
- [ ] Domain errors: divide by zero, log(0), √(negative) return typed failure — no crash
- [ ] Table-driven Vitest suite with named reference scenarios (PEMDAS, parens, trig deg/rad, powers, domain errors)

## Blocked by

- #21 — [Spec: Calculator v1](https://github.com/irenadimitrova1/calculator-ai-demo/issues/21) — v2 builds on shipped v1; complete all v1 child tickets and close the v1 `story` before starting.

## PM/PO assumptions

Not applicable.
