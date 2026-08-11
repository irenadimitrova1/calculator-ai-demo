---
name: verify
description: Verification checklist — runs automatically at end of Build; optional /verify to re-validate after edits. No git writes.
disable-model-invocation: true
---

Validate the working tree on the feature branch before `/pr`. **Do not** commit, push, or open a PR.

## When this runs

| Trigger | Required? |
|---------|-----------|
| **End of Plan Build** | **Yes — automatic.** After implementing the plan, run this checklist before telling the user to `/pr`. No separate command. |
| **`/verify #N`** | **Optional.** Use when you changed code or docs **after** Build and want to re-validate before `/pr`. |

The checklist below is the same in both cases.

## Resolve the target issue

| Label | Role | Action |
|-------|------|--------|
| `story` | Parent spec | **Stop** — use a child ticket. |
| `in-progress` | Active ticket | Verify this issue. |
| `ready-for-agent` | Not started | **Stop** — run `/plan #N` first. |
| Other | Untriaged | Stop. |

## Preconditions

- On branch `issue-<N>-<slug>` linked to the ticket
- Working tree has changes to validate

## Checklist

**Discover commands** from `package.json` — do not guess. Skip only when the script does not exist yet (early scaffold tickets).

| Step | Typical command | When |
|------|-----------------|------|
| **Typecheck** | `npm run typecheck` / `tsc --noEmit` | Once TS exists |
| **Lint** | `npm run lint` | Once ESLint exists |
| **Unit tests** | `npm test` | Once Vitest exists |
| **Production build** | `npm run build` | Once app exists |
| **Storybook build** | `npm run build-storybook` | When Storybook configured |
| **Storybook stories** | Add/update `.stories.*` for changed UI | When UI components changed |
| **Format check** | `npm run format:check` | When configured |
| **Docs site** | `mkdocs build` | When `docs/` changed |

**Stop on red.** Fix and re-run until green.

### Code review

Run `/code-review` against ticket acceptance criteria.

### Update docs (`/domain-modeling`)

**Engineering section only:**

- Record new decisions from the build
- Set **`### Ticket progress`** row to `in-review`
- Set **`Status:`** to `in-progress` if not already

Update `CONTEXT.md` / ADRs only when warranted.

Do **not** commit doc changes — `/pr` commits everything together.

## Verify report

Present when checks finish (Build handoff or `/verify`):

```md
## Verify report — #N <title>

### Checks
| Check | Result |
|-------|--------|
| … | pass / fail / skipped |

### Code review
- Standards: …
- Spec: …

### Docs updated (uncommitted)
- …

### Ready for /pr
- Branch: `issue-<N>-<slug>`
- All required checks: yes / no
```

If checks failed, fix before `/pr`.

## Handoff

When green: run **`/pr #N`**.

If you edit code or docs after this, run **`/verify #N`** again before `/pr`.

Do **not** commit or push here.
