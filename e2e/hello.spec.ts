import { expect, test } from "@playwright/test";

test("shows the greeting from the backend", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Hello, World!" })).toBeVisible();
});

test("shows an alert when the backend fails", async ({ page }) => {
  await page.route("**/api/hello", (route) => route.fulfill({ status: 500 }));

  await page.goto("/");

  await expect(page.getByRole("alert")).toContainText("Could not load greeting");
});
