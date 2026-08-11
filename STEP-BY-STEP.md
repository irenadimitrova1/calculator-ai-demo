# Step by Step Setup Guide

1. npx skills@latest add mattpocock/skills
    - Skills: All
    - Agents: Cursor
    - Installation scope: Project
2. /setup-matt-pocock-skills
    - login with GitHub, accept default triage labels
3. Docs interpretation
    - set up MkDocs Material with GitHub Pages for more PM-like experience
4. Write a few feature documentations `/docs/product/features` that will later be used to automatically generate GitHub issues. Create a good template for those.
5. Generate GitHub issues
    - Modify Matt protocol to create issues from PM/PO (non-tech) spec.
    `feature definition -> grill -> spec -> tickets`
    - Multiple iterations of improving the MDs to get the proper questions on
        - How to convert non-tech spec into tech spec?
        - Where to write the tech spec?
            - It adds a new section called **Engineering specification** that will later be used to generate GitHub issues/tasks
        - Give the tech person a chance to add additional information after each round of questions, which might lead to another round of questions. *E.g. while it was grilling me for the initial setup it asked only whether I want React + Vite or something else. Didn't ask about TypeScript, ESLint, styling library, etc.*
    - Improving to-spec and to-issues to generation.
        - **to-spec** - creates and publishes a parent issue (story) with description and link to proper feature docs, dev specs, etc. Applies **`story`** label only (not `ready-for-agent`).
        - **to-tickets** - makes a plan of how many issues it will create and their title & content. Asks multiple questions - should we get more granular or more generic, are blocking edges correct, etc. (might run multiple iterations here) and if all is ok, publishes child tickets with **`ready-for-agent`**.
        - **plan** - builds one child ticket at a time. If pointed at a parent **`story`** issue, runs **`/grill-me`** to pick the next unblocked child first. This is a plan-mode process. The developer still actively and iteratively participates in the feature implementation. Later, when the entire flow is polished, we could try automating it up to PR for simple features.
        - **pr** - pushes and creates a PR. PR is necessary in case someone else from the team, different from the assignee needs to review some changes, *e.g. FE changed BE and needs a BE dev to review*
