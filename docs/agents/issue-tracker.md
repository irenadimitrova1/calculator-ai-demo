# Issue tracker: GitHub

Issues and specs for this repo live as GitHub issues. Use the `gh` CLI for all operations.

## Conventions

- **Create an issue**: `gh issue create --title "..." --body "..."`. Use a heredoc for multi-line bodies.
- **Read an issue**: `gh issue view <number> --comments`, filtering comments by `jq` and also fetching labels.
- **List issues**: `gh issue list --state open --json number,title,body,labels,comments --jq '[.[] | {number, title, body, labels: [.labels[].name], comments: [.comments[].body]}]'` with appropriate `--label` and `--state` filters.
- **Comment on an issue**: `gh issue comment <number> --body "..."`
- **Apply / remove labels**: `gh issue edit <number> --add-label "..."` / `--remove-label "..."`
- **Assign**: `gh issue edit <number> --add-assignee @me`
- **Close**: `gh issue close <number> --comment "..."`

Infer the repo from `git remote -v` — `gh` does this automatically when run inside a clone.

## Pull requests as a triage surface

**PRs as a request surface: no.** _(Set to `yes` if this repo treats external PRs as feature requests; `/triage` reads this flag.)_

When set to `yes`, PRs run through the same labels and states as issues, using the `gh pr` equivalents:

- **Read a PR**: `gh pr view <number> --comments` and `gh pr diff <number>` for the diff.
- **List external PRs for triage**: `gh pr list --state open --json number,title,body,labels,author,authorAssociation,comments` then keep only `authorAssociation` of `CONTRIBUTOR`, `FIRST_TIME_CONTRIBUTOR`, or `NONE` (drop `OWNER`/`MEMBER`/`COLLABORATOR`).
- **Comment / label / close**: `gh pr comment`, `gh pr edit --add-label`/`--remove-label`, `gh pr close`.

GitHub shares one number space across issues and PRs, so a bare `#42` may be either — resolve with `gh pr view 42` and fall back to `gh issue view 42`.

## Parent vs child issues

| Label | Source | Implementable? |
|-------|--------|----------------|
| `story` | `/to-spec` parent / umbrella | No — context only; close when all children ship |
| `ready-for-agent` | `/to-tickets` child tracer bullet | Yes — `/plan` claims it |
| `in-progress` | Applied by `/plan` | Yes — on feature branch |

Child issues reference the parent under `## Parent` in the body. `/plan` on a `story` issue runs `/grill-me` to pick the next unblocked child.

## Branch and label lifecycle (per child ticket)

1. **`/plan` start** (ticket has `ready-for-agent`):
   - `git fetch origin main && git checkout -b issue-<N>-<slug> origin/main`
   - `gh issue edit <N> --add-assignee @me --remove-label ready-for-agent --add-label in-progress`
   - `gh issue comment <N> --body "Working branch: \`issue-<N>-<slug>\`"`
2. **Build** on that branch — at end, automatically run verify checklist — no commit
3. **`/verify`** *(optional)* — re-run checks after post-Build edits — no commit
4. **`/pr`** — commit, push, open PR, remove `in-progress`
5. **Merge** — `Closes #N` closes the child
6. **Last child closed** — close parent `story` and set feature doc `Status: done`

## PR conventions

- One PR per child ticket; branch name `issue-<N>-<slug>`
- Checks run at end of **Build** (verify checklist); optional **`/verify`** to re-run — not in `/pr`
- `/pr` commits, confirms with user, pushes, opens PR
- Commit/PR body includes `Closes #N`
- PR description links parent `story`, feature doc path, and note that checks passed at Build
- `/pr` comments the PR URL on the issue; issue closes on merge
- After `/pr`, run **`/clear`** before the next ticket

## When a skill says "publish to the issue tracker"

Create a GitHub issue.

## When a skill says "fetch the relevant ticket"

Run `gh issue view <number> --comments`.

## Wayfinding operations

Used by `/wayfinder`. The **map** is a single issue with **child** issues as tickets.

- **Map**: a single issue labelled `wayfinder:map`, holding the Notes / Decisions-so-far / Fog body. `gh issue create --label wayfinder:map`.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue (`gh api` on the sub-issues endpoint). Where sub-issues aren't enabled, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body. Labels: `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`). Once claimed, the ticket is assigned to the driving dev.
- **Blocking**: GitHub's **native issue dependencies** — the canonical, UI-visible representation. Add an edge with `gh api --method POST repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by -F issue_id=<blocker-db-id>`, where `<blocker-db-id>` is the blocker's numeric **database id** (`gh api repos/<owner>/<repo>/issues/<n> --jq .id`, _not_ the `#number` or `node_id`). GitHub reports `issue_dependencies_summary.blocked_by` (open blockers only — the live gate). Where dependencies aren't available, fall back to a `Blocked by: #<n>, #<n>` line at the top of the child body. A ticket is unblocked when every blocker is closed.
- **Frontier query**: list the map's open children (`gh issue list --state open`, scoped to the map's sub-issues / task list), drop any with an open blocker (`issue_dependencies_summary.blocked_by > 0`, or an open issue in the `Blocked by` line) or an assignee; first in map order wins.
- **Claim**: `gh issue edit <n> --add-assignee @me` — the session's first write.
- **Resolve**: `gh issue comment <n> --body "<answer>"`, then `gh issue close <n>`, then append a context pointer (gist + link) to the map's Decisions-so-far.
