---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---

Implement the work described by the user in the spec or tickets.

## Resolve the target issue first

Fetch the issue the user pointed at (number, URL, or title). Read labels, body, and `## Blocked by` / `## Parent` sections.

| Label | Role | Action |
|-------|------|--------|
| `story` | Parent / umbrella spec from `/to-spec` | **Do not implement.** Go to [Parent `story` issues](#parent-story-issues). |
| `ready-for-agent` | Tracer-bullet ticket from `/to-tickets` | Implement this issue (if blockers are clear). |
| Other | Untriaged or human-only | Stop — tell the user to triage or pick a `ready-for-agent` child ticket. |

**Never** implement a `story` issue directly — it holds user stories and cross-cutting decisions, not a single shippable slice.

### Parent `story` issues

When the target has the `story` label, run `/grilling` per `/grill-me`:

1. Gather **child tickets** — open issues whose body references this parent under `## Parent` (or linked sub-issues). Read each child's title, acceptance criteria, and `## Blocked by`.
2. Compute the **frontier** — children labeled `ready-for-agent` whose blockers are all closed (or `Blocked by: None`).
3. **Grill** the user on which frontier ticket to implement now (one round is enough if the frontier is obvious). Present options; wait for confirmation.
4. Implement the **chosen child ticket** — not the parent.

Use the parent issue and linked feature doc only as **read-only context** during implementation.

### Blockers

Before coding, verify the target ticket's blockers are satisfied. If `## Blocked by` references open issues, stop and point the user at the blocking ticket.

## Build

Implement the resolved **child** ticket (or a directly targeted `ready-for-agent` ticket).

Use `/tdd` where possible, at pre-agreed seams.

Run typechecking regularly, single test files regularly, and the full test suite once at the end.

Once done, use `/code-review` to review the work.

Commit your work to the current branch.
