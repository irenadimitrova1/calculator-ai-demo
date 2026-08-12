# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Label in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on PM/PO/reporter for more information |
| _(repo extension)_         | `answered`           | PM/PO replied — run `/triage` to incorporate and decide outcome |
| `ready-for-agent`          | `ready-for-agent`    | Tracer-bullet ticket ready for `/plan` |
| _(repo extension)_         | `in-progress`        | Claimed — branch created, planning or building |
| _(repo extension)_         | `implemented`        | Merged to main — child ticket complete |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |
| _(repo extension)_         | `story`              | Parent / umbrella spec from `/to-spec`   |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.
