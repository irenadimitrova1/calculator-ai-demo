## Summary

- Extract calculation session logic into `src/lib/calculation-session.ts` with a pure `transition(state, action) => state` API
- Thin `useCalculator` to a `useReducer` adapter with no business rules
- Add table-driven Vitest suite covering PoC scenarios; slim `App.test.tsx` to smoke + one UI flow

Closes #24

**Parent story:** #21  
**Feature doc:** `docs/product/features/calculator-v1.md`

Checks passed at Build: typecheck, lint, tests (24), production build, Storybook build.

## Test plan

- [x] `npm run typecheck`
- [x] `npm run lint`
- [x] `npm test`
- [x] `npm run build`
- [x] `npm run build-storybook`
