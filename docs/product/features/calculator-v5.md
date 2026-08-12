# Calculator v5

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Add everyday unit conversion so users can change length, mass, temperature, volume, and time without leaving the calculator or opening a second tool.

## Problem

Scientific mode covers trig and powers, but homework, travel, cooking, and lab work still need “miles to km” or “°F to °C.” People bounce to another app mid-calculation and lose flow. Unit conversion is table stakes for an advanced calculator.

## Users

- **Students** — science and math homework with mixed unit systems
- **Travelers and everyday users** — quick length, temperature, and volume conversions
- **Professionals** — occasional conversions without a dedicated converter app

## Success metrics

- A user can convert within common categories (length, mass, temperature, volume, time) without instructions
- The converted value can be used as a normal calculator number for further math
- Switching category and units is obvious; wrong or incomplete selections do not crash the app
- Currency with live exchange rates is clearly not promised in this release

## Scope

### In scope

**Conversion categories**

- Length, mass, temperature, volume, and time — common units in each category
- Pick source unit, enter or use a value, pick target unit, see the result

**Calculator flow**

- Convert without leaving the product; result is usable as the active number for further calculation
- Errors (e.g. empty value) show a clear message

### Out of scope

- Live FX rates or banking-grade currency conversion (revisit later if needed)
- Saved custom conversion formulas — [Calculator v8](calculator-v8.md)
- Graphing — [Calculator v7](calculator-v7.md)
- Programmer / base conversions (hex, binary) — [Calculator v6](calculator-v6.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v6](calculator-v6.md)
- [Calculator v7](calculator-v7.md)
- [Calculator v8](calculator-v8.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
