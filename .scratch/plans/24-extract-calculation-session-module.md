# Plan: #24 — Extract calculation session module (PoC parity)

**Issue:** [#24](https://github.com/irenadimitrova1/calculator-ai-demo/issues/24)  
**Parent:** [#21](https://github.com/irenadimitrova1/calculator-ai-demo/issues/21) — Spec: Calculator v1  
**Branch:** `issue-24-extract-calculation-session-module`  
**Feature doc:** `docs/product/features/calculator-v1.md`

## Goal

Move all calculation session logic out of `useCalculator` into a pure TypeScript module with a `transition(state, action) => state` API. Browser behavior stays identical to the shipped PoC; the hook becomes a thin React adapter.

## Decisions (from grill-me)

| Decision | Choice |
|----------|--------|
| Module layout | Single file: `src/lib/calculation-session.ts` |
| State naming | PoC names: `phase`, `topLine`, `bottomLine`, `firstOperand`, `operator` |
| Test strategy | Migrate PoC scenarios to session tests; slim `App.test.tsx` to smoke |
| Test fixture shape | Table rows: `{ name, actions[], expected: { topLine, bottomLine } }` |
| Public exports | `transition`, `initialState`, `CalculationSessionState`, `CalculationSessionAction` |

## Acceptance criteria (from issue)

- [ ] Pure calculation session module with typed state, actions, and `transition`
- [ ] `useCalculator` delegates all session logic to the module (no business rules in hook)
- [ ] App behavior matches shipped PoC: digit entry, operator selection, equals, post-result chaining
- [ ] Table-driven Vitest suite on session module covers PoC reference scenarios
- [ ] Existing PoC user flows still pass in the browser

## Implementation steps

### 1. Create `src/lib/calculation-session.ts`

Lift the reducer from `src/hooks/useCalculator.ts` verbatim into a pure module:

```ts
// Types
type Phase = 'firstOperand' | 'secondOperand' | 'result'

export type CalculationSessionState = {
  phase: Phase
  firstOperand: number | null
  operator: Operator | null  // import from @/lib/calculation
  topLine: string
  bottomLine: string
}

export type CalculationSessionAction =
  | { type: 'digit'; digit: number }
  | { type: 'operator'; operator: Operator }
  | { type: 'equals' }

export const initialState: CalculationSessionState = { ... }

function appendDigit(...) { ... }  // private

export function transition(
  state: CalculationSessionState,
  action: CalculationSessionAction,
): CalculationSessionState { ... }
```

- Keep `calculate()` import from `@/lib/calculation` — session orchestrates when to call it.
- No React imports in this file.

### 2. Thin out `src/hooks/useCalculator.ts`

Replace inline `State`, `Action`, `reducer`, `initialState`, and `appendDigit` with imports from `@/lib/calculation-session`:

```ts
import { initialState, transition } from '@/lib/calculation-session'

export function useCalculator() {
  const [state, dispatch] = useReducer(transition, initialState)
  // pressDigit / pressOperator / pressEquals unchanged — dispatch actions
  return { topLine: state.topLine, bottomLine: state.bottomLine, ... }
}
```

Hook responsibilities only:
- Wire `useReducer`
- Map `state.topLine` / `state.bottomLine` to return props
- Expose `pressDigit`, `pressOperator`, `pressEquals` callbacks

### 3. Add `src/lib/calculation-session.test.ts`

Table-driven Vitest suite. Helper to fold actions:

```ts
function runScenario(actions: CalculationSessionAction[]) {
  return actions.reduce(transition, initialState)
}
```

Migrate these PoC reference scenarios from `App.test.tsx`:

| Scenario | Actions (abbreviated) | Expected |
|----------|----------------------|----------|
| Digit entry | `1`, `2` | top `12`, bottom `''` |
| Full calculation | `2`, `+`, `3`, `=` | top `''`, bottom `5` |
| Post-result chaining | `2`, `+`, `3`, `=`, `+`, `4`, `=` | bottom `9` |
| Divide by zero | `5`, `÷`, `0`, `=` | bottom `Infinity` |

Also cover edge cases already in reducer logic:
- Leading zero replacement (`0` then `5` → `5`)
- Operator change in `secondOperand` phase when `topLine` is empty
- No-op equals when preconditions not met
- Post-result digit clears session and starts fresh
- Post-result operator chains from `bottomLine` result

Use `describe.each` or `it.each` with named rows.

### 4. Slim `src/App.test.tsx`

Keep:
- Render smoke (calculator display + equals button present)
- Optionally one end-to-end click flow as integration guard

Remove scenarios now covered by `calculation-session.test.ts` (typing, full calc, chaining, divide-by-zero).

### 5. Verify no UI changes

- `Calculator.tsx`, `Display.tsx`, `Keypad.tsx` — no changes expected
- Manual browser check: digit → operator → operand → equals, then chain from result

## Testing seams

| Layer | File | What it proves |
|-------|------|----------------|
| Pure session | `calculation-session.test.ts` | All PoC behavior via action sequences |
| Primitive math | `calculation.test.ts` | Unchanged |
| Integration smoke | `App.test.tsx` | App renders; optional one click-through |
| Manual | Browser | Visual parity with PoC |

Run: `npm test` (or project Vitest command) — all suites green.

## Out of scope (later tickets)

- v1 display swap (expression line top, active number bottom) — #25
- Immediate-execution chaining, repeat equals — #25
- Clear keys, decimal, sign toggle, error state — #26
- Memory — #27
- Percent — #28
- Keyboard, a11y, Storybook v1 — #29
- Renaming `topLine`/`bottomLine` to domain vocabulary
- Splitting module into a folder

## Files touched

| File | Change |
|------|--------|
| `src/lib/calculation-session.ts` | **New** — pure transition module |
| `src/lib/calculation-session.test.ts` | **New** — table-driven PoC scenarios |
| `src/hooks/useCalculator.ts` | **Edit** — thin adapter only |
| `src/App.test.tsx` | **Edit** — slim to smoke |
| `docs/product/features/calculator-v1.md` | **Edit** — ticket progress → `planned` |
