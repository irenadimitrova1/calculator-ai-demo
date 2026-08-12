## Parent

#36 — [Spec: Calculator v2](https://github.com/irenadimitrova1/calculator-ai-demo/issues/36)

**Feature doc:** [`docs/product/features/calculator-v2.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md)

## What to build

Polish Scientific mode for keyboard users and reviewers: scientific keyboard shortcuts, Storybook v2 states, and thin App smoke tests. Basic-mode keyboard behavior stays unchanged.

## Acceptance criteria

- [ ] Scientific keyboard: `(`, `)`, `^`, trig/log letter shortcuts (exact map documented in PR); v1 basic keys unchanged in Basic mode
- [ ] Storybook stories: Basic vs Scientific layout, DEG/RAD toggle, scientific error state, long-expression horizontal scroll
- [ ] App RTL smoke: mode toggle visible; one scientific calculation end-to-end; DEG label present in Scientific mode
- [ ] No regression in Basic-mode keyboard tests

## Blocked by

- #41 — Scientific unary functions and full keypad

## PM/PO assumptions

Not applicable.
