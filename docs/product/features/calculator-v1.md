# Calculator v1

**Owner:** PM / PO  
**Last updated:** <!-- TODO: YYYY-MM-DD -->

## Purpose

Evolve the PoC into a fully usable standard calculator — memory keys, clear controls, and the everyday features users expect from a basic desktop or phone calculator.

## Problem

The PoC proves arithmetic works, but it is not yet a complete calculator. Users cannot clear a mistaken entry without starting over, store intermediate results in memory, or use common helpers like sign toggle and percentage. v1 closes that gap so the app feels familiar and dependable for daily use.

## Users

- Anyone who needs quick arithmetic without opening a separate app or spreadsheet
- Demo viewers evaluating whether the product can ship a polished baseline experience

## Success metrics

- All in-scope buttons and operations work correctly in manual testing
- Memory operations (store, recall, clear) behave consistently across chained calculations
- Divide-by-zero and other invalid inputs show a clear error state instead of crashing
- Calculator UI is covered by Storybook stories for primary states (idle, active input, error, memory indicator)

## Scope

### In scope

**Clear and entry controls**

- `C` / `AC` — clear current entry or reset the calculator
- `CE` — clear entry (last number being typed) without wiping the full expression

**Memory**

- `MC` — memory clear
- `MR` — memory recall
- `M+` — add displayed value to memory
- `M-` — subtract displayed value from memory
- Visual indicator when memory holds a non-zero value

**Standard operations and input**

- Operations: `+`, `-`, `*`, `/` (carried forward from PoC)
- Decimal point support
- `=` — evaluate the current expression
- `+/-` — toggle sign of the current entry
- `%` — percentage (apply percent to current value in context of the active operation)
- Chained calculations (e.g. `3 + 4 * 2` following standard precedence or immediate execution — document chosen behavior in implementation)

**Display and feedback**

- Show current input and running result
- Show a clear error state for invalid operations (e.g. division by zero)

**Quality**

- Keyboard support for digits, operators, Enter, Escape, and Backspace where applicable
- Storybook stories for main calculator states and key interactions

### Out of scope

- Scientific functions (trig, log, powers) — see [Calculator v2](calculator-v2.md)
- Graphing or equation history
- Themes beyond the existing design system setup from PoC
- Persistence across page reloads (memory resets on refresh)

## Related

- [Calculator PoC](calculator-poc.md)
- [Calculator v2](calculator-v2.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
