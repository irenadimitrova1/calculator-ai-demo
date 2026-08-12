# Calculator v10

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Let users take their work with them — export and share calculation history — and add a light AI assist that explains a selected result or error, matching the “AI demo” promise without becoming a chatbot product.

## Problem

History stays trapped in the browser. Students cannot paste a clean log into homework; professionals cannot drop a CSV into a report. Separately, the project name promises AI, but nothing yet helps interpret a result or a confusing error. We need export plus a focused assist — not an unbounded chat agent.

## Users

- **Students** — export or copy history for assignments and study notes
- **Professionals** — share a calculation trail with teammates
- **Demo audiences** — want a credible, bounded AI moment tied to real calculator work

## Success metrics

- Users can copy or download history in a share-friendly format (e.g. text and/or CSV)
- Selecting a history entry (or error) can produce a short AI explanation or next-step hint — demo quality, not a full tutor
- AI assist stays optional and scoped; the calculator remains fully usable without it
- No accounts or multi-user collaboration are required for the core export path

## Scope

### In scope

**Export and share**

- Copy history to the clipboard
- Download history as text and/or CSV (or similarly simple portable formats)
- Works with the history model from [Calculator v3](calculator-v3.md)

**Light AI assist**

- Short explanation of a selected calculation or error
- Optional suggestion of a sensible next step (e.g. “try All Clear” or “check units”) — keep responses brief
- Graceful fallback when AI is unavailable

### Out of scope

- User accounts, cloud sync, or multi-user real-time collaboration
- Unbounded chat agent, homework solver, or always-on copilot
- Emailing from inside the app as a required path (download/copy is enough)
- Formula marketplace — [Calculator v8](calculator-v8.md)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator v3](calculator-v3.md)
- [Calculator v8](calculator-v8.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
