**Feature doc:** [`docs/product/features/calculator-v2.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md)  
**Engineering spec:** [`## Engineering specification`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/product/features/calculator-v2.md#engineering-specification)  
**ADRs:** [ADR-0001](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/adr/0001-react-vite-typescript.md), [ADR-0002](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/docs/adr/0002-tailwind-shadcn-storybook.md)

## Problem Statement

Calculator v1 covers everyday arithmetic well, but students and technical users still need another app for homework-style math: trigonometry, logarithms, powers, parentheses, and school order of operations. Without scientific mode, we cannot honestly claim end-to-end calculator coverage, and evaluators cannot see the product grow from "basic" to "serious."

## Solution

Add **Scientific mode** alongside unchanged **Basic mode** (v1 behavior). A **Basic / Scientific** toggle keeps casual users on the familiar v1 keypad while power users get an expanded scientific keypad, DEG/RAD angle control, and a custom expression evaluator with PEMDAS. Basic mode retains immediate-execution chaining; Scientific mode builds expressions evaluated on equals. Shared memory persists across modes; switching modes clears the in-progress calculation but not memory.

## User Stories

1. As a student, I want to switch to Scientific mode, so that I can do homework problems without leaving the app.
2. As a student, I want sin, cos, and tan keys, so that I can evaluate trigonometry.
3. As a student, I want sin⁻¹, cos⁻¹, and tan⁻¹ keys, so that I can work inverse trig problems.
4. As a student, I want to choose degrees or radians with a visible DEG/RAD label, so that I know which unit my trig answers use.
5. As a student, I want degrees as the default angle unit, so that high-school problems work without extra setup.
6. As a student, I want parentheses in expressions like `(2 + 3) × 4`, so that I can group operations correctly.
7. As a student, I want math to follow school order of operations (PEMDAS) in Scientific mode, so that `(2 + 3) × 4` equals `20`.
8. As a student, I want x², √, x^y, and 1/x keys, so that I can do powers and roots.
9. As a student, I want ln and log (base-10) keys, so that I can evaluate logarithms.
10. As a student, I want π and e keys, so that I can use common constants without typing long decimals.
11. As a student, I want chained powers like `2^3^2` to evaluate as `512` (right-associative), so that results match standard math convention.
12. As a casual user, I want Basic mode to look and behave exactly like v1, so that I am not forced into a confusing scientific layout.
13. As a casual user, I want a clear Basic / Scientific toggle, so that I always know which mode I am in.
14. As a user, I want switching between Basic and Scientific to reset the current calculation, so that incompatible engines do not produce garbage state.
15. As a user, I want memory (MC/MR/M+/M−) to work in both modes with one shared register, so that I can store a value in Basic and recall it in Scientific.
16. As a user, I want mode switching to clear the calculation but not memory, so that stored values survive a mode change.
17. As a user, I want the % key to divide by 100 in both modes (v1 semantics), so that percent behavior stays consistent.
18. As a user evaluating the product, I want Scientific mode on a wider card with readable buttons, so that the keypad does not feel cramped on laptop or tablet.
19. As a user, I want long scientific expressions to scroll horizontally, so that I can see the tail of what I typed on small screens.
20. As a user, I want the expression on top and the result on the bottom after equals in Scientific mode, so that the display matches the familiar two-line pattern from v1.
21. As a user, I want invalid operations (log of zero, √(negative), divide by zero) to show `Error` and block further input until AC/C, so that the app never crashes or shows nonsense.
22. As a keyboard user, I want scientific shortcuts for parentheses, power, and trig functions in Scientific mode, so that I can work without clicking every button.
23. As a keyboard user, I want Basic-mode keyboard behavior unchanged, so that v1 shortcuts still work.
24. As a user, I want repeat-equals in Basic mode only, so that v1 chaining behavior is preserved.
25. As a user in Scientific mode, I want equals to evaluate the expression once with no repeat-equals, so that PEMDAS evaluation is predictable.
26. As a developer, I want Basic-mode regression tests to keep passing unchanged, so that v1 behavior is not accidentally broken.
27. As a demo audience member, I want Storybook stories for Basic vs Scientific layouts, DEG/RAD, errors, and long-expression scroll, so that UI states are reviewable without manual clicking.

## Implementation Decisions

- **Dual evaluation engines:** Basic mode continues using the existing immediate-execution **calculation session** module unchanged. Scientific mode uses a new pure TypeScript **expression** module (parse + PEMDAS evaluate). No new npm dependencies for math.
- **Expression module interface:** Accept an expression string (or token stream) plus `angleUnit: 'deg' | 'rad'`; return a numeric result or a typed domain error. Support parentheses, binary `+ − × ÷ ^`, constants π and e, unary trig/log/sqrt/square/reciprocal as applied values in the expression string, and right-associative `^`.
- **Session orchestrator:** Extend the calculator hook/session layer with `mode: 'basic' | 'scientific'` and `angleUnit: 'deg' | 'rad'`. Dispatch keypad/keyboard actions to the correct engine. Mode switch triggers AC-equivalent session reset without clearing memory.
- **Unary function behavior (interim assumption — `needs-info` #TBD):** On press, apply the unary operation to the active number and **insert the computed numeric result** into the building expression (not `sin(30)` syntax). Pending PM confirmation via `pm-q1-unary-apply`.
- **Constants π and e:** Insert as expression tokens, not immediate display replacement.
- **Display:** Scientific mode shows building expression with horizontal scroll on overflow; after equals, expression line retains full expression and active-number line shows formatted result. DEG/RAD indicator visible in Scientific mode only.
- **Layout:** Segmented Basic / Scientific toggle; Scientific mode uses a wider card than Basic; scientific keypad adds rows for trig, inverse trig, ln/log, powers, parentheses, π, e.
- **Error state:** Reuse v1 error state semantics — `Error` on active-number line, input blocked until AC/C.
- **Persistence:** Mode and angle unit are session-only (no localStorage until v3).
- **Stack:** React + Vite + TypeScript, Tailwind + shadcn/ui, Storybook, Vitest + RTL — unchanged from v1.

## Testing Decisions

**What makes a good test:** Assert externally visible outcomes (display strings, mode labels, evaluation results, error state) — not internal parser data structures or private reducer fields.

**Seams (confirmed):**

1. **Expression module (primary)** — table-driven Vitest: PEMDAS, parentheses, trig in deg/rad, powers (including right-associative `^`), constants, domain errors. Pure functions; no React.
2. **Session orchestrator** — reducer-style tests for mode toggle, dual-engine dispatch, mode-switch reset, shared memory, scientific actions. Same style as existing calculation-session tests.
3. **Basic regression** — existing calculation-session test suite must pass unchanged in CI.
4. **Thin UI smoke** — a few App RTL tests (mode toggle, one scientific calculation, DEG label) plus Storybook stories for layout states; not the main verification surface.

**Prior art:** `calculation-session.test.ts` (table-driven session scenarios), `calculation.test.ts` (operator primitive), `App.test.tsx` (end-to-end UI smoke), `Calculator.stories.tsx` (visual states).

## Out of Scope

- Graphing (v7), unit conversion (v5), saved formulas (v8), complex/matrix math (v9), export/share (v10), programmer mode (v6), calculation history panel and refresh persistence (v3), themes (v4).
- Repeat-equals in Scientific mode.
- Specific error messages beyond v1 `Error` text.
- Cloud sync, accounts, or multi-device state.

## Further Notes

- **Open PM question:** Unary function UX (`pm-q1-unary-apply`) — see linked `needs-info` issue. Implementation may proceed on documented assumption (immediate unary with numeric insert).
- **Depends on v1:** Scientific mode builds on the shipped calculation session module and v1 display/keypad patterns. Complete or merge in-flight v1 tickets before Scientific UI work.
- **Domain glossary:** Basic mode, Scientific mode, PEMDAS evaluation, Angle unit — see `CONTEXT.md`.
