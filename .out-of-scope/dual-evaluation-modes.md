# Dual evaluation modes (immediate vs PEMDAS)

This repo does not add user-selectable calculation modes outside the Calculator v2 roadmap.

## Why this is out of scope

Issue #35 requested two evaluation behaviors in Basic (v1) calculator:

1. **Simple / aggregate mode** — immediate left-to-right execution with a rewired expression trail (e.g. `10 + 5 ×` → expression shows `15 ×`).
2. **History / PEMDAS mode** — record the full expression until equals, then evaluate with standard order of operations (e.g. `10 + 5 × 10` → `60`).

Both behaviors are already planned under **[Calculator v2](docs/product/features/calculator-v2.md)**:

- **Basic mode** keeps v1 immediate execution and the resolved `full-typed-history` expression trail (PM answer to `pm-q2-chaining-trail`). The current `10 + 5 × 10 = 150` result is correct for this mode.
- **Scientific mode** evaluates parenthesized expressions with PEMDAS on equals — the path to `60` for `10 + 5 × 10`.

Re-opening a second mode toggle or rewired-trail variant in v1 would duplicate v2 scope and contradict the resolved PM decision on expression trail display.

## Prior requests

- #35 — "Aggregating result" (two modes: simple aggregate vs iOS-style history / PEMDAS)
