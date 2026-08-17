# /jira-tasks

**Dashboard name:** `jira-tasks`

**Description:** Split a Story into engineering Tasks — review breakdown, confirm, then publish to Jira.

## Body

Break a Story into **Tasks** — small vertical slices engineering can pick up one at a time. **Usually run by engineering after a PM story exists.** PMs may run it to preview the breakdown before handing off.

Publish only after AskQuestion approval.

### Gather

- Story key from the user (`PROJ-123`) or the Story created this session.
- Fetch the Story on the correct Jira site (body, epic, labels, status). The parent story implies site; if ambiguous, use site context from this chat or resolve from the story's browse URL host.
- Default: same **site**, project, epic, and labels as the Story. Task status: project default **(Recommended)** unless they change it.

If there is no Story key and none was created this session, **stop**. Tell them to run `/jira-story` first or pass a key like `PROJ-123`.

Discover Jira MCP tools. Auth if needed. Use the same **site context** (`cloudId` when supported) as the parent story.

### Draft slices

Each Task = one end-to-end slice a user could notice, sized for roughly one dev session. Avoid layer-only tickets (API-only, UI-only) unless the user insists.

Plain-language titles (what the user gets, not internal module names).

Numbered list in chat for each proposed task:

- Title
- What it delivers (one sentence)
- Blocked by (other task numbers, or "none — can start now")

### Review (iterate until approved)

AskQuestion — one call, four questions:

1. `tasks-granularity` — "Is this the right number of tasks?"
   - `About right` (Recommended) / `Too few — merge or add` / `Too many — combine` / `I'll describe`
2. `tasks-blocking` — "Does the order make sense?"
   - `Order looks correct` (Recommended) / `Wrong order (I'll describe)`
3. `tasks-merge-split` — "Combine or split any tasks?"
   - `No changes` (Recommended) / `Merge tasks` / `Split tasks` / `I'll describe`
4. `tasks-placement` — "Create under story KEY on the same Jira site, with same epic and labels?"
   - `Yes — same as the story` (Recommended)
   - `Change epic or labels` — on this site, re-fetch all open epics and all labels; suggest **(Recommended)** like `/jira-grill`
   - `I'll describe other placement`

Revise the list if needed; show the updated numbered list; repeat the four questions until all approve.

Then `tasks-publish-confirm`:

- `Publish N tasks to Jira` (Recommended)
- `Revise task titles or descriptions`
- `Cancel`

Create only after **Publish N tasks**.

### Create (dependency order)

Create blockers first on the **same Jira site** as the parent story.

Each Task description — plain headings, no nested code fences:

- `## Parent` — story key (and epic if any)
- `## What to build` — user-visible outcome
- `## Acceptance criteria` — checklist
- `## Blocked by` — task keys, or None — can start immediately

For each Task: type Task (or Sub-task only if requested and supported); link to Story; copy labels; transition if not default; native blocker links when MCP supports them, else list keys under **Blocked by**.

Reply with a simple table: task number, key, title, URL, blocked by. Stop.
