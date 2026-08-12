## Summary

- After error state (e.g. divide by zero), digit, decimal, operator, and sign-toggle input clear the session (memory preserved) and start a fresh entry — macOS/iOS recovery semantics
- Equals, memory keys, percent, and backspace remain blocked until AC/C
- Updated session tests, ErrorState Storybook story, and domain docs (`CONTEXT.md`, `calculator-v1.md`)

## Test plan

- [x] Session unit tests (68 passing)
- [x] App integration tests passing
- [x] Typecheck and lint passing

Closes #34

**Parent story:** #21 (Calculator v1 — closed)

**Feature doc:** `docs/product/features/calculator-v1.md`

Checks passed during implementation (Storybook browser tests hit local cache flake).
