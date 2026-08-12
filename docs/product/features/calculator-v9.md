# Calculator v9

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Extend the calculator into advanced math territory — complex numbers, basic matrices, and core statistics/probability — for users who have outgrown scientific mode alone.

## Problem

v2 covers trig, logs, and parentheses, but college and engineering work often needs complex numbers, small matrices, and stats. Without them we plateau below “really advanced” and serious users keep a second tool open.

## Users

- **College STEM students** — linear algebra, circuits, statistics courses
- **Engineers and analysts** — occasional complex and matrix checks
- **Anyone evaluating depth** — wants proof we can grow past pocket scientific mode

## Success metrics

- Users can enter and compute with basic complex numbers without the app breaking
- Common small-matrix operations (e.g. add, multiply, determinant where in scope) work for homework-sized cases
- Statistics helpers (mean, median, standard deviation; combinations/permutations where the keypad allows) produce correct results
- Errors (singular matrix, invalid stats input) show clear messages
- This release does not pretend to be a full computer algebra system

## Scope

### In scope

**Complex numbers**

- Enter and calculate with basic complex values using a clear notation

**Matrices**

- Basic operations on small matrices suitable for coursework — not a full linear-algebra suite

**Statistics and probability**

- Mean, median, standard deviation
- Combinations and permutations where they fit the keypad without overcrowding

### Out of scope

- Full CAS / symbolic algebra suite
- Large-scale numerical libraries or GPU-bound workloads
- 3D graphing of complex surfaces — [Calculator v7](calculator-v7.md) stays 2D real functions
- Programmer bitwise mode — [Calculator v6](calculator-v6.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v6](calculator-v6.md)
- [Calculator v7](calculator-v7.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
