import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluate } from "./guard.mjs";

const P = process.cwd();

const cases = [
  ["Bash", { command: "git push origin main" }, "deny"],
  ["Bash", { command: "git -C . push" }, "deny"],
  ["Bash", { command: "git stash push" }, null],
  ["Bash", { command: 'git commit -m "x" --no-verify' }, "deny"],
  ["Bash", { command: 'git commit -n -m "x"' }, "deny"],
  ["Bash", { command: 'git commit -m "add -name flag"' }, null],
  ["Bash", { command: "LEFTHOOK=0 git commit -m x" }, "deny"],
  ["Bash", { command: "cat .env" }, "deny"],
  ["Bash", { command: "cat backend/.env.local" }, "deny"],
  ["Bash", { command: "cat .env.example" }, null],
  ["Bash", { command: "source .venv/bin/activate" }, null],
  ["Bash", { command: "node -e 'console.log(process.env.HOME)'" }, null],
  ["Bash", { command: "echo x > .claude/settings.json" }, "ask"],
  ["Bash", { command: "npm run check" }, null],
  ["Read", { file_path: `${P}/.env` }, "deny"],
  ["Read", { file_path: `${P}/.env.example` }, null],
  ["Write", { file_path: `${P}/backend/x.py`, content: "x = 1  # noqa" }, "deny"],
  [
    "Edit",
    { file_path: `${P}/frontend/src/a.ts`, new_string: "// eslint-disable-next-line" },
    "deny",
  ],
  ["Edit", { file_path: `${P}/frontend/src/a.ts`, new_string: "// @ts-expect-error" }, "deny"],
  ["Edit", { file_path: `${P}/docs/CODING_GUIDELINES.md`, new_string: "never `# noqa`" }, null],
  ["Edit", { file_path: `${P}/pyproject.toml`, new_string: "fail_under = 50" }, "deny"],
  ["Edit", { file_path: `${P}/pyproject.toml`, new_string: "fail_under = 85" }, null],
  [
    "Edit",
    { file_path: `${P}/frontend/vite.config.ts`, new_string: "thresholds: { lines: 60 }" },
    "deny",
  ],
  ["Edit", { file_path: `${P}/.claude/settings.json`, new_string: "{}" }, "ask"],
  ["Edit", { file_path: `${P}/docs/RULES.md`, new_string: "x" }, "ask"],
  ["Edit", { file_path: `${P}/backend/services/greeting.py`, new_string: "x" }, null],
];

for (const [toolName, toolInput, expected] of cases) {
  const subject = toolInput.command ?? toolInput.file_path.replace(P, ".");
  test(`${toolName} ${subject} -> ${String(expected)}`, () => {
    const result = evaluate({ tool_name: toolName, tool_input: toolInput }, P);
    assert.equal(result?.decision ?? null, expected);
  });
}
