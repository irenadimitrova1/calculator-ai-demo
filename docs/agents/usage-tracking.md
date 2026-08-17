# AI usage and cost tracking

Track tokens and dollar cost from `grill-with-docs` through story closure. Roll-up posts as a comment on the parent **`story`** GitHub issue when the last child ships.

## How it works

1. **Skills** set phase context (`set-context.mjs`) and register sessions on GitHub (`register-session.mjs`).
2. **Cursor hooks** (`.cursor/hooks.json`) append to a local ledger and auto-register when context includes a story issue.
3. **Reconcile** (`reconcile.mjs`) joins GitHub registry comments with the Cursor Team Admin API and posts a cost table (estimated model cost + billed amount).

The join key is **`conversation_id`** (hooks) ↔ **`conversationId`** (Admin API).

## Team collaboration

Each dev's machine keeps a local ledger (`.scratch/usage/ledger.jsonl`, gitignored). **GitHub issue comments** are the shared registry so Alice and Bob both contribute to the same story roll-up.

| Work | Register on |
|------|-------------|
| Spec chain (`grill-with-docs` → `/to-tickets`) | Parent **`story`** issue |
| Child ticket (`/plan`, Build, `/pr`) | That **child** issue |

## One-time setup

1. **Team Admin API key** — [Cursor Dashboard → API Keys](https://cursor.com/dashboard/api). Store in `.env.local`:

   ```
   CURSOR_ADMIN_API_KEY=your_key_here
   ```

2. **GitHub CLI** — `gh auth login` on each dev machine (registration uses `gh`).

3. **Enable hooks** — Cursor Settings → Hooks. Project hooks load from `.cursor/hooks.json` on clone.

4. **GitHub Actions** — add repo secret `CURSOR_ADMIN_API_KEY` (Settings → Secrets and variables → Actions). The [`usage-reconcile` workflow](../../.github/workflows/usage-reconcile.yml) posts the cost roll-up when a **`story`** issue is closed or when the last child PR merges.

## Commands

```bash
# Set workflow phase (skills call this)
node scripts/usage/set-context.mjs --phase plan --story 38 --child 41

# Register current session on GitHub (idempotent)
node scripts/usage/register-session.mjs --story 38 --child 41 --phase plan

# Preview cost roll-up (requires admin key)
node scripts/usage/reconcile.mjs --story 38

# Post roll-up comment on story issue
node scripts/usage/reconcile.mjs --story 38 --post

# Interim cost for one child ticket
node scripts/usage/reconcile.mjs --issue 41
```

## When roll-up runs

**Automatic (CI):**

- **Story closed** — when a parent **`story`** issue is closed, posts the roll-up immediately on that issue.
- **Last child PR merged** — when a PR merges and all implementation children are closed, posts the roll-up on the parent story (even if the story is still open).

**Manual:** Actions → *AI usage cost roll-up* → Run workflow (optional story #), or locally:

```bash
node scripts/usage/reconcile.mjs --story <N> --post
```

Adds `cost-reported` label to avoid duplicate comments on re-invoke.

## Limitations

- **Hourly API lag** — usage events aggregate hourly; re-run reconcile the next day for final cents.
- **Admin key** — only teammates with `CURSOR_ADMIN_API_KEY` can compute `$`; everyone sees registry comments and the posted roll-up.
- **Registration** — requires `gh` auth; missed registrations fall back to local ledger on the reconciling machine only.
- **Tab / Plan-only sessions** — only Agent/Composer sessions with hooks are tracked.
- **Est. cost** — `tokenUsage.totalCents` + Cursor Token Rate from the Admin API (list model cost, even on included usage). **Cost** — billed `chargedCents` (often $0 while still on included allowance).

## Related

- [Workflow](workflow.md) — engineering chain
- [Issue tracker](issue-tracker.md) — GitHub conventions
