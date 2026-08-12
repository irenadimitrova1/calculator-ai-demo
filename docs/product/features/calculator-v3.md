# Calculator v3

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Keep a usable log of past calculations and remember what matters across a page refresh — so people can pick up where they left off instead of retyping everything.

## Problem

After v1 and v2, the calculator is capable, but every completed equation disappears into the void. Refresh the page and memory is gone too. Users who check their work, reuse a previous result, or bounce between tabs lose trust and waste time. Competitors already show a scrollable history; without it we still feel like a demo.

## Users

- **Everyday users** — want to glance back at “what did I just calculate?” without starting over
- **Students and professionals** — reuse intermediate results from longer problem sets
- **Anyone evaluating us** — expects persistence and history before calling the product “done”

## Success metrics

- After equals, the expression and result appear in a scrollable history list
- Tapping (or selecting) a history entry puts that value back into the active display for further math
- Refreshing the page keeps history and memory available locally — no account required
- Users can clear history when they want a clean slate
- History stays readable with a sensible cap (oldest entries drop off) so the UI never feels endless

## Scope

### In scope

**History panel**

- A scrollable log of **completed** calculations (expression + result)
- Select an entry to recall its result into the active number (ready for the next operation)
- Clear all history in one action
- Cap the number of stored entries so the list stays manageable

**Persistence (local only)**

- Survive page refresh: calculation history and memory value
- No sign-in or cloud account — browser-local storage is enough for this release

**Everything from prior versions**

- Everyday and scientific calculator behavior continue to work; history records completed results from those modes

### Out of scope

- Cloud sync or multi-device accounts
- Downloading, emailing, or sharing history — [Calculator v10](calculator-v10.md)
- Different color themes or skins — [Calculator v4](calculator-v4.md)
- Saving named formulas for reuse — [Calculator v8](calculator-v8.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator PoC](calculator-poc.md)
- [Calculator v1](calculator-v1.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v4](calculator-v4.md)
- [Calculator v10](calculator-v10.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
