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
