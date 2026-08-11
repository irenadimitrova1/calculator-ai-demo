---
name: implement
description: "Deprecated — use /plan then /pr instead."
disable-model-invocation: true
---

**This skill is replaced.** Do not use `/implement`.

Per ticket:

1. **`/plan #N`** — Branch from main, claim issue, Plan mode + grill-me (no commit)
2. **Build** — Execute the plan; verify checklist runs automatically at end (no commit)
3. **`/verify #N`** *(optional)* — Re-validate after post-Build edits
4. **`/pr #N`** — Commit, push, open PR, `/clear`

See [`docs/agents/workflow.md`](../../docs/agents/workflow.md).
