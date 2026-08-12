## Summary

- Auto-focus calculator root with keyboard input mirroring all v1 spec keys (main + Numpad), including Backspace and Escape
- Add session `backspace` action with table-driven tests; `aria-live="polite"` on the display region
- Extend Storybook with Chaining, MemoryIndicator, ErrorState, and KeyboardFocus interaction stories; App keyboard smoke test

Closes #29

**Parent story:** #21 — Spec: Calculator v1

**Feature doc:** `docs/product/features/calculator-v1.md`

**Verification:** typecheck, lint, unit tests, production build, and Storybook build passed during Build.
