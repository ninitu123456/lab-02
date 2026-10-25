
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test("DataGrid renders correctly", async ({ page }) => {
  await expect(
    page.getByRole("grid", {
      name: "Employee management data grid",
    })
  ).toBeVisible();

  await expect(page.getByRole("row")).toHaveCount(6);
});

test("Filtering works", async ({ page }) => {
  await page.getByRole("searchbox").fill("Engineering");

  await expect(page.getByRole("row")).toHaveCount(6);

  await expect(
    page.getByText("Software Engineer")
  ).toBeVisible();
});

test("Sorting works", async ({ page }) => {
  await page.getByRole("button", { name: /Name/ }).click();

  await expect(
    page.getByRole("columnheader", { name: /Name/ })
  ).toHaveAttribute("aria-sort", "ascending");
});

test("Pagination works", async ({ page }) => {
  await page
    .getByRole("button", { name: "Next", exact: true })
    .click();

  await expect(
    page.getByRole("paragraph")
      .filter({ hasText: "Page 2 of 3" })
  ).toBeVisible();
});

test("Keyboard navigation works", async ({ page }) => {
  const cells = page.getByRole("gridcell");

  await cells.first().focus();
  await page.keyboard.press("ArrowRight");

  await expect(cells.nth(1)).toBeFocused();

  await page.keyboard.press("Space");

  await expect(
    page.getByRole("row", { selected: true })
  ).toHaveCount(1);
});

test("No automatically detectable WCAG A/AA violations", async ({
  page,
}) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
