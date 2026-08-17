# /jira-grill

**Dashboard name:** `jira-grill`

**Description:** PM-friendly intake: pick Jira site, grill the idea, suggest epics and labels, confirm before any ticket is created.

## Body

Sharpen a product idea into Jira-ready decisions. **Primary audience: non-technical PMs.** Interview in plain language until shared understanding. This command does not create Jira issues.

### Tone

- Short sentences. User outcomes, not implementation layers.
- Do not ask the PM for project keys, epic keys, label strings, site URLs you could list, or status names you can list from Jira.
- Do not ask the PM to read code or name files.

### Facts vs decisions

Finding facts is your job. Decisions are the PM's.

Look up via Jira MCP (discover tools with GetMcpTools `jira|atlassian` first; auth if needed):

- Accessible Jira Cloud **sites** (if MCP exposes them)
- Visible projects on the **chosen site** (key + friendly name)
- **All open epics** in the project — key + epic title/summary (not keys alone)
- **All labels** used in the project (or site-wide if the API exposes them)
- Issue types, components, versions when relevant
- Workflow statuses / default status for Story
- Assignees (display names, not account IDs in the UI)

Read the team **site catalog** before site pick:

- Installed team plugin **jira-pm-intake** → `jira-sites.json` at plugin root
- Or repo path: `docs/cursor-team/marketplace/plugins/jira-pm-intake/jira-sites.json`

Each catalog entry: `id`, `name`, `url`, optional `defaultProjectKey`, optional `cloudId`.

If no Jira MCP server is available, stop and say so. Do not fake issues.

### Session state

After site pick, keep for the rest of this chat: `siteId`, `siteName`, `siteUrl`, `cloudId` (if resolved), optional `defaultProjectKey`. Every later MCP call uses this site. Do not switch sites without an explicit PM **Change Jira site**.

### Design tree

Work in **rounds**. The **frontier** is every decision whose prerequisites are settled. Ask the whole frontier in **one** AskQuestion call. Wait. Recompute. Repeat.

Put **(Recommended)** on your best option with a brief reason. Chat is framing only — decisions live in AskQuestion.

### Product frontier (every round until empty)

Cover, as they unblock:

- Who is this for?
- What problem are we solving?
- What is in scope for this story?
- What is explicitly out of scope?
- How will we know it worked? (success / acceptance in user language)
- Dependencies or blockers the PM already knows
- Open questions for stakeholders

Skip facts you already fetched. Defer questions that depend on unanswered ones in this round.

### Between-round gate (always)

After each product round, one AskQuestion with both:

- `round-additions` — "Anything we didn't cover yet?"
  - `Nothing to add — continue` (Recommended)
  - `I want to add more (I'll type it)`
- `round-open-questions` — "Anything we should leave open on the ticket?"
  - `No open questions` (Recommended)
  - `Add open questions (I'll type them)`

### Site pick (once product frontier is empty, before project)

One AskQuestion — `jira-site`:

- `prompt` — "Which Jira workspace should this story go in?"
- Options from **jira-sites.json** as `name — url` with **(Recommended)** on the best match (open repo folder name, chat context, `defaultProjectKey` hint).
- Always include:
  - `Paste a Jira site or issue URL (I'll type it)` — parse `https://…atlassian.net` or issue key host; resolve `cloudId` via MCP if needed
  - `Show all sites from Jira` — if MCP lists accessible sites not in the catalog, add them as options

If the PM pasted a URL, confirm the resolved site in one line before continuing.

### Project pick (after site is locked)

One AskQuestion:

- `jira-project` — "Which Jira project should this story live in?" on the **chosen site**
  - Options = every visible project as `KEY — Name`
  - **(Recommended)** on catalog `defaultProjectKey` or best match from context

After project is chosen, fetch **all** open epics and **all** labels for that project on that site before the suggestion round.

### Suggestion round — epics and labels

Show a short **PM summary** in chat (title idea, problem, scope, success). Then one AskQuestion:

**Epic** — `jira-epic-suggest`

- `prompt` — "Which epic should this story sit under?" Include your top 1–3 matches as options: `KEY — Epic title` **(Recommended)** on the best match + one-line why. Always include:
  - `No epic`
  - `Create a new epic (I'll name it)`
  - `Show all open epics` — follow-up listing every open epic (key + title)

**Labels** — `jira-labels-suggest`

- `prompt` — "Which labels should we attach?" `allow_multiple: true`. Options = suggested labels **(Recommended)** with one-line why + every other label from the full list + `No labels`. Cap visible options at ~15; add `Show more labels` if needed.

**Optional in the same call** (only if the PM needs them):

- `jira-status` — default workflow start **(Recommended)** + other statuses
- `jira-priority` — from project metadata; default **(Recommended)**
- `jira-assignee` — `Unassigned` **(Recommended)** + display names

Add sprint, component, fix-version only when those fields exist and the PM cares.

If they picked **Create a new epic**, one follow-up AskQuestion for epic name + one-line goal (plain language).

### Revise before finish

Before closing the grill, show the **PM summary sheet** in chat:

- Jira site: name — url
- Story title (draft)
- Problem (2–3 sentences)
- In scope / Out of scope (bullets)
- Success / acceptance (bullets)
- Project: KEY — name
- Epic: KEY — title (or new epic name, or none)
- Labels: list
- Status, priority, assignee if set
- Open questions

AskQuestion `grill-revise`:

- `Looks good — ready for /jira-story` (Recommended)
- `Change Jira site`
- `Change the title`
- `Change problem or scope`
- `Change success / acceptance criteria`
- `Change epic or labels`
- `Change status, priority, or assignee`
- `Keep grilling the idea`

If they pick **Change Jira site**, re-run **Site pick** then **Project pick** and refresh epic/label suggestions.

If they pick another **Change** option, apply the edit, refresh epic/label suggestions when story text changed, update the summary sheet, and ask `grill-revise` again.

### Done

When `Looks good — ready for /jira-story`: tell them to run **/jira-story** in the same chat. Do not create issues here.
