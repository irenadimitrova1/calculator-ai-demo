# Jira PM setup — start here

One page. Three places to configure. OAuth is **not** triggered by importing the marketplace alone.

## Where things live (you only touch 3 places)

| What | Where you put it | You edit? |
|------|------------------|-----------|
| **Client Jira sites** (names + URLs) | GitHub: `docs/cursor-team/marketplace/plugins/jira-pm-intake/jira-sites.json` | **Yes — your main edit** |
| **MCP connection** (authv2 URL) | Comes from **marketplace plugin** after import — do not duplicate in dashboard if that UI is broken | Import repo once |
| **Grill / story / tasks prompts** | cursor.com → **Team → Commands** (paste from `command-jira-*.md`) | Paste once |
| **Short Jira hint for every chat** | cursor.com → **Team → Rules** (paste from `rule-jira-mcp.md`) | Paste once |

Everything else in `docs/cursor-team/` is **source/backup** in git. You do not paste marketplace JSON into the dashboard by hand.

## Setup (admin, ~15 minutes)

### 1. GitHub — edit your client sites

Open and edit:

`docs/cursor-team/marketplace/plugins/jira-pm-intake/jira-sites.json`

```json
{
  "sites": [
    {
      "id": "client-a",
      "name": "Client A — Payments",
      "url": "https://clienta.atlassian.net",
      "defaultProjectKey": "PAY"
    }
  ]
}
```

Commit and push.

### 2. cursor.com — import marketplace (MCP backup)

1. **Dashboard → Plugins → Team Marketplaces → Add Marketplace**
2. **Import from Repo** → this repo (`calculator-ai-demo`)
3. Open marketplace → plugin **jira-pm-intake** → **Default On** or **Required**
4. **Refresh** after you change `jira-sites.json`

This installs `mcp.json` with `https://mcp.atlassian.com/v1/mcp/authv2`. **Import does not log you in.**

### 3. cursor.com — paste Rule + Commands

**Team → Rules** — name `Jira MCP` — paste body from [`rule-jira-mcp.md`](rule-jira-mcp.md) (skip the `#` title line).

**Team → Commands** — paste **Body** only:

| Name | Copy from | Description (one line in dashboard) |
|------|-----------|-------------------------------------|
| `jira-grill` | [`command-jira-grill.md`](command-jira-grill.md) | Pick Jira site, grill idea, suggest epics/labels |
| `jira-story` | [`command-jira-story.md`](command-jira-story.md) | Create Story after grill — preview and easy edits |
| `jira-tasks` | [`command-jira-tasks.md`](command-jira-tasks.md) | Split Story into Tasks (usually engineering) |

## OAuth / authv2 — why login did not appear

OAuth runs on **your machine** in the Cursor app, not when you save dashboard settings.

**Do this once per person:**

1. Open **Cursor** (desktop app)
2. Sidebar → **Customize**
3. Section **MCP** (or search "MCP")
4. Find server **`atlassian`** (from jira-pm-intake plugin)
   - If missing: under **Team** or **Marketplace** plugins, ensure **jira-pm-intake** is **installed** (Default On is not enough on some builds — click **Install**)
5. **Turn the server ON** (toggle)
6. Click **Connect**, **Authenticate**, or **Log in** if shown
7. Browser opens → approve Atlassian access

**If still no browser:**

- Run **`/jira-grill`** in Agent chat with a rough idea
- Agent should call Jira MCP → status `needsAuth` → you get an auth card / browser prompt
- Or: **Output** panel (Ctrl+Shift+U) → dropdown **MCP Logs** → look for `atlassian` errors

**Already logged in?** If you used Atlassian MCP before, Cursor may reuse the token — no prompt is normal.

**Wrong layer:** Dashboard **Integrations → Jira** (assign work to Cursor Cloud Agent) is **different** from **MCP atlassian** (chat `/jira-grill`). PM intake needs **MCP**.

## PM daily use

1. `/jira-grill` + rough idea
2. Pick **Jira site** (from your `jira-sites.json` or paste URL)
3. Answer plain-language questions → suggested epic/labels
4. `/jira-story` → preview → create → open Jira link
5. Engineering: `/jira-tasks` if needed

No login each time — only if MCP was never connected or token expired.

## File map (ignore unless debugging)

```text
docs/cursor-team/
  START-HERE.md          ← you are here
  jira-sites.json        ← lives under marketplace/plugins/jira-pm-intake/
  command-jira-*.md      ← paste into dashboard Commands
  rule-jira-mcp.md       ← paste into dashboard Rules
  marketplace/           ← plugin bundle (imported via .cursor-plugin at repo root)

.cursor-plugin/
  marketplace.json       ← tells Cursor where the plugin lives in this repo
```

## Still stuck?

| Symptom | Fix |
|---------|-----|
| No `atlassian` in Customize MCP | Install **jira-pm-intake** from team marketplace; Refresh marketplace |
| MCP on but no projects | Authenticate (steps above); confirm your Atlassian user can open that Jira site in browser |
| `/jira-grill` ignores sites | Push `jira-sites.json`; Refresh marketplace; retry |
| Dashboard mcp.json empty | Ignore it — use marketplace import instead |
