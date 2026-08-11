# Calculator v1

**Owner:** PM / PO  
**Last updated:** <!-- TODO: YYYY-MM-DD -->

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
- Internal QA signs off that behavior matches a standard pocket calculator
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

- The number they're typing and the running result stay visible
- When something isn't allowed (like dividing by zero), show a clear error instead of a blank screen or crash

**Nice to have for power users**

- Keyboard: number keys, operators, Enter, Escape, Backspace where it makes sense

### Out of scope

- Scientific functions (sine, cosine, logarithms, etc.) — [Calculator v2](calculator-v2.md)
- A history of past calculations you can scroll through
- Different color themes or skins
- Memory still clears when you refresh the page (we can revisit later)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator PoC](calculator-poc.md)
- [Calculator v2](calculator-v2.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
