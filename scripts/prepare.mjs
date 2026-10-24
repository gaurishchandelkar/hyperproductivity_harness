// Runs on npm install: installs git hooks and, outside CI, the Playwright browser.
import { execSync } from "node:child_process";

execSync("npx lefthook install", { stdio: "inherit" });
if (!process.env.CI) execSync("npx playwright install chromium", { stdio: "inherit" });
