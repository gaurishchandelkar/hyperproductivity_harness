# Harness Log

The flywheel record. Every failure, repeated piece of feedback or successful pattern becomes a harness improvement here.
Add entries with `/retro`, newest first.

Entry format:

```
## YYYY-MM-DD: <short title>
- Signal: escaped defect | architecture violation | security issue | repeated review feedback | repetitive task | successful pattern | harness defect
- What happened: <facts>
- Improvement: <test | rule | safeguard | guideline | skill | template>, with the file(s) changed
- Enforced: yes (<check that now catches it>) | documented only (<why it can't be enforced>)
```

## 2026-10-25: Guard and deny rules didn't cover the PowerShell tool
- Signal: security issue
- What happened: The retro on harness creation found that `.claude/settings.json` only sent `Bash|Read|Edit|Write|MultiEdit` calls through the guard hook, and its deny rules only listed `Bash(...)` patterns. On Windows, Claude Code also has a PowerShell tool, so `git push`, `--no-verify` or reading `.env` through PowerShell bypassed every agent safeguard. No bypass happened; the gap was in the config.
- Improvement: safeguard. The hook matcher and deny rules now include PowerShell. `guard.mjs` applies its shell rules to every tool in `SHELL_TOOLS`, and also catches `$env:LEFTHOOK` and the PowerShell cmdlets that write to harness files. A test fails if any shell tool in `SHELL_TOOLS` isn't sent through the guard or lacks a push deny rule. Run against the old settings, it fails with "PowerShell is not routed through the guard".
- Enforced: yes (guard tests in the unit stage and pre-commit; a live PowerShell call containing `git push` is now denied)

## 2026-10-25: Unit stage passed on Windows but failed on Linux CI
- Signal: harness defect
- What happened: The first CI run on GitHub failed the unit job. `node --test .claude/hooks/ scripts/` passed on Windows, but on Linux Node tried to load each directory as a module (`Cannot find module …/.claude/hooks`). The pre-commit hook also ran only the guard tests, never `scripts/metrics.test.mjs`. CI also warned that `checkout@v4`, `setup-node@v4` and `setup-uv@v6` run on deprecated Node 20, and Dependabot opened a TypeScript 7 PR against the documented `~6.0` pin.
- Improvement: safeguard. `package.json` and `lefthook.yml` pass explicit `*.test.mjs` globs, which Node expands the same way on every OS, and the hook also runs on `scripts/` changes. The actions moved to Node 24 versions (`checkout@v7`, `setup-node@v7`, `upload-artifact@v7`, `setup-uv@v10.2.0`), and `.github/dependabot.yml` ignores TypeScript majors until the pin is lifted.
- Enforced: yes (CI runs every stage on Linux, so a check that only passes on Windows now fails the PR)

## 2026-10-25: Mis-cased working directory broke vitest on Windows
- Signal: harness defect
- What happened: `npm run check` in a fresh clone failed with "Invalid Chai property: toBeInTheDocument". The shell path was `C--Data…` while the folder on disk is `c--Data…`. Windows ignores the difference, but Vite loaded `vitest` twice, so jest-dom extended the wrong `expect`.
- Improvement: safeguard. `scripts/check.mjs` compares the working directory with its real path and stops with an explanation.
- Enforced: yes (`npm run check` exits with 2 and names both paths)

## 2026-10-25: Metrics counted ticked checkboxes as spec rework
- Signal: harness defect
- What happened: After the personalised-greeting plan was approved, the only change to its spec was ticking the acceptance criteria at done. `npm run metrics` still reported spec rework 1.
- Improvement: test. `scripts/metrics.mjs` now ignores checkbox-only diffs (`isCheckboxOnly`), covered by `scripts/metrics.test.mjs`.
- Enforced: yes (the metrics tests run in the unit stage)

## 2026-10-25: E2E verified a stale dev server
- Signal: harness defect
- What happened: Playwright's `reuseExistingServer` reused a `uvicorn --reload` worker left on :8000 by an earlier manual run. On Windows, the reload worker outlives its parent. The new E2E tests failed against the old code. With different code they could have passed while testing the wrong build.
- Improvement: safeguard. `playwright.config.ts` uses dedicated ports (8100/5273) and never reuses a server, and the Vite proxy target comes from `API_PORT`. Two new test rules were added to `docs/CODING_GUIDELINES.md`.
- Enforced: yes (the functional stage always starts its own servers, and fails if a port is already taken)

## 2026-10-24: A second `npm run check` run failed on the import-linter cache
- Signal: harness defect
- What happened: The architecture stage writes `.import_linter_cache/`, and on the next run Prettier's check flagged those files.
- Improvement: safeguard. Added `.import_linter_cache/` to `.gitignore`, which Prettier respects.
- Enforced: yes (repeat runs of `npm run check` are clean)

## 2026-10-24: A test relied on FastAPI internals
- Signal: successful pattern
- What happened: A unit test read `app.routes`, which broke because FastAPI now includes routers lazily. Asserting on the public OpenAPI schema worked, and it is stable across versions.
- Improvement: guideline. `docs/CODING_GUIDELINES.md` now says to assert through public interfaces.
- Enforced: documented only (the code-reviewer subagent checks it)

## 2026-10-24: The guard blocked a harmless command that mentioned `.env`
- Signal: harness defect
- What happened: The guard denied a shell command that wrote `.env.example`, because its comment text contained `.env`.
- Improvement: none, by choice. Conservative matching on secrets is intended. The file tool can write `.env.example`, and the guard allows that.
- Enforced: documented only (accepted false positive)
