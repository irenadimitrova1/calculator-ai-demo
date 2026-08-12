# Calculator v6

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Add a programmer mode for base conversion and bitwise work — the mode developers already expect on advanced phone and desktop calculators.

## Problem

Developers and CS students still leave our app for hex, binary, and bitwise math. Without programmer mode we stop short of “advanced calculator” and miss a clear, self-contained audience that other products already serve.

## Users

- **Software developers** — quick base conversion and bitwise checks while coding
- **CS students** — homework involving binary, hex, and bitwise operators
- **Anyone evaluating us** — expects programmer mode on a serious multi-mode calculator

## Success metrics

- Users can enter and view values in binary, octal, decimal, and hexadecimal
- Bitwise AND, OR, XOR, NOT, and shifts work with a visible word size (e.g. 8 / 16 / 32 / 64-bit)
- Switching bases updates the display correctly without losing the underlying value (within the selected word size)
- Casual users who only need standard or scientific mode are not forced into programmer layout

## Scope

### In scope

**Bases**

- Binary, octal, decimal, and hex entry and display
- Clear indicator of the active base

**Bitwise operations**

- AND, OR, XOR, NOT, and bit shifts
- Selectable word size with an on-screen indicator

**Layout**

- A distinct programmer view or mode switch so standard/scientific users are not overwhelmed

### Out of scope

- Full IDE features, disassembly, or debugging
- Floating-point IEEE bit inspection as a primary feature
- Unit conversion (physical units) — [Calculator v5](calculator-v5.md)
- Graphing — [Calculator v7](calculator-v7.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v5](calculator-v5.md)
- [Calculator v7](calculator-v7.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
