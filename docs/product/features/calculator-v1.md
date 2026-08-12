# Calculator v1

**Owner:** PM / PO  
**Last updated:** 2026-08-11

## Purpose

Turn the proof-of-concept into an everyday calculator — the kind people already know from their phone or desktop — with clear buttons, memory, and the basics done right.

## Problem

The PoC shows that math works, but it doesn't feel like a real calculator yet. If you mistype a digit, you can't fix it easily. You can't store a number and come back to it. There's no decimal point, no percent button, no way to flip a number to negative. People will get frustrated and won't trust the app for daily use.

## Users

- Anyone who wants quick math without opening another app
- People comparing us to the built-in calculator on their phone — v1 should feel familiar, not surprising
- Demo audiences deciding whether we're ready to call this a "real" product baseline

## Success metrics

- A new user can add, subtract, multiply, and divide — including decimals — without instructions
- Clear and memory buttons work the way users expect from other calculators
- Mistakes (like dividing by zero) show a friendly message instead of breaking the app
- Internal QA signs off that behavior matches a standard pocket calculator (including the built-in macOS/iOS calculator display and keyboard shortcuts)
- Users can complete a calculation using only the keyboard, without clicking buttons
- We're ready to discuss [Calculator v2](calculator-v2.md) without redoing the basics

## Scope

### In scope

**Fixing mistakes**

- **Clear / All Clear** — start over or wipe what's on screen
- **Clear entry** — fix the number you're currently typing without losing the rest of the calculation

**Memory**

- **Memory clear** — forget what's stored
- **Memory recall** — bring back what you stored
- **Memory add / subtract** — add or subtract the current number to/from memory
- Some visible sign that memory has something in it (e.g. a small "M" on screen)

**Everyday math**

- Plus, minus, multiply, divide (same as PoC, but polished)
- Decimal point — so amounts like `3.14` work
- Equals
- **+/-** — flip between positive and negative
- **%** — percentage, like on a normal calculator
- Chain several operations in a row (e.g. `5 + 3 × 2`) in a predictable way

**What users see**

- **Two-line display (macOS/iOS calculator behavior)** — top line shows the current expression as it builds (e.g. `5 + 3`); bottom line shows the number being typed or the running result; both lines stay visible and update as the user works
- When something isn't allowed (like dividing by zero), show a clear error instead of a blank screen or crash

**Keyboard input**

- Number keys (`0`–`9`), decimal point, operators (`+`, `-`, `*`, `/`), Enter (=), Escape (clear), and Backspace (clear entry or delete last digit) — same behavior as clicking the on-screen buttons
- Keyboard shortcuts work when the calculator has focus; no separate "keyboard mode" toggle

### Out of scope

- Scientific functions (sine, cosine, logarithms, etc.) — [Calculator v2](calculator-v2.md)
- A scrollable log of **past** completed calculations (the live expression on the top display line is in scope; a separate history panel is not) — [Calculator v3](calculator-v3.md)
- Different color themes or skins — [Calculator v4](calculator-v4.md)
- Memory still clears when you refresh the page — [Calculator v3](calculator-v3.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator PoC](calculator-poc.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v3](calculator-v3.md)
- [Calculator v4](calculator-v4.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)

## Engineering specification

**Owner:** Engineering  
**Last updated:** 2026-08-11

_Sourced from PM sections above. `/to-spec` reads this section for the parent spec. `/to-tickets` reads this section **and** `## Questions` below. **Do not edit** stack, behavior, UI, or constraints after `/grill-with-docs` — only **`### Ticket progress`** updates during delivery. PM answers go in **`## Questions`** only._

### Stack

- **Same as PoC** — React + Vite + TypeScript, Tailwind + shadcn/ui, Storybook, Vitest + RTL
- **Calculation session module** — new pure TypeScript module (`src/lib/calculation-session/` or similar) holding session state and transitions; `useCalculator` becomes a thin React adapter
- **Existing `calculate()`** — keep as the primitive for applying one operator to two numbers; session module orchestrates when to call it

### Behavior

- **Chaining model:** Immediate execution, left-to-right — macOS/iOS Calculator semantics. Example: `5 + 3 × 2 =` → `16`, not `11` (no PEMDAS until v2 expressions)
- **Repeat equals:** After `=`, pressing `=` again repeats the last operation with the same second operand (e.g. `8 + 2 = 10`, then `=` → `12`)
- **Display:** Expression line (top) shows the building trail; active number (bottom) shows the value being typed or the latest committed result — replaces PoC layout (top = typing, bottom = result-only)
- **Display formatting:** Format values for display — strip JS float noise (e.g. `0.1 + 0.2` → `0.3`), cap visible digits at ~12 with CSS ellipsis; internal math stays full IEEE double
- **Expression symbols:** Expression line and keypad labels use **×** and **÷**; keyboard still accepts `*` and `/`
- **Architecture:** Extract session logic from the PoC reducer into a testable pure module; hook dispatches actions and maps session snapshot to UI props
- **All Clear (AC):** Resets the entire session — operands, operator, both display lines, memory indicator context, and error state
- **Clear (C):** While building a calculation, clears only the active number; when a finished result is on screen, behaves like All Clear
- **Decimal input:** One decimal point per active-number entry; a leading `.` displays as `0.`; long values truncate visually per display formatting
- **Divide by zero / errors:** Enter error state — active-number line shows `Error`; block all keypad and keyboard input until All Clear or Clear
- **Memory (macOS/iOS):** `MC` clears stored memory; `MR` recalls memory into the active number; `M+` / `M−` add or subtract the current display value to/from memory; memory persists across calculations until `MC`; show **M** indicator when memory ≠ 0
- **Sign toggle (+/−):** Flip the sign of the active number only — while typing or on a finished result; expression line unchanged
- **Keyboard (focused calculator root):** Digits `0`–`9`, `.`, `+`, `-`, `*`, `/` mirror keypad; `Enter` or `=` → equals; `Backspace` → delete last digit of active number (behaves like **C** when active number is empty); `Escape` → **AC**; no keyboard-mode toggle
- **Percent (%):** _Pending PM/PO (`pm-q1-percent`). Assumption until answered:_ macOS/iOS operation-relative percent
- **Chaining expression trail:** _Pending PM/PO (`pm-q2-chaining-trail`). Assumption until answered:_ macOS/iOS rewired trail (e.g. `5 + 3 ×` → expression `8 ×`, bottom empty)

