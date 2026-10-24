// Applies branch protection to main with the GitHub CLI. Run by a human repo admin, never by an agent.
// Usage: node scripts/protect-branch.mjs [branch]
import { execFileSync } from "node:child_process";

const branch = process.argv[2] ?? "main";
const repo = execFileSync(
  "gh",
  ["repo", "view", "--json", "nameWithOwner", "-q", ".nameWithOwner"],
  {
    encoding: "utf8",
  },
).trim();

const protection = {
  required_status_checks: {
    strict: true,
    contexts: ["build", "lint", "unit", "integration", "functional", "security", "architecture"],
  },
  enforce_admins: true,
  required_pull_request_reviews: {
    required_approving_review_count: 1,
    require_code_owner_reviews: true,
    dismiss_stale_reviews: true,
  },
  restrictions: null,
  required_linear_history: true,
  allow_force_pushes: false,
  allow_deletions: false,
};

execFileSync(
  "gh",
  ["api", "-X", "PUT", `repos/${repo}/branches/${branch}/protection`, "--input", "-"],
  { input: JSON.stringify(protection), stdio: ["pipe", "inherit", "inherit"] },
);
console.log(`Protected ${repo}@${branch}: PRs, code owner review and all CI stages required.`);
