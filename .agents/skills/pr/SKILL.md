---
name: pr
description: Commit, push, and open PR for one child ticket — after Build verify passed. Confirm, then /clear.
disable-model-invocation: true
---

Ship **one child ticket** after verification passed (automatic at end of Build, or optional `/verify` after post-Build edits). Commit all changes, push, open PR. **Do not** run build/lint/tests here.

## Resolve the target issue

| Label | Role | Action |
|-------|------|--------|
| `story` | Parent spec | **Stop** — `/pr` a child ticket. |
| `in-progress` | Active ticket on feature branch | Ship this issue. |
| `ready-for-agent` | Not started | **Stop** — run `/plan` then Build first. |
| Other | Untriaged | Stop. |

### Already merged

If issue `#N` is **closed** and all sibling children (same `## Parent`) are closed, close the parent **`story`** issue and update feature **`Status:`** to `done`. Then tell the user to **`/clear`**. Do not open another PR.

## Preconditions

- On branch `issue-<N>-<slug>`
- Verify checklist passed (during Build, or via optional `/verify` if you edited after Build)
- Docs updated in working tree
- User explicitly invoked `/pr`

If code changed since the last verify run, tell the user to run **`/verify #N`** first.

---

## Phase 1 — Prepare commit

1. Confirm branch: `issue-<N>-<slug>`
2. Stage all changes (code, tests, Storybook, docs)
3. Draft commit message — subject + body with `Closes #N`
4. Draft PR title and body:
   - Summary
   - `Closes #N`
   - Parent `story` #M
   - Feature doc path
   - Note: checks passed at Build (or re-verified)

Do **not** commit yet.

---

## Phase 2 — Ship report

```md
## Ship report — #N <title>

### Branch
`issue-<N>-<slug>`

### Commit
**Subject:** …
**Body:** Closes #N

### PR
**Title:** …
**Files:** N files (summary)

### Labels
- Remove `in-progress` from #N after PR opened
- Doc row → **`in-review`**
- On merge: GitHub Action **Label implemented on merge** (`.github/workflows/issue-implemented-label.yml`) adds **`implemented`** to issues closed by the PR; update doc row → **`implemented`**
```

---

## Phase 3 — Confirm before push

Use **`AskQuestion`**:

- **`id`** — `pr-confirm`
- **`prompt`** — *"Commit, push, and open PR?"*
- **`options`** —
  - `Commit, push, and open PR (Recommended)`
  - `Revise commit or PR message (I'll type feedback)`
  - `Cancel — I'll keep working locally`

**Do not** push until user picks **Commit, push, and open PR**.

---

## Phase 4 — Push and open PR

1. Commit with agreed message (`Closes #N` in body)
2. `git push -u origin HEAD`
3. `gh pr create` with agreed title and body
4. `gh issue comment <N> --body "PR: <url>"`
5. `gh issue edit <N> --remove-label in-progress`
6. Update **`### Ticket progress`** row to **`in-review`**

Do **not** manually close `#N` — `Closes #N` closes it on merge.

---

## Phase 4b — After merge

When `#N` is **closed** (PR merged) or re-invoked post-merge:

1. **Label** — CI applies **`implemented`** automatically when the PR merges (`issue-implemented-label` workflow). Only run `gh issue edit <N> --add-label implemented` if the label is still missing (workflow failed or PR merged before the workflow existed).
2. Update **`### Ticket progress`** row to **`implemented`**

---

## Phase 5 — Close parent story (when last child done)

After PR is opened, check **sibling** child issues (same `## Parent` in body):

- If **all** siblings are closed, **or** all except `#N` are closed and this PR will close `#N` on merge — comment on parent **`story`**: *"Last child PR opened — close this story when #N merges."*

When **all** child issues are **closed** (after merge — user may re-invoke `/pr #N` or you detect via `gh issue view`):

1. `gh issue close <story> --comment "All child tickets implemented."`
2. Set feature doc **`Status:`** to `done`

If all siblings closed now (e.g. re-run after merge), close story immediately.

---

## Phase 6 — Clear

Tell the user explicitly:

> **`/clear`** — start fresh for the next ticket (`/plan #M` on a new branch).

Do not start the next ticket in the same context.

---

## Out of scope

- Build, lint, tests (verify checklist — runs at end of Build, or optional `/verify`)
- Planning (`/plan`)
- Committing during Plan Build
