# Calculator v4

**Owner:** PM / PO  
**Last updated:** 2026-08-12

## Purpose

Let people make the calculator feel like theirs — light or dark, plus a small set of color skins — with preferences that stick after refresh.

## Problem

The app still looks like one fixed demo skin. Storybook can flip themes for QA, but end users cannot. Dark-mode habits, accessibility contrast needs, and simple brand preference are unmet. Without product-level theming we look unfinished next to phone calculators that already offer appearance choices.

## Users

- **Everyday users** — prefer light or dark to match their OS or eyes
- **Demo and stakeholder audiences** — want the product to look polished and intentional
- **Users with contrast preferences** — need a readable option without a custom CSS editor

## Success metrics

- Users can switch light and dark from inside the running app (not only in Storybook)
- A small curated set of color skins is available and clearly previewable
- Appearance choice persists across refresh (local preference)
- Changing theme never breaks keypad layout, display readability, or history/scientific modes from earlier versions

## Scope

### In scope

**Light and dark**

- In-app toggle (or equivalent control) for light vs dark appearance
- Both modes keep display, keypad, and indicators readable

**Color skins**

- A short list of predefined skins (not an open-ended color picker)
- Skin choice is easy to find and change

**Persistence**

- Remember light/dark and skin locally across refresh

### Out of scope

- Full custom CSS, arbitrary color pickers, or white-label branding kits
- Per-button icon packs or layout skins that change calculator behavior
- Cloud-synced appearance profiles
- Calculation history and memory persistence — owned by [Calculator v3](calculator-v3.md) (coordinate if both ship nearby)

## Related

- [Feature doc → issues](../../process/feature-to-issues.md)
- [Calculator PoC](calculator-poc.md)
- [Calculator v1](calculator-v1.md)
- [Calculator v2](calculator-v2.md)
- [Calculator v3](calculator-v3.md)
- [Vision](../vision.md)
- [Roadmap](../roadmap.md)
- [GitHub Issues](https://github.com/irenadimitrova1/calculator-ai-demo/issues)
