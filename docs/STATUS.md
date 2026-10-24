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
- **Verification:** `npm run check` runs build → lint → unit → integration → functional → security → architecture.
  - Python and frontend unit coverage are both at 100% (the gate is 80%), and the guard hook has 26 tests.
  - Playwright E2E covers both the success path and the error path.
- **CI:** GitHub Actions runs one job per stage. Dependabot and CODEOWNERS are configured, and `scripts/protect-branch.mjs` applies branch protection.
- **Agent browser:** the Playwright MCP server is configured in `.mcp.json`.

## In progress

- Building the harness template (see `docs/PLAN.md`).

## Known gaps

- The CI workflow and branch protection script are untested until the repo is pushed to GitHub.
- The guard hook only inspects command text heuristically. It's a seatbelt, not a sandbox, and CI is the backstop.
