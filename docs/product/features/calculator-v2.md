# Calculator v2

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Add a scientific mode for users who need more than everyday arithmetic — schoolwork, homework, light engineering — without making casual users wade through buttons they don't need.

## Problem

v1 is great for grocery math and quick totals, but students and technical users still reach for another app when they need sine, cosine, powers, or parentheses. We lose those users and we can't honestly say we cover "calculator" use cases end to end. v2 should feel like the scientific calculator they already carry in their backpack or phone case.

## Users

- **Students** — high school and college math, science, and engineering classes
- **Professionals** — occasional advanced math without installing a separate tool
- **Anyone evaluating us** — wants to see that we can grow from "basic" to "serious" calculator

## Success metrics

- A student can complete typical homework problems (trig, powers, logs, grouped expressions) using only our app
- Switching between degrees and radians is obvious and changes answers correctly
- Bad inputs (like the log of zero) show a helpful message, not a broken screen
- The extra buttons still fit on a normal laptop or tablet screen without feeling cramped
- v1 users who only need basic math aren't forced into a confusing layout

## Scope

### In scope

**Trigonometry**

- Sine, cosine, tangent — and the inverse versions where we have room on the keypad
- A clear way to choose **degrees vs radians**, with a label on screen so users know which mode they're in

**Powers and roots**

- Square a number
- Square root
- Raise one number to the power of another
- **1/x** (reciprocal)

**Logs and useful constants**

- Natural log and base-10 log
- Quick buttons for **π** and **e**

**Longer expressions**

- Parentheses so users can group parts of a calculation, e.g. `(2 + 3) × 4`
- Math should follow the usual order of operations people learn in school

**Everything from v1**

- Basic arithmetic, memory, clear buttons, decimals, percent, +/-, and error messages — unless we need to rearrange the layout for scientific mode

**Layout**

- Either more rows of buttons or a switch between "standard" and "scientific" view — whichever keeps both modes easy to use
- Long expressions should still be readable (scroll or shorten gracefully on small screens)

### Out of scope

- Graphing equations or drawing charts — [Calculator v7](calculator-v7.md)
- Converting units (miles to km, °F to °C, currency, etc.) — [Calculator v5](calculator-v5.md)
- Letting users save their own formulas or macros — [Calculator v8](calculator-v8.md)
- Advanced math (complex numbers, matrices) — [Calculator v9](calculator-v9.md)
- Downloading or emailing a history of calculations — [Calculator v10](calculator-v10.md)
- Programmer mode (hex, binary, bitwise) — [Calculator v6](calculator-v6.md)
- Calculation history panel and refresh persistence — [Calculator v3](calculator-v3.md)
- Themes and skins — [Calculator v4](calculator-v4.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator PoC](calculator-poc.md)
- [Calculator v1](calculator-v1.md)
- [Calculator v3](calculator-v3.md)
- [Calculator v4](calculator-v4.md)
- [Calculator v5](calculator-v5.md)
- [Calculator v6](calculator-v6.md)
- [Calculator v7](calculator-v7.md)
- [Calculator v8](calculator-v8.md)
- [Calculator v9](calculator-v9.md)
- [Calculator v10](calculator-v10.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)

## Engineering specification

**Owner:** Engineering  
**Last updated:** 2026-08-12

_Sourced from PM sections above. `/to-spec` reads this section. `/to-tickets` reads this section and `## Questions`._

> **Frozen after grill:** Do not edit stack, behavior, UI, or constraints when PM answers — only **`### Ticket progress`** updates during delivery. PM **Answer** values go in **`## Questions`**.

### Stack

- **Same as v1** — React + Vite + TypeScript, Tailwind + shadcn/ui, Storybook, Vitest + RTL
- **Dual evaluation engines** — v1 `calculation-session` immediate-execution path unchanged for **Basic mode**; new pure expression module (parse + PEMDAS evaluate) for **Scientific mode**
- **Scientific expression module** — custom pure TypeScript parser/evaluator in `src/lib/expression/` (no new dependencies): tokenize/parse infix expressions with parentheses, unary/binary ops, constants; PEMDAS + right-associative `^`; evaluate with degree/radian awareness for trig
- **`useCalculator` / session** — gains `mode: 'basic' | 'scientific'` and `angleUnit: 'deg' | 'rad'`; dispatches to the correct engine per mode

### Behavior