### UI / UX

- Two-line display aligned with macOS/iOS Calculator (expression line + active number)
- Expression line uses **×** / **÷** glyphs; active number and trail values use display formatting (~12 visible digits, float-noise cleanup)
- PoC phone-calculator layout and shadcn theme carry forward; new buttons added for clear, memory, decimal, %, +/-
- **AC** and **C** keys on keypad — both always visible (fixed labels, not a dynamic C/AC toggle)
- Error state: `Error` on the active-number line (bottom); expression line may retain the last trail until cleared
- Memory indicator: **M** visible when memory holds a non-zero value (macOS/iOS style)
- Keypad adds **AC**, **C**, memory row, decimal, **%**, **+/−**; carry forward PoC phone layout
- Auto-focus the calculator root on load so keyboard input works immediately
- `aria-live="polite"` on display region; expose memory **M** indicator to assistive tech

### Constraints

- Build on shipped PoC (#3–#6); no stack changes
- PM out-of-scope still applies: no scientific functions, no calculation history panel, no themes, no persistence on refresh
- **Tests:** Table-driven Vitest suites on the pure session module with named macOS/iOS reference scenarios (chaining, memory, percent, repeat equals, errors)
- **Storybook:** Extend Calculator stories/interactions for v1 states — memory, error, chaining, keyboard focus

### Ticket progress

| Issue | Title | Status |
|-------|-------|--------|
| [#24](https://github.com/irenadimitrova1/calculator-ai-demo/issues/24) | Extract calculation session module (PoC parity) | implemented |
| [#25](https://github.com/irenadimitrova1/calculator-ai-demo/issues/25) | Immediate-execution chaining, two-line display, and repeat equals | implemented |
| [#26](https://github.com/irenadimitrova1/calculator-ai-demo/issues/26) | Clear keys, decimal entry, sign toggle, and error state | implemented |
| [#27](https://github.com/irenadimitrova1/calculator-ai-demo/issues/27) | Memory operations and indicator | implemented |
| [#28](https://github.com/irenadimitrova1/calculator-ai-demo/issues/28) | Percent key | in-review |
| [#29](https://github.com/irenadimitrova1/calculator-ai-demo/issues/29) | Keyboard input, accessibility, and Storybook v1 states | in-review |

Set **Status:** to `done` when all rows are **`implemented`**.

### Open questions

_None — product uncertainties tracked in `## Questions` below._

## Questions

**Owner:** Engineering (from `/grill-with-docs`)  
**Last updated:** 2026-08-12

_`/to-spec` → **`needs-info`**. PM replies → **`answered`**. **`/triage #N`** records the **Answer** here (does **not** edit `## Engineering specification` above). **`/to-tickets`** uses open rows for blocking/assumptions; resolved **Answer** overrides assumption for implementation._

| ID | Issue | Status |
|----|-------|--------|
| pm-q1-percent | [#23](https://github.com/irenadimitrova1/calculator-ai-demo/issues/23) | resolved |
| pm-q2-chaining-trail | [#22](https://github.com/irenadimitrova1/calculator-ai-demo/issues/22) | resolved |

### pm-q1-percent {#pm-q1-percent}

**Prompt:** What should the **%** key do? macOS/iOS uses operation-relative percent (e.g. `200 + 10%` → `220`; `200 × 10%` → `20`), while other calculators divide the active number by 100 (`50` → `0.5`). QA will compare to “a normal calculator” — which reference wins?

**Options:**

| id | label |
|----|-------|
| `macos-ios-relative` | macOS/iOS operation-relative percent (e.g. `200 + 10%` → `220`) *(Recommended)* |
| `divide-by-100` | Divide the active number by 100 (e.g. `50` → `0.5`) |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `macos-ios-relative` — macOS/iOS operation-relative percent until PM/PO confirms

**Answer:** `divide-by-100` — Divide the active number by 100 (e.g. `50` → `0.5`)

### pm-q2-chaining-trail {#pm-q2-chaining-trail}

**Prompt:** After immediate execution on operator press, should the **expression line** show the macOS/iOS rewired trail (e.g. `5 + 3 ×` → top line `8 ×`, bottom empty) or keep the full typed history (`5 + 3 ×`) with the partial result on the bottom line?

**Options:**

| id | label |
|----|-------|
| `macos-ios-rewired` | macOS/iOS rewired trail (e.g. `5 + 3 ×` → expression `8 ×`, bottom empty) *(Recommended)* |
| `full-typed-history` | Keep full typed history on the expression line; partial result on the active-number line |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `macos-ios-rewired` — macOS/iOS rewired trail until PM/PO confirms

**Answer:** `full-typed-history` — Keep full typed history on the expression line; partial result on the active-number line (e.g. `5 + 3 ×` on top)
