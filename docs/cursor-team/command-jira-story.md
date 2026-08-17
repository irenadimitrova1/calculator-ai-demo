# /jira-story

**Dashboard name:** `jira-story`

**Description:** Create the Jira Story after grill — full preview, easy PM edits, site + epic + labels.

## Body

Publish **one** Story to Jira from the current conversation. **Primary audience: non-technical PMs.** Optional Epic if grill chose "create new epic". Do not publish Tasks here — engineering usually runs **/jira-tasks**.

### Prerequisites

**Jira site** must be set (name, url, `cloudId` if known) from `/jira-grill` in this chat. If missing, run the **Site pick** from `/jira-grill` first (catalog + paste URL).

If placement (project, epic, labels, status) was not set, run **Project pick** and **Suggestion round** from `/jira-grill` on that site.

If the idea was not grilled, AskQuestion:

- `Run /jira-grill first` (Recommended when the idea is still fuzzy)
- `Skip grill — I already know what I want` — then Site pick + Project pick + suggestions

Discover Jira MCP tools (`jira|atlassian`). Auth if needed. Pass **site context** on every call.

### Draft (do not create yet)

Build the Jira description from the grill summary. Use these headings (plain text in Jira, not a fenced example):

- `## Problem` — who is affected and what hurts today
- `## Solution` — what we will deliver for users
- `## Acceptance criteria` — checklist in user-visible behaviour
- `## Out of scope`
- `## Open questions` — bullets, or _None._
- `## Notes for engineering` — only non-obvious product decisions; skip file paths and stack

Title: short user-outcome phrase. No project key prefix.

Show the **full PM preview** in chat — not a one-line summary:

- Jira site: name — url
- Title
- Project
- Epic: `KEY — title` (or new epic name, or none)
- Labels
- Status, priority, assignee
- Every section of the description in readable prose

### Revise loop (before create)

AskQuestion `story-revise`:

- `Create this story in Jira` (Recommended)
- `Change Jira site` — re-run Site pick from `/jira-grill`; refresh project/epic/labels
- `Change the title`
- `Change problem or solution`
- `Change what's in or out of scope`
- `Change acceptance criteria`
- `Change epic` — re-fetch open epics on this site; suggest **(Recommended)** + `No epic` + `New epic` + `Show all epics`
- `Change labels` — re-suggest from full label list **(Recommended)**; `allow_multiple: true`
- `Change status, priority, or assignee`
- `Cancel — don't create`

Apply the chosen edit, refresh suggestions when story text or site changed, re-show the full preview, and ask `story-revise` again until **Create** or **Cancel**.

Call create only after **Create this story in Jira**.

### Create

Use the **locked site context** for all MCP calls.

1. New epic requested → create Epic first on this site (name + goal). Keep the key.
2. Create Story in the chosen project with the draft description.
3. Link Epic Link / parent per project metadata; fix with edit if create skipped it.
4. Apply labels.
5. Assignee only with a looked-up account ID.
6. Status: transition only via that issue's allowed transitions.
7. Reply plainly:

   - Site: name — url
   - Story: `KEY — title` + URL
   - Epic (if any): `KEY — title` + URL
   - Labels attached
   - "Open the link to review in Jira."

Hand off: "Engineering can run **/jira-tasks** to break this into implementation tasks." Do not create tasks unless they asked in the same message.
