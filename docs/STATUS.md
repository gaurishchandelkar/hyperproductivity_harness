# Status

## Current state

- The Hello World backend (`/api/health`, `/api/hello`) and frontend are working.
- **Rules:** `AGENTS.md`, `CLAUDE.md`, and the `docs/` rules and templates are in place.
- **Safeguards:**
  - ruff (including bandit rules), pyright strict, ESLint strict, Prettier and tsc
  - import-linter layer contracts
  - pip-audit, npm audit and detect-secrets
  - lefthook pre-commit
  - Claude Code permission rules, guard hook and format hook

## In progress

- Building the harness template (see `docs/PLAN.md`).

## Known gaps

- There are no automated tests yet, so the coverage gates arrive with them.
- The guard hook only inspects command text heuristically. It's a seatbelt, not a sandbox, and CI is the backstop.
