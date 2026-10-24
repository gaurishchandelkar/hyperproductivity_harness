# Tech Stack

| Area | Choice |
|---|---|
| Backend | Python 3.12+, FastAPI, Uvicorn, Pydantic |
| Python tooling | uv (deps and running), ruff (lint and format), pyright (types), pytest + pytest-cov, import-linter, pip-audit |
| Frontend | React 19, Vite, TypeScript (strict) |
| Frontend tooling | ESLint (typescript-eslint, react-hooks), Prettier, vitest + Testing Library |
| Functional tests | Playwright (Chromium) |
| Git hooks | lefthook |
| Secrets scanning | detect-secrets |
| CI | GitHub Actions, Dependabot |
| Agent harness | `AGENTS.md`, `CLAUDE.md`, `.claude/` (settings, hooks, skills, subagents), Playwright MCP |

The root `package.json` runs all tasks, and Python commands go through `uv run`.
