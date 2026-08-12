# Calculator v7

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Plot simple functions so students and technical users can see y = f(x) without leaving the calculator for a separate graphing tool.

## Problem

Scientific mode can compute a value at a point, but many homework and intuition tasks need a graph. Without plotting, users bounce to Desmos or a graphing calculator and we lose the “advanced” narrative we started in v2.

## Users

- **Students** — algebra, precalculus, and calculus courses that expect graphs
- **Teachers and tutors** — quick visual checks during explanation
- **Technical users** — rough shape of a function before deeper analysis elsewhere

## Success metrics

- A user can enter an expression in x and see a 2D plot
- Basic pan and zoom work well enough to inspect interesting regions
- Plotting at least one function clearly; multiple functions if the UI stays uncluttered
- Invalid expressions show a helpful message instead of a blank or broken chart

## Scope

### In scope

**Plotting**

- Graph y = f(x) from an expression the user enters
- Basic pan and zoom on the plot view

**Multiple functions**

- Support more than one function when it remains easy to read (e.g. distinct traces); do not force a dense overlay UI

**Tie-in to calculator**

- Reuse expression/scientific capability from earlier versions where practical

### Out of scope

- 3D graphs
- Full calculus visualization packs (Riemann sums, interactive derivatives as a product suite)
- Computer algebra system (CAS) / symbolic solve — beyond basic plotting
- Advanced math types (complex, matrices) as first-class plot citizens — [Calculator v9](calculator-v9.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v9](calculator-v9.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
