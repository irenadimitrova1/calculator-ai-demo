## Parent

#46 — [Spec: Calculator v3](https://github.com/irenadimitrova1/calculator-ai-demo/issues/46)

**Feature doc:** [`docs/product/features/calculator-v3.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v3.md)

## What to build

Polish Calculator v3 for reviewers and edge cases: Storybook history states, storage-failure notice, and App smoke tests.

When `localStorage` is unavailable, show a **one-time non-blocking notice** that history and memory will not survive refresh (session-only degrade path). Add Storybook stories for history panel populated, empty, at-cap (25 entries), and post-recall. App RTL smoke: complete a calculation → history row appears; recall from history; refresh restores history + memory.

## Acceptance criteria

- [ ] One-time notice when persistence adapter cannot use `localStorage`; app remains usable for session
- [ ] Storybook: history populated, empty, at-cap, post-recall states
- [ ] App smoke: equals appends history row; recall works; reload restores history + memory
- [ ] Mode and in-progress session reset on refresh (not persisted)
- [ ] No regression in Basic/Scientific calculator smoke tests

## Blocked by

- #53 — History panel UI and responsive layout

## PM/PO assumptions

Not applicable.
