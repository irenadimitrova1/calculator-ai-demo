---
name: pr
description: Ship one child ticket — verify, review, update docs, commit, push, open PR.
disable-model-invocation: true
---

Ship **one child ticket** after local build and fine-tuning. This is the explicit git/PR gate — do **not** push unless the user invoked `/pr`.

## Resolve the target issue

Fetch the issue the user pointed at. Read labels, body, and `## Parent`.

| Label | Role | Action |
|-------|------|--------|
| `story` | Parent / umbrella spec | **Stop.** Tell the user to `/pr` a child ticket, or `/plan` from the story to pick one. |
| `ready-for-agent` | Tracer-bullet ticket | Ship this issue. |
| Other | Untriaged | Stop — triage or pick a `ready-for-agent` child. |

## Preconditions

- Working tree has changes for this ticket
- User explicitly invoked `/pr` (this skill is the ship gate)

## Process

### 1. Verify

Run the project's test suite and typecheck. **Stop if red** — fix or tell the user what's failing.

### 2. Code review

Run `/code-review` against the ticket's acceptance criteria (Spec axis). Address blocking findings or note them for the user before proceeding.

### 3. Update docs (`/domain-modeling`)

**Engineering section only** — do not edit PM/PO content in feature docs.

In the linked feature doc `## Engineering specification`:

- Record any **new decisions** made during the build (under the relevant subsection or a brief `### Decisions this ticket` note)
- Update **`### Ticket progress`**: set this ticket's row to `in-review` before PR, `shipped` after PR is opened
- Set **`Status:`** to `in-progress` if not already; set to `done` only when **all** child tickets for the parent story are closed/shipped

Update `CONTEXT.md` or add ADRs only when the domain-modeling skill's three ADR criteria all apply.

### 4. Git + GitHub

Follow the user's git/PR rules:

1. Branch if needed: `issue-<N>-<slug>`
2. Stage relevant changes (code + doc updates from step 3)
3. Commit with message referencing the issue; body includes `Closes #N`
4. `git push -u origin HEAD`
5. `gh pr create` with:
   - Title summarizing the ticket
   - Body: Summary, `Closes #N`, parent `story` link, feature doc path, test plan checklist
6. Comment the PR URL on issue `#N`

Do **not** manually close `#N` — `Closes #N` in the PR handles it on merge.

### 5. After PR

Set the ticket row in `### Ticket progress` to `shipped` if not already done in step 3.

If all sibling child tickets are now shipped/closed, set feature **`Status:`** to `done`.

## Out of scope

- Planning (`/plan`)
- Building code (dev does that before `/pr`)
- Closing the parent `story` issue (closes when all children ship, or manually by PM)
