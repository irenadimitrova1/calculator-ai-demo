# Jira MCP

Primary audience: **non-technical PMs**. Use plain language. Avoid jargon unless the PM used it first.

When the user wants Jira work (epics, stories, tasks, tickets, labels, status, sprint, assignee):

1. Discover tools first. Call GetMcpTools with pattern `jira|atlassian`. If the server is `needsAuth`, authenticate, then inspect the server again. Load full schemas before CallMcpTool. Map by capability (search / get / create / edit / transition / link / projects / issue types / fields). Do not hardcode a server id or tool name.

2. **Site first.** When multiple Jira Cloud sites exist, resolve the **Jira site** before project/epic/label lookup. Read the team `jira-sites.json` catalog (installed **jira-pm-intake** plugin, or `docs/cursor-team/marketplace/plugins/jira-pm-intake/jira-sites.json` in an open repo). Offer catalog entries in AskQuestion; accept a pasted site URL (`https://client.atlassian.net`) or issue URL. Pass **site context** (`cloudId` when the tool supports it) on every MCP call for the rest of the session. Do not mix sites in one flow.

3. Look up placement on the **chosen site**. Fetch **all** available labels and **all** open epics for the chosen project — not a short sample. Present them with AskQuestion. **Suggest** epic and label matches from the story and mark suggestions **(Recommended)** with a one-line reason. The PM picks; you fetch and suggest.

4. Grill before write. New work uses `/jira-grill` until shared understanding. Then `/jira-story`, then `/jira-tasks` (usually engineering). Create, edit, transition, or link issues only after the PM confirms in AskQuestion.

5. Easy to change. Before every create, show a full plain-language preview. Offer a **Revise** menu (title, problem, scope, acceptance, site, epic, labels, status) — not only freeform typing. Re-run suggestions when they change site, project, or story text.

6. Hierarchy. Epic (optional umbrella) → Story (parent spec) → Task (implementable slice). Link children with native Jira fields (parent / Epic Link).

7. After create. Return keys and URLs. If the user picked a non-default status, transition using the issue's actual transitions. Apply chosen labels. Stop.
