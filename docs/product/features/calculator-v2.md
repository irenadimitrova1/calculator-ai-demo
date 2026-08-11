# Calculator v2

**Owner:** PM / PO  
**Last updated:** <!-- TODO: YYYY-MM-DD -->

## Purpose

Extend the standard calculator into a scientific calculator — advanced math for students, engineers, and power users who need trig, logarithms, powers, and expression grouping on top of the v1 baseline.

## Problem

v1 covers everyday arithmetic and memory, but many users need functions beyond `+`, `-`, `*`, and `/`. Without scientific capabilities, they leave the app for a dedicated scientific calculator or another tool. v2 keeps the same UI foundation while adding the operations required for coursework, technical work, and more complex expressions.

## Users

- Students working through math, science, or engineering coursework
- Professionals who need occasional advanced functions without installing a separate app
- Demo audiences evaluating whether the product can grow from basic to scientific tier

## Success metrics

- All in-scope scientific functions return correct results for a documented test matrix (sample angles, logs, powers, nested parentheses)
- Degree/radian mode is visible and switching modes updates trig results accordingly
- Invalid inputs (e.g. log of zero, sqrt of negative in real mode) surface clear errors
- Scientific keypad layout remains usable on common viewport sizes
- Storybook covers scientific mode layout and representative function keys

## Scope

### In scope

**Trigonometry**

- `sin`, `cos`, `tan` (and inverse variants: `asin`, `acos`, `atan` where space allows)
- Degree / radian mode toggle with persistent indicator in the UI

**Powers and roots**

- Square (`x²`) and square root (`√`)
- General power (`xʸ` or `^`)
- Reciprocal (`1/x`)

**Logarithms and constants**

- Natural log (`ln`) and common log (`log`)
- Constants: `π`, `e` (insert into current entry)

**Expression grouping**

- Parentheses `(` `)` for nested evaluation
- Expression evaluation respects standard operator precedence and grouping

**Carried forward from v1**

- Basic operations, memory keys, clear controls, decimal input, sign toggle, percentage, and error handling — unless explicitly redesigned for scientific layout

**Layout and mode**

- Scientific keypad or panel (additional rows or toggle between standard and scientific views)
- Display long expressions with horizontal scroll or truncation rules documented in implementation

**Quality**

- Keyboard shortcuts for common scientific keys where practical
- Storybook stories for scientific layout and degree/radian mode

### Out of scope

- Graphing equations or plotting functions
- Unit conversion (length, temperature, currency)
- Programmable macros or custom formulas
- Complex numbers and matrix math
- Exporting calculation history

## Related

- [Calculator PoC](calculator-poc.md)
- [Calculator v1](calculator-v1.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
