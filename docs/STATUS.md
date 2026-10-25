# Status

## Current state

- **Product:** a Hello World backend and frontend with a personalised greeting (`/api/hello?name=`), with server-side allow-list validation and a generic 422 response.
- **Rules:** `AGENTS.md`, `CLAUDE.md`, and the `docs/` rules and templates are in place.
- **Safeguards:**
  - ruff (including bandit rules), pyright strict, ESLint strict, Prettier and tsc
  - import-linter layer contracts
  - pip-audit, npm audit and detect-secrets
  - lefthook pre-commit
  - Claude Code permission rules, guard hook and format hook
- **Verification:** `npm run check` runs build → lint → unit → integration → functional → security → architecture.
  - Coverage gates are at 80%.
  - E2E runs on dedicated ports, so a running dev server is never what gets tested.
- **CI:** GitHub Actions runs one job per stage. Dependabot and CODEOWNERS are configured, and `scripts/protect-branch.mjs` applies branch protection.
- **Staged autonomy:** the `/spec`, `/plan`, `/implement`, `/ship` and `/retro` skills, the `code-reviewer` and `security-reviewer` subagents, and the PR template.
- **Flywheel and metrics:** `docs/HARNESS_LOG.md`, `docs/METRICS.md` and `npm run metrics`.
- **Reference example:** `docs/specs/personalised-greeting.md` and `docs/plans/PLAN_personalised-greeting.md`.

## In progress

- None.

## Known gaps

- The branch protection script is untested until a repo admin runs it.
- The guard hook only inspects command text heuristically. It's a seatbelt, not a sandbox, and CI is the backstop.
