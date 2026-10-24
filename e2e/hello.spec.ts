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

test("greets the name the user enters", async ({ page }) => {
  await page.goto("/");

  await page.getByLabel("Your name").fill("Ada");
  await page.getByRole("button", { name: "Greet" }).click();

  await expect(page.getByRole("heading", { name: "Hello, Ada!" })).toBeVisible();
});

test("rejects markup in the name without rendering it", async ({ page }) => {
  let dialogOpened = false;
  page.on("dialog", (dialog) => {
    dialogOpened = true;
    void dialog.dismiss();
  });
  await page.goto("/");

  await page.getByLabel("Your name").fill("<script>alert(1)</script>");
  await page.getByRole("button", { name: "Greet" }).click();

  await expect(page.getByRole("alert")).toContainText("Please enter a valid name");
  await expect(page.locator("main script")).toHaveCount(0);
  expect(dialogOpened).toBe(false);
});
