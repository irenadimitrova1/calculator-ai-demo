# Calculator v8

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Let users save named formulas and simple macros so repeated expressions are one tap away instead of retyped every time.

## Problem

History (v3) remembers what you already ran, but not the reusable recipes people keep on sticky notes — tip calculations, homework templates, unit recipes. Without saved formulas, power users still maintain a side channel and treat our app as disposable.

## Users

- **Students** — keep course formulas handy during homework
- **Professionals** — repeat the same workplace expressions
- **Power everyday users** — personal shortcuts (tips, splits, conversions they use weekly)

## Success metrics

- A user can save an expression under a name and run or insert it later
- Simple placeholders or variables work for common “fill in the blank” cases
- Saved formulas persist locally across refresh
- Managing the list (rename, delete) is obvious; the feature does not require learning a programming language

## Scope

### In scope

**Named formulas**

- Save the current or edited expression with a user-chosen name
- Insert or run a saved formula from a list

**Simple variables**

- Lightweight placeholders (e.g. named slots the user fills when running) — not a full scripting language

**Persistence**

- Store formulas locally across refresh (builds on the persistence direction from v3)

### Out of scope

- A general-purpose scripting language or plugin API
- A marketplace or sharing gallery of community formulas
- Cloud sync of formula libraries
- Exporting calculation history as files — [Calculator v10](calculator-v10.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator v3](calculator-v3.md)
- [Calculator v5](calculator-v5.md)
- [Calculator v10](calculator-v10.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
