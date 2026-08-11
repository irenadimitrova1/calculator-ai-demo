# Calculator PoC

**Owner:** PM / PO  
**Last updated:** <!-- TODO: YYYY-MM-DD -->

## Purpose

Proof-of-concept for a calculator app — validate the React/TypeScript stack and basic arithmetic before v1.

## Problem

<!-- TODO: What user need does this address? -->

## Users

<!-- TODO: Who benefits from this feature? -->

## Success metrics

<!-- TODO: Measurable outcomes -->

## Scope

### In scope

**Project setup**

1. Setup a React app with TypeScript in the existing repository.
2. Setup ESLint and all relevant plugins. Use the default strict configs.
3. Setup Storybook and relevant plugins.
4. Use Tailwind CSS and Shadcn.

**Calculator functionality**

Minimal UI to prove end-to-end arithmetic — enough to click buttons and see a result, not a production-ready calculator.

- **Display** — show the current operand and result after `=`
- **Digit input** — `0`–`9` via on-screen buttons
- **Operations** — `+`, `-`, `*`, `/` between two operands (evaluate on `=`)
- **Equals** — `=` computes the current expression
- **Operand flow** — enter first number → operator → second number → `=` (chaining multiple operations is optional; document chosen behavior)
- **Storybook** — at least one story showing the default calculator layout with working arithmetic

### Out of scope

Deferred to later versions — PoC only validates stack and basic math.

- Memory keys (`MC`, `MR`, `M+`, `M-`) — [Calculator v1](calculator-v1.md)
- Clear / entry controls (`C`, `AC`, `CE`), decimal point, `%`, `+/-` — [Calculator v1](calculator-v1.md)
- Keyboard support, error states (e.g. divide by zero), and polished UX — [Calculator v1](calculator-v1.md)
- Scientific functions (trig, log, powers, parentheses) — [Calculator v2](calculator-v2.md)
- Persistence, calculation history, themes beyond default Shadcn styling

## Related

- [Calculator v1](calculator-v1.md)
- [Calculator v2](calculator-v2.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)