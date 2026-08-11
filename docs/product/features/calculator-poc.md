# Calculator PoC

**Owner:** PM / PO  
**Last updated:** <!-- TODO: YYYY-MM-DD -->

## Purpose

Build a first working version of the calculator so we can see it, click it, and try basic math before we invest in a full product.

## Problem

Right now we only have plans on paper. Stakeholders need something they can actually open and use — even if it's simple — to agree we're building the right thing. We also want to learn early if anything blocks us from shipping later versions.

## Users

- **Stakeholders and leadership** — want a quick demo to say yes/no to the direction
- **PM / PO** — need something real to show in reviews and roadmap conversations
- **End users (later)** — not the focus yet; this version is mainly for internal validation

## Success metrics

- Someone on the team can open the calculator in a browser and use it without developer help
- Adding, subtracting, multiplying, and dividing two whole numbers works and shows the right answer
- The team agrees the look and feel is a reasonable starting point for v1
- We have confidence to move forward with [Calculator v1](calculator-v1.md)

## Scope

### In scope

**Getting started**

- A calculator that lives in this project (not a separate tool or mockup)
- A clean, modern look that we can build on later
- A way for design and QA to preview the calculator on its own, before it's wired into everything else

**What the calculator should do (minimum)**

- A screen that shows the number you're working with and the result
- Number buttons (0–9)
- Plus, minus, multiply, divide
- An equals button that gives you the answer
- Simple flow: type a number → pick an operation → type another number → press equals

### Out of scope

This is intentionally bare-bones. Everything below waits for a later release.

- Clear and reset buttons (fixing mistakes) — [Calculator v1](calculator-v1.md)
- Memory (saving a number for later) — [Calculator v1](calculator-v1.md)
- Decimals, percentages, switching positive/negative — [Calculator v1](calculator-v1.md)
- Helpful messages when something goes wrong (e.g. dividing by zero) — [Calculator v1](calculator-v1.md)
- Typing on the keyboard instead of only clicking — [Calculator v1](calculator-v1.md)
- Scientific math (sin, cos, log, etc.) — [Calculator v2](calculator-v2.md)
- Saving your last calculation when you refresh the page
- Fancy themes or customization

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator v1](calculator-v1.md)
- [Calculator v2](calculator-v2.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)

## Engineering specification

**Owner:** Engineering  
**Last updated:** 2026-08-11  
**Status:** in-progress

_Sourced from PM sections above. `/to-spec` and `/to-tickets` read only this section._

### Ticket progress

| Issue | Title | Status |
|-------|-------|--------|
| [#3](https://github.com/irenadimitrova1/calculator-ai-demo/issues/3) | Greenfield project scaffold | shipped |
| [#4](https://github.com/irenadimitrova1/calculator-ai-demo/issues/4) | Calculation module with tests | pending |
| [#5](https://github.com/irenadimitrova1/calculator-ai-demo/issues/5) | Browser calculator (full PoC behavior) | pending |
| [#6](https://github.com/irenadimitrova1/calculator-ai-demo/issues/6) | Storybook preview for design/QA | pending |

Set **Status:** to `done` when all rows are `shipped`.

### Stack

- **React + Vite + TypeScript** — greenfield app; calculator is the entire application (single page)
- **TypeScript** — strict mode enabled project-wide
- **ESLint** — full plugin set including accessibility (`eslint-plugin-jsx-a11y` or equivalent); strict rules enabled
- **Tailwind CSS + shadcn/ui** — component library and styling system
- **Storybook** — component preview and design QA; Tailwind theme applied in Storybook
  - Storybook addons: **a11y**, **theme switch** (light/dark), and other plugins relevant to the project
- **Testing utilities** — Vitest + React Testing Library (Vite-native); Storybook interaction/test tooling as relevant
- See [ADR-0001](../../adr/0001-react-vite-typescript.md) for framework rationale
- See [ADR-0002](../../adr/0002-tailwind-shadcn-storybook.md) for UI tooling rationale

### Behavior

- **North star:** Real product milestone — stakeholders sign off on look-and-feel, not a throwaway workflow demo
- **Calculation model:** Strict binary — one operator per equals press (no multi-operator chaining until v1)
- **Flow:** Operand → operator → operand → equals; after equals, the result becomes the first operand of the next calculation
- **Operands:** Whole numbers only (no decimal input until v1)
- **Results:** May be non-integer when division requires it (e.g. `7 ÷ 2` → `3.5`)
- **Divide by zero:** Show raw JavaScript result (`Infinity` / `NaN`) — no friendly message until v1; must not crash

### UI / UX

- **Styling:** Tailwind CSS with shadcn/ui components; **shadcn/ui default theme** with phone-calculator-inspired layout
- **Display:** Two lines — current operand on top, result below
- **Storybook:** Primary surface for design/QA preview; a11y and theme-switch addons enabled; Tailwind theme shared with app
- **Accessibility:** ESLint a11y rules in dev; Storybook a11y addon for visual review

### Constraints

- Calculator **is** the whole app for now — no separate host to wire into
- PM out-of-scope still applies: no clear/reset, memory, keyboard, scientific functions, persistence on refresh

### Open questions

_None._
