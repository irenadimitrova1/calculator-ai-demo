# Architecture Decision Records

ADRs record significant technical decisions and their context.

## Format

Files use sequential numbering: `0001-slug.md`, `0002-slug.md`, etc.

ADRs are created lazily — only when a decision is actually made.

| ADR | Title |
|-----|-------|
| [0001](0001-react-vite-typescript.md) | React + Vite + TypeScript for the calculator app |
| [0002](0002-tailwind-shadcn-storybook.md) | Tailwind, shadcn/ui, and Storybook for UI development |

## Template

When adding the first ADR, follow the format in the domain-modeling skill (`ADR-FORMAT.md` in `.agents/skills/domain-modeling/`).

## Adding to the wiki

1. Create `docs/adr/0001-your-decision.md`.
2. Add an entry under **Engineering → ADRs** in [`mkdocs.yml`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/mkdocs.yml).
