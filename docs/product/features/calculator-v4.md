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

## Engineering specification

**Owner:** Engineering  
**Last updated:** 2026-08-18

_Sourced from PM sections above. `/to-spec` reads this section. `/to-tickets` reads this section and `## Questions`._

> **Frozen after grill:** Do not edit stack, behavior, UI, or constraints when PM answers — only **`### Ticket progress`** updates during delivery. PM **Answer** values go in **`## Questions`**.

### Stack

- **Same as v1–v3** — React + Vite + TypeScript, Tailwind + shadcn/ui, Storybook, Vitest + RTL
- **CSS tokens** — extend existing `:root` / `.dark` variables in `src/index.css`; each **color skin** adds a `data-skin` attribute on `<html>` with scoped overrides to **primary, accent, and ring** tokens (surfaces stay shadcn neutral)
- **Appearance module** — pure TypeScript (`src/lib/calculator-appearance/`): resolve defaults, read/write dedicated `localStorage` key (`calculator-appearance`), apply classes/attributes to `<html>`; export constants shared with boot script
- **Boot script** — small inline script in `index.html` reads storage / `prefers-color-scheme` and sets `html` `class` + `data-skin` before first paint (no wrong-theme flash); uses same key and fallback rules as appearance module
- **shadcn Popover** — add `@/components/ui/popover` for the appearance settings popover
- **No new dependencies** — reuse `@storybook/addon-themes` patterns; register skin variants in Storybook globals

### Behavior

- **Orthogonal controls:** Light/dark and color skin are **independent** — user picks one skin and toggles light or dark; each skin defines token overrides for **both** light and dark palettes
- **First visit default:** When no saved preference exists, light/dark follows `prefers-color-scheme`; skin defaults to **default** (neutral shadcn palette). After the user changes either, **remember** their choice across refresh (no ongoing OS re-sync)
- **Persistence:** Dedicated `localStorage` key `calculator-appearance` stores versioned JSON `{ version: 1, colorScheme: 'light' | 'dark', skin: string }` — separate from calculator history/memory and history-panel keys
- **Invalid storage:** Unknown or corrupt skin values fall back to `default`; corrupt JSON falls back to OS light/dark + `default` skin
- **Skin catalog:** _Pending PM/PO (`pm-q1-skin-catalog-size`). Assumption until answered:_ **3 skins** — `default` (neutral), `ocean` (blue accent), `forest` (green accent)
- **Apply on load:** Boot script hydrates before paint; React appearance module re-syncs on mount and handles user changes
- **Storage failure:** If `localStorage` is unavailable, appearance works for the **current session only** — no extra notice beyond v3's existing storage degrade banner
- **No calculation impact:** Appearance changes do not reset session, history, memory, or mode; only CSS tokens and `html` attributes change
- **Contrast:** No dedicated high-contrast skin in v4 — rely on light/dark plus readable shadcn token choices across all skins

### UI / UX

- **Settings entry:** Gear or palette icon on the **calculator card header** (alongside mode toggles) opens a **popover** with appearance controls — keeps keypad uncluttered
- **Light/dark control:** **Sun / moon icon toggle group** inside the popover (matches Basic/Scientific header pattern); applies immediately on change
- **Skin picker:** **Color swatch grid with labels** inside the popover — tap a swatch to apply; active skin visually highlighted; swatches preview each skin's accent on the current light/dark mode
- **Popover dismiss:** Click outside or Escape closes popover; appearance persists on close
- **Accessibility:** Gear/palette trigger and popover controls have accessible names; sun/moon toggle exposes pressed state
- **Layout safety:** Popover and header controls must not shrink keypad buttons or break history panel layout at `md` breakpoint; test Basic, Scientific, history visible/hidden combinations
- Carry forward v1–v3 display formatting, error presentation, and responsive history layout

### Constraints

- **Depends on v3:** Do not start v4 until the v3 **`story`** is closed — all v3 child tickets **`implemented`**. v4 layers on the full calculator + history layout
- PM out-of-scope still applies: no custom CSS editor, no cloud sync, no per-button icon packs, no layout skins that change behavior
- **Coordinate persistence:** Appearance uses its own key; do not bump calculator persistence schema v1 unless a future ADR consolidates keys
- **Tests:** Table-driven Vitest on appearance module (defaults, OS fallback, persist round-trip, invalid skin → default); integration test that toggle updates `html` classes/attributes; boot script hydration test; visual regression via Storybook stories per skin × light/dark
- **Storybook:** Extend theme decorator with skin globals; stories for each skin in light and dark alongside history/scientific layouts

### Ticket progress

| Issue | Title | Status |
|-------|-------|--------|
| [#67](https://github.com/irenadimitrova1/calculator-ai-demo/issues/67) | Appearance engine and in-app UI | in-review |
| [#68](https://github.com/irenadimitrova1/calculator-ai-demo/issues/68) | Storybook appearance matrix and App polish | pending |

### Open questions

_Engineering-internal only. Product questions for PM/PO go in `## Questions` — not here._

_None._

## Questions

**Owner:** Engineering (from `/grill-with-docs`)  
**Last updated:** 2026-08-18

_`/to-spec` → **`needs-info`**. PM replies → **`answered`**. **`/triage #N`** fills **Answer** here — never edits spec above._

| ID | Issue | Status |
|----|-------|--------|
| pm-q1-skin-catalog-size | [#66](https://github.com/irenadimitrova1/calculator-ai-demo/issues/66) | resolved |

### pm-q1-skin-catalog-size {#pm-q1-skin-catalog-size}

**Prompt:** How many color skins should v4 ship?

PM says "a short list" but not a count. This drives CSS token work, Storybook stories, and picker UI.

**Options:**

| id | label |
|----|-------|
| `three-skins` | 3 skins — default neutral + 2 accent palettes (e.g. blue, green) *(Recommended)* |
| `five-skins` | 5 skins — default + four distinct accent palettes |
| `two-skins` | 2 skins only — default neutral + one accent (minimal MVP) |
| `record-open` | Record as open question for PM/PO |

**Assumption (if blocked):** `three-skins` — 3 skins — default neutral + 2 accent palettes (e.g. blue, green)

**Status:** `resolved`

**Answer:** Four curated skins — **Classic** (default), **Baby Pink**, **Console**, **Retro / Vintage**; each ships light + dark (8 combinations). Graphite Pro, Warm Sand, High Contrast, Mint, Sunset, and open color picker out of scope.
