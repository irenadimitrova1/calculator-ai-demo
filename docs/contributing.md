# Contributing to the wiki

This wiki is built from Markdown files in the `docs/` folder and published automatically to GitHub Pages.

## PM / PO workflow (no Git CLI)

1. Open the [live wiki](https://irenadimitrova1.github.io/calculator-ai-demo/).
2. Navigate to the page you want to change.
3. Click **Edit this page** (top-right) — this opens the GitHub web editor.
4. Make your changes and propose them:
   - **Create a pull request** (recommended) — someone reviews and merges.
   - **Commit directly to `main`** — only if you have write access and the change is small.
5. After merge to `main`, the site rebuilds automatically in ~1–2 minutes.

## Who owns what

| Section | Typical owner | Examples |
|---------|---------------|----------|
| `docs/product/` | PM / PO | Vision, roadmap, feature specs (sections above `## Engineering specification`) |
| `docs/product/features/*.md` → `## Engineering specification` | Engineering | Technical spec appended by `/grill-with-docs`; read by `/to-spec` and `/to-tickets` |
| `docs/process/` | PM / PO / team lead | Planning rituals, Definition of Ready |
| `docs/engineering/` | Engineering | Engineering overview, links to technical docs |
| `docs/adr/` | Engineering | Architecture decision records |
| `docs/agents/` | Engineering / agents setup | Issue tracker config, triage labels |
| `CONTEXT.md` (repo root) | Engineering | Domain glossary (agents read this) |

## Engineering: feature doc → issues

PM writes feature specs in `docs/product/features/`. Engineering converts approved docs to GitHub Issues via the agent skill chain. See [Feature doc → issues](process/feature-to-issues.md).

## Adding a new page

### New feature spec

1. Copy [`docs/product/features/TEMPLATE.md`](product/features/TEMPLATE.md) to `docs/product/features/<your-feature-slug>.md`.
2. Fill in the PM sections (through `## Related`). Leave `## Engineering specification` for engineering (`/grill-with-docs`).
3. Add a nav entry in [`mkdocs.yml`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/mkdocs.yml) under **Product → Features**.
4. Open a PR with both changes.

### Other pages

1. Create a new `.md` file under the right folder (e.g. `docs/process/my-process.md`).
2. Add an entry to the `nav` section in [`mkdocs.yml`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/mkdocs.yml) at the repo root.
3. Open a PR with both changes.

## Adding a new ADR

ADRs live in `docs/adr/` using the format `0001-slug.md`. See the [ADR index](adr/index.md) for details. Add the new file and a nav entry in `mkdocs.yml`.

## Local preview (developers)

```bash
pip install -r requirements.txt
mkdocs serve
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) to preview changes before pushing.

## One-time GitHub Pages setup

After the first successful docs deploy workflow run, enable Pages in the repo:

1. Go to **Settings → Pages** on GitHub.
2. Under **Build and deployment**, set Source to **Deploy from a branch**.
3. Select branch **`gh-pages`**, folder **`/ (root)`**.
4. Save. The wiki will be live at [https://irenadimitrova1.github.io/calculator-ai-demo/](https://irenadimitrova1.github.io/calculator-ai-demo/).
