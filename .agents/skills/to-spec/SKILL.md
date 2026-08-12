---
name: to-spec
description: Turn the current conversation into a spec and publish it to the project issue tracker — no interview, just synthesis of what you've already discussed.
disable-model-invocation: true
---

This skill takes the current conversation context and codebase understanding and produces a spec. Do NOT interview the user — just synthesize what you already know.

**Runs after `/grill-with-docs`, before `/to-tickets`.** Publishes the parent **`story`** and **`needs-info`** PM question issues that **`/to-tickets`** requires. Do not skip this step when splitting a feature into implementation tickets.

When the source is a feature doc at `docs/product/features/<name>.md`, read **`## Engineering specification`** for feature requirements — not the PM sections above it. Also read **`## Questions`** for open product questions. Use `CONTEXT.md`, relevant ADRs, and the codebase. The published issues should link to the full feature doc path for traceability.

The issue tracker and triage label vocabulary should have been provided to you — run `/setup-matt-pocock-skills` if not.

## Process

0. **Ensure triage labels exist on the tracker** (GitHub/GitLab). Before creating issues, verify labels from `docs/agents/triage-labels.md` exist — at minimum **`story`**, **`needs-info`**, **`answered`**, **`ready-for-agent`**, **`in-progress`**, **`implemented`**. Create any missing labels (`gh label create …`). `/to-spec` must not fail silently when `needs-info` is missing.

1. Explore the repo to understand the current state of the codebase, if you haven't already. Use the project's domain glossary vocabulary throughout the spec, and respect any ADRs in the area you're touching.

2. Sketch out the seams at which you're going to test the feature. Existing seams should be preferred to new ones. Use the highest seam possible. If new seams are needed, propose them at the highest point you can. The fewer seams across the codebase, the better - the ideal number is one.

Check with the user that these seams match their expectations.

3. Write the spec using the template below, then publish the **parent** issue to the project issue tracker. Apply the **`story`** label — umbrella spec, **not** directly implementable. Do **not** apply `ready-for-agent` to parent specs.

4. Publish **PM question issues** from the feature doc **`## Questions`** index:
   - One GitHub issue per row with **Status:** `open`
   - Label: **`needs-info`** only — not `ready-for-agent`, not `story`
   - Title: short form of **Prompt** (prefix `[PM]` if helpful)
   - Body must include:
     - **Prompt** and **Options** table from the matching `### {id}` block
     - **Assumption (if blocked)** from that block
     - Link to the feature doc path and question ID (`pm-q1`, …)
     - `## Parent` → link to the **`story`** issue from step 3
   - Comment on the parent **`story`**: list the new `needs-info` issue numbers
   - Update the index **Issue** column with the issue link (`#N`) when published
   - Do **not** block `/to-tickets` on these — implementation tickets may proceed on documented assumptions

5. **Hand off to `/to-tickets`.** When step 3 and step 4 are complete, tell the user the feature is ready for **`/to-tickets`** — parent `#N`, PM questions linked in the doc, no implementation children yet.

6. **PM/PO question lifecycle** (issues from step 4):
   - **Open:** issue has **`needs-info`**; doc row **Status:** `open`; link issue `#N` in the doc row when published
   - **PM/PO answered:** when PM/PO comments with a decision, `gh issue edit <N> --remove-label needs-info --add-label answered` — **before** incorporating into the spec (PM, maintainer, or **`/triage`** when it sees the reply)
   - **Triage:** run **`/triage #N`** on an **`answered`** issue — record **Answer** in **`## Questions`** (never edit **`## Engineering specification`** above), then **`AskQuestion`**: resolved (close and remove **`answered`**) **or** new **`ready-for-agent`** dev ticket **or** back to **`needs-info`**
   - Doc row **resolved** only when triage closes the question — not when PM first replies; closed PM issues must not retain **`needs-info`** or **`answered`**

<spec-template>

## Problem Statement

The problem that the user is facing, from the user's perspective.

## Solution

The solution to the problem, from the user's perspective.

## User Stories

A LONG, numbered list of user stories. Each user story should be in the format of:

1. As an <actor>, I want a <feature>, so that <benefit>

<user-story-example>
1. As a mobile bank customer, I want to see balance on my accounts, so that I can make better informed decisions about my spending
</user-story-example>

This list of user stories should be extremely extensive and cover all aspects of the feature.

## Implementation Decisions

A list of implementation decisions that were made. This can include:

- The modules that will be built/modified
- The interfaces of those modules that will be modified
- Technical clarifications from the developer
- Architectural decisions
- Schema changes
- API contracts
- Specific interactions

Do NOT include specific file paths or code snippets. They may end up being outdated very quickly.

Exception: if a prototype produced a snippet that encodes a decision more precisely than prose can (state machine, reducer, schema, type shape), inline it within the relevant decision and note briefly that it came from a prototype. Trim to the decision-rich parts — not a working demo, just the important bits.

Note any **interim assumptions** documented while PM/PO questions (`needs-info` issues) remain open.

## Testing Decisions

A list of testing decisions that were made. Include:

- A description of what makes a good test (only test external behavior, not implementation details)
- Which modules will be tested
- Prior art for the tests (i.e. similar types of tests in the codebase)

## Out of Scope

A description of the things that are out of scope for this spec.

## Further Notes

Any further notes about the feature.

Link to open **`needs-info`** issues from step 4 when assumptions are in play.

</spec-template>
