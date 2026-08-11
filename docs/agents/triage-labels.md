# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in our tracker | Meaning                                  |
| -------------------- | ---------------------------------------- |
| `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`         | Waiting on reporter for more information |
| `story`              | Parent / umbrella spec from `/to-spec` — not directly implementable |
| `ready-for-agent`    | Tracer-bullet ticket ready for `/plan` |
| `in-progress`        | Claimed by agent/dev — branch created, `/plan` or Build underway |
| `ready-for-human`    | Requires human implementation            |
| `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

**Parent vs child:** `/to-spec` publishes **one** parent issue with the `story` label only. `/to-tickets` publishes child tickets with `ready-for-agent`. **`/plan`** claims a child (branch from `main`, assignee, swap `ready-for-agent` → `in-progress`). **Build** runs the verify checklist automatically; **`/verify`** is optional after post-Build edits. **`/pr`** commits, pushes, opens PR, removes `in-progress`. When all children close, close the parent `story`.

Edit the right-hand column to match whatever vocabulary you actually use.
