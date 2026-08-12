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
