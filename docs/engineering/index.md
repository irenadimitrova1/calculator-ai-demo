# Engineering

Overview of technical documentation for this repo.

## Documentation split

| What | Where | Who edits |
|------|-------|-----------|
| Product specs, roadmap | [`docs/product/`](../product/vision.md) | PM / PO |
| Process, rituals | [`docs/process/`](../process/how-we-plan.md) | PM / PO / team lead |
| Domain glossary | [`CONTEXT.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/CONTEXT.md) at repo root | Engineering (via `/domain-modeling`) |
| Architecture decisions | [`docs/adr/`](../adr/index.md) | Engineering |
| Agent / issue tracker config | [`docs/agents/`](../agents/issue-tracker.md) | Engineering |

## Domain glossary

[`CONTEXT.md`](https://github.com/irenadimitrova1/calculator-ai-demo/blob/main/CONTEXT.md) holds the project's ubiquitous language — terms agents and engineers use consistently. It is created and updated lazily when domain terms are resolved (not upfront).

## Architecture Decision Records (ADRs)

See [ADRs](../adr/index.md). ADRs record hard-to-reverse technical decisions. Numbered files live in `docs/adr/` (e.g. `0001-slug.md`).

## Agent configuration

Skills and agents read from [`docs/agents/`](../agents/issue-tracker.md) for issue tracker conventions, triage labels, and domain doc layout.
