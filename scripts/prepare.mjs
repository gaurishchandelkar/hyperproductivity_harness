// Runs on npm install: installs git hooks and, outside CI, the Chromium the Python E2E tests use.
// Needs `uv sync` first, which installs Python Playwright.
import { execSync } from "node:child_process";

execSync("npx lefthook install", { stdio: "inherit" });
if (!process.env.CI) execSync("uv run playwright install chromium", { stdio: "inherit" });
