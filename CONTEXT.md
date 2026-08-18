# Calculator

A browser-based calculator that grows from a proof-of-concept through everyday and scientific modes.

## Language

**Calculation**:
A single binary operation: first operand, operator, second operand, then equals. One calculation per equals press in the PoC.
_Avoid_: Expression, equation

**Operand**:
One of the two whole numbers entered for a calculation.
_Avoid_: Input, term

**Result**:
The value shown on the display after equals is pressed.
_Avoid_: Answer, output

**Display**:
The on-screen readout where operands and the result are shown.
_Avoid_: Screen, readout

**Operator**:
One of add, subtract, multiply, or divide — the action between two operands.
_Avoid_: Operation (when meaning the symbol), op

**Expression line**:
The top display row showing the calculation trail as it builds (e.g. `5 + 3 ×`).
_Avoid_: Top line, history line

**Active number**:
The value on the bottom display row — the number currently being typed or the latest committed result.
_Avoid_: Bottom line, current input, readout

**Immediate execution**:
Chaining model where each new operator commits the pending operation left-to-right, matching macOS/iOS Calculator (not PEMDAS).
_Avoid_: Chain mode, sequential evaluation

**Calculation session**:
The full in-memory state of an in-progress calculation — operands, pending operator, display strings, memory, and error status.
_Avoid_: Calculator state, reducer state

**All Clear (AC)**:
Resets the entire calculation session — operands, operator, display lines, and error state — back to empty.
_Avoid_: Reset, full clear

**Clear (C)**:
Clears only the active number while a calculation is in progress; after a finished result is shown, behaves like All Clear.
_Avoid_: CE, clear entry (when meaning the C key)

**Error state**:
Session status after an invalid operation (e.g. divide by zero). The active-number line shows `Error`. Digit, decimal, operator, and sign-toggle input clear the session (memory preserved) and start fresh — macOS/iOS recovery. Equals, memory keys, percent, and backspace stay blocked until All Clear or Clear.
_Avoid_: Error mode, fault state

**Memory**:
A stored number that persists across calculations until Memory clear. Updated via memory add/subtract using the current display value.
_Avoid_: Stored value, register

**Memory indicator**:
The on-screen **M** label shown when memory holds a non-zero value.
_Avoid_: M badge, memory flag

**Sign toggle (+/−)**:
Flips the sign of the active number only — while typing or on a finished result; does not change the expression line.
_Avoid_: Negate, polarity button

**Display formatting**:
Rules for turning computed values into strings on the expression and active-number lines — strip JS float noise and cap visible digits (~12) while internal math stays full precision.
_Avoid_: Rounding mode, pretty print

**Repeat equals**:
After equals completes a calculation, pressing equals again repeats the last operation using the same second operand (macOS/iOS behavior).
_Avoid_: Repeat operation, re-equals

**Basic mode**:
The everyday calculator layout and behavior from v1 — immediate execution, v1 keypad, no scientific functions.
_Avoid_: Standard mode, normal mode

**Scientific mode**:
The expanded calculator mode with trig, logs, powers, parentheses, and PEMDAS evaluation on equals.
_Avoid_: Advanced mode, sci mode

**PEMDAS evaluation**:
Expression evaluation that respects parentheses and operator precedence (multiply/divide before add/subtract) — used in Scientific mode only.
_Avoid_: Order of operations, BODMAS

**Angle unit**:
Whether trigonometry uses degrees or radians; toggled in Scientific mode with an on-screen DEG/RAD label. Defaults to degrees.
_Avoid_: Angle mode, trig unit

**Calculation history**:
The scrollable log of past **completed** calculations, separate from the in-progress expression line. Survives page refresh via browser-local storage.
_Avoid_: History panel, log list

**History entry**:
One row in calculation history — the full expression string and its formatted result (e.g. `5 + 3 × 2 = 16`). Only successful equals presses create entries.
_Avoid_: History item, log row

**History recall**:
Selecting a history entry clears the expression line, puts that entry's result into the active number, and starts a fresh entry phase for further math.
_Avoid_: Replay, re-run

**History cap**:
The maximum number of stored history entries (25). When exceeded, the oldest entry is removed before appending the newest.
_Avoid_: Max history, limit

**Local persistence**:
Browser-local storage (`localStorage`) that restores calculation history and memory after page refresh. Does not persist mode, angle unit, or in-progress session state.
_Avoid_: Saved state, offline sync

**Appearance preference**:
The user's chosen light/dark mode and color skin. Persisted in a dedicated browser-local key, separate from calculation history and memory.
_Avoid_: Theme settings, user theme

**Color skin**:
A predefined accent palette (e.g. neutral default, blue, green) applied via CSS token overrides. Independent of the light/dark toggle — each skin defines both light and dark variants.
_Avoid_: Theme pack, color theme

**Light/dark mode**:
Whether the calculator uses light or dark surface colors. On first visit follows `prefers-color-scheme`; after the user picks, the choice sticks across refresh.
_Avoid_: Dark mode toggle, theme mode
