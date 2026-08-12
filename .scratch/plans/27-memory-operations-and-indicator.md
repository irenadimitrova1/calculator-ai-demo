# Plan: #27 — Memory operations and indicator

**Issue:** [#27](https://github.com/irenadimitrova1/calculator-ai-demo/issues/27)  
**Parent:** [#21](https://github.com/irenadimitrova1/calculator-ai-demo/issues/21) — Spec: Calculator v1  
**Branch:** `issue-27-memory-operations-and-indicator`  
**Feature doc:** `docs/product/features/calculator-v1.md`

## Goal

Add macOS/iOS-style calculator memory: MC, MR, M+, M− on the keypad; memory persists across calculations until MC; show an **M** indicator when memory ≠ 0, exposed to assistive technology. Session logic lives in the pure calculation-session module; UI is thin wiring.

## Decisions (from grill-me)

| Decision | Choice |
|----------|--------|
| M+ / M− when active number empty | Use `runningTotal` when available; otherwise **0** |
| M+ / M− with partial result on bottom | Use displayed active number (`Number(activeNumber)`) |
| MR | Replace active number with `formatDisplay(memory)`; expression line unchanged |
| AC | **Preserves** memory — only MC clears it |
| Memory keys in error state | **Blocked** (same as digits/operators) |
| M indicator placement | Top-left of display area (macOS/iOS style) |
| M indicator a11y | Dedicated element with `aria-label` (e.g. "Memory stored"), visible only when memory ≠ 0 |
| Keypad row | New row **above** AC / C / +/− / . |
| M when memory is 0 or −0 | **Hide** indicator |
| Out of scope | Session tests + keypad + indicator + hook wiring only — keyboard shortcuts and Storybook are **#29** |

## Acceptance criteria (from issue)

- [ ] Memory row on keypad: MC, MR, M+, M−
- [ ] Memory persists across calculations until MC (no persistence on page refresh)
- [ ] M indicator visible when memory ≠ 0 (macOS/iOS style)
- [ ] Memory indicator exposed to assistive tech
- [ ] Session tests cover memory store, recall, add/subtract, and clear scenarios

## Implementation steps

### 1. Extend `src/lib/calculation-session.ts`

Add `memory: number` to `CalculationSessionState` (default `0` in `initialState`).

Add actions:

```ts
| { type: 'memoryClear' }
| { type: 'memoryRecall' }
| { type: 'memoryAdd' }
| { type: 'memorySubtract' }
```

Add helper:

```ts
export function hasStoredMemory(memory: number): boolean {
  return memory !== 0 && !Object.is(memory, -0)
}
```

Add operand resolver for M+ / M−:

```ts
function resolveMemoryOperand(state: CalculationSessionState): number {
  if (!isActiveEmpty(state.activeNumber)) {
    return Number(state.activeNumber)
  }
  if (state.runningTotal !== null) {
    return state.runningTotal
  }
  return 0
}
```

**Transition rules:**

- **Error phase:** memory actions are no-ops (return state unchanged), same as digits/operators.
- **memoryClear:** set `memory` to `0`.
- **memoryRecall:** set `activeNumber` to `formatDisplay(state.memory)`; leave `expressionLine`, `phase`, and calculation fields unchanged.
- **memoryAdd / memorySubtract:** `memory = memory ± resolveMemoryOperand(state)`; leave display/calculation fields unchanged.
- **allClear:** reset calculation fields to `initialState` values but **preserve** `memory`.
- **clear** from error: reset to `initialState` but **preserve** `memory` (or use a shared reset helper that keeps memory).

Export `hasStoredMemory` for the hook/UI.

### 2. Thin adapter — `src/hooks/useCalculator.ts`

- Import `hasStoredMemory`.
- Add `pressMemoryClear`, `pressMemoryRecall`, `pressMemoryAdd`, `pressMemorySubtract` dispatchers.
- Return `hasMemory: hasStoredMemory(state.memory)` alongside existing fields.

### 3. Keypad — `src/components/calculator/Keypad.tsx`

Add a new top row (above AC / C / +/− / .):

| MC | MR | M+ | M− |

- Wire `onMemoryClear`, `onMemoryRecall`, `onMemoryAdd`, `onMemorySubtract` props.
- Use `aria-label` values: `memory clear`, `memory recall`, `memory add`, `memory subtract`.
- Match existing button sizing (`h-14 text-lg`) and secondary variant for memory keys.

### 4. Display — `src/components/calculator/Display.tsx`

- Add `hasMemory: boolean` prop.
- Top-left **M** label when `hasMemory` is true (macOS/iOS style).
- Dedicated a11y element, e.g. `<span aria-label="Memory stored" className="...">M</span>` — hidden when `hasMemory` is false (`aria-hidden` or conditional render).

### 5. Wire — `src/components/calculator/Calculator.tsx`

Pass memory handlers from hook to Keypad; pass `hasMemory` to Display.

### 6. Session tests — `src/lib/calculation-session.test.ts`

Add table-driven scenarios:

| Scenario | Assert |
|----------|--------|
| M+ stores active number | memory updated, display unchanged |
| M− subtracts active number from memory | memory updated |
| M+ with empty active + runningTotal | uses runningTotal |
| M+ with empty active, no runningTotal | uses 0 |
| MR recalls into active number | activeNumber = formatted memory |
| MC clears memory | memory = 0 |
| AC preserves memory | calculation reset, memory unchanged |
| Memory survives equals / chaining | memory unchanged after calculation |
| Memory ops blocked in error | state unchanged |
| hasStoredMemory(0) and hasStoredMemory(-0) | false |

## Testing seams

- **Primary:** `calculation-session.test.ts` — pure transition tests (no React).
- **Smoke:** existing app/component tests should still pass; no new Storybook or keyboard tests in this ticket.

## Out of scope (#29)

- Keyboard shortcuts for memory keys
- Storybook memory interaction story
- localStorage / persistence on refresh

## Files touched

| File | Change |
|------|--------|
| `src/lib/calculation-session.ts` | memory state, actions, transitions, `hasStoredMemory` |
| `src/lib/calculation-session.test.ts` | memory scenario table |
| `src/hooks/useCalculator.ts` | memory dispatchers + `hasMemory` |
| `src/components/calculator/Keypad.tsx` | memory row |
| `src/components/calculator/Display.tsx` | M indicator + a11y |
| `src/components/calculator/Calculator.tsx` | wire props |
| `docs/product/features/calculator-v1.md` | ticket progress → `planned` |
