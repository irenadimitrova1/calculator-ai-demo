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