- **Dual engines:** **Basic mode** keeps all v1 behavior (immediate execution, full-typed-history expression trail, repeat equals, memory, percent, etc.). **Scientific mode** builds a parenthesized expression and evaluates with PEMDAS on equals.
- **Mode toggle:** User switches **Basic** ↔ **Scientific**; Basic shows the v1 keypad only; Scientific reveals additional function/operator rows. Mode choice is session-only (no refresh persistence until v3). **Switching modes clears the session** (AC-equivalent reset) because the engines are incompatible.
- **Angle unit:** Default **degrees** in Scientific mode; toggle to radians; on-screen **DEG** / **RAD** label always visible in Scientific mode.
- **Unary functions:** _Pending PM/PO (`pm-q1-unary-apply`). Assumption until answered:_ immediate unary on press — applies to the active number and **inserts the computed numeric result** into the building expression (not `sin(30)` syntax).
- **Scientific expression:** Parentheses `(` `)` supported; PEMDAS for `+` `−` `×` `÷` and power; **π** and **e** insert as expression tokens; binary power `x^y` supported.
- **Trig:** sin, cos, tan plus **sin⁻¹, cos⁻¹, tan⁻¹** keys on the scientific keypad.
- **Repeat equals:** Basic mode only (v1 behavior). Scientific mode evaluates the expression once per equals press — no repeat-equals.
- **Memory:** Shared **M** register across Basic and Scientific modes; memory keys work in both. Mode switch clears the calculation session but **does not** clear memory.
- **Percent:** Same v1 divide-by-100 semantics in both modes (per resolved v1 PM answer).
- **Power:** `^` is right-associative (`2^3^2` → `512`).
- **Errors:** Invalid scientific input (e.g. log of zero, √(negative), divide by zero) enters the same **error state** as v1 — active number shows `Error`, input blocked until AC/C.
- **Keyboard (Scientific mode):** Extend v1 keyboard — digits, `.`, `+`, `−`, `*`, `/`, `Enter`/`=`, `Escape` → AC, `Backspace`; add `(`, `)`, `^` for power, and letter shortcuts for trig/logs where practical (e.g. `s` sin, `c` cos, `t` tan — exact map in implementation).
- **v1 carry-forward:** Memory, clear keys, decimals, percent, sign toggle, keyboard (basic keys), and two-line display behavior unchanged in Basic mode.

### UI / UX

- **Mode toggle** control (e.g. segmented **Basic** / **Scientific**) above or beside the display — obvious which mode is active.
- **Scientific keypad** — extra rows for sin/cos/tan, sin⁻¹/cos⁻¹/tan⁻¹, **ln** / **log**, powers (√, x², x^y, 1/x), parentheses, π, e.
- **DEG/RAD indicator** on the display region in Scientific mode.
- **Expression display** in Scientific mode shows the building expression (including functions and parentheses); overflow uses **horizontal scroll** to the tail. After equals, **two-line layout** — full expression on top, result on active-number line (v1 pattern). Basic mode keeps v1 two-line behavior.
- **Card width:** Scientific mode uses a wider card (e.g. `max-w-sm` / `max-w-md`) than Basic (`max-w-xs`) to fit extra keys without unusably small buttons.
- Carry forward v1 display formatting (~12 visible digits, float-noise cleanup) and error presentation.

### Constraints

- **Depends on v1:** Do not start v2 implementation until the v1 **`story`** ([#21](https://github.com/irenadimitrova1/calculator-ai-demo/issues/21)) is closed — all v1 child tickets **`implemented`**. First v2 ticket ([#39](https://github.com/irenadimitrova1/calculator-ai-demo/issues/39)) blocks on #21.
- Build on shipped v1 session module; no stack changes
- PM out-of-scope still applies: no history panel, no themes, no persistence on refresh, no graphing/units/programmer mode
- **Tests:** Table-driven Vitest on expression parser/evaluator (PEMDAS, parens, trig deg/rad, domain errors); integration tests for mode switching and Basic-mode regression (v1 scenarios unchanged)
- **Storybook:** Calculator stories for Basic vs Scientific layouts, DEG/RAD toggle, scientific errors, long-expression scroll

### Ticket progress

| Issue | Title | Status |
|-------|-------|--------|
| [#39](https://github.com/irenadimitrova1/calculator-ai-demo/issues/39) | Scientific expression evaluator module | planned |
| [#40](https://github.com/irenadimitrova1/calculator-ai-demo/issues/40) | Mode toggle, dual-engine orchestrator, and scientific arithmetic UI | ready-for-agent |
| [#41](https://github.com/irenadimitrova1/calculator-ai-demo/issues/41) | Scientific unary functions and full keypad | ready-for-agent |
| [#42](https://github.com/irenadimitrova1/calculator-ai-demo/issues/42) | Scientific keyboard, Storybook v2, and App smoke tests | ready-for-agent |

Set **Status:** to `done` when all rows are **`implemented`**.

### Open questions

_None — product uncertainties tracked in `## Questions` below._

## Questions

**Owner:** Engineering (from `/grill-with-docs`)  
**Last updated:** 2026-08-12

_`/to-spec` → **`needs-info`**. PM replies → **`answered`**. **`/triage #N`** fills **Answer** here — never edits spec above._

| ID | Issue | Status |
|----|-------|--------|
| pm-q1-unary-apply | [#37](https://github.com/irenadimitrova1/calculator-ai-demo/issues/37) | resolved |

### pm-q1-unary-apply {#pm-q1-unary-apply}

**Prompt:** Unary functions — how should sin, √, x², 1/x, and log keys behave? This couples to the evaluation model but is a separate UX choice.

**Options:**

| id | label |
|----|-------|
| `immediate-unary` | Immediate unary — sin/cos/tan/√/x²/1/x apply to the active number on press (classic scientific keypad) *(Recommended)* |
| `expression-token` | Expression token — functions build the expression string; everything evaluates on equals |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `immediate-unary` — immediate unary apply on press until PM/PO confirms

**Answer:** `immediate-unary` — Immediate unary — sin/cos/tan/√/x²/1/x apply to the active number on press (classic scientific keypad)
