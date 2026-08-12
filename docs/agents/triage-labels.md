# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in our tracker | Meaning                                  |
| -------------------- | ---------------------------------------- |
| `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`         | Waiting on PM/PO/reporter for more information |
| `answered`           | PM/PO replied on a PM question issue — run `/triage` to incorporate and decide outcome |
| `story`              | Parent / umbrella spec from `/to-spec` — not directly implementable |
| `ready-for-agent`    | Tracer-bullet ticket ready for `/plan` |
| `in-progress`        | Claimed by agent/dev — branch created, `/plan` or Build underway |
| `implemented`        | Child ticket merged to `main` — issue closed |
| `ready-for-human`    | Requires human implementation            |
| `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

**PM/PO question issues:** `/to-spec` → **`needs-info`**. PM/PO replies → swap to **`answered`** before **`/triage`**. **`/triage #N`** fills **Answer** in **`## Questions`** only — never edits **`## Engineering specification`**. Doc row **resolved** when the issue closes.

**Parent vs child:** `/to-spec` publishes **one** parent issue with the `story` label and **separate `needs-info` issues** for each open row in `## Questions`. `/to-tickets` publishes implementation child tickets with `ready-for-agent` **only after** the `story` and PM question issues exist. **`/plan`** claims a child (branch from `main`, assignee, swap `ready-for-agent` → `in-progress`). **Build** runs the verify checklist automatically; **`/verify`** is optional after post-Build edits. **`/pr`** commits, pushes, opens PR, removes `in-progress`. **Merge** closes the child via `Closes #N`; GitHub Action **Label implemented on merge** applies **`implemented`**. Update doc row to **`implemented`**. When all children are **`implemented`**, close the parent `story`.

**Label bootstrap:** `/to-spec` creates missing GitHub labels from this table before publishing (`story`, `needs-info`, `answered`, `ready-for-agent`, `in-progress`, `implemented`, …). Setup should have done this once via `/setup-matt-pocock-skills`; `/to-spec` re-checks so publish does not fail mid-flight.

Edit the right-hand column to match whatever vocabulary you actually use.
