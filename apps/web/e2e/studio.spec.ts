import { expect, test } from "@playwright/test";

test.describe("entry page", () => {
  test("is Indonesian by default and links to the studio", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await page.getByRole("link", { name: "Buka Studio" }).click();
    await expect(page).toHaveURL(/\/studio\/effects$/);
  });

  test("ignores an English Accept-Language header", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await ctx.close();
  });

  test("switches to English and back", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "en", exact: true }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("link", { name: "Open Studio" })).toBeVisible();
    await page.getByRole("link", { name: "id", exact: true }).click();
    await expect(page.getByRole("link", { name: "Buka Studio" })).toBeVisible();
  });
});

test.describe("studio shell", () => {
  test("redirects /studio to the effects lab", async ({ page }) => {
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/studio\/effects$/);
  });

  test("navigates between all seven labs", async ({ page }) => {
    await page.goto("/studio/effects");
    const nav = page.getByRole("navigation", { name: "Lab" });
    const labs = ["Efek", "Poster", "Huruf", "Pola", "Bentuk", "3D", "Main"];
    await expect(nav.getByRole("link")).toHaveCount(labs.length);
    for (const name of labs) {
      await nav.getByRole("link", { name, exact: true }).click();
      await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
    await expect(page).toHaveURL(/\/studio\/play$/);
  });

  test("keeps the lab when switching language", async ({ page }) => {
    await page.goto("/studio/pattern");
    await page.getByRole("link", { name: "en", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/studio\/pattern$/);
    await expect(page.getByRole("navigation", { name: "Labs" })).toBeVisible();
  });

  test("unknown labs are 404", async ({ page }) => {
    const res = await page.goto("/studio/nope");
    expect(res?.status()).toBe(404);
  });

  test("export is disabled until the Effects Lab ships", async ({ page }) => {
    await page.goto("/studio/effects");
    const exportButton = page.getByRole("button", { name: "Ekspor" });
    // aria-disabled (not disabled) so it stays focusable and explains itself.
    await expect(exportButton).toHaveAttribute("aria-disabled", "true");
    await expect(exportButton).toHaveAccessibleDescription(
      "Ekspor tersedia setelah Lab Efek hadir.",
    );
    // Activating it reveals the reason (opens the sheet on phones) instead of doing nothing.
    // Keyboard activation also proves it stays focusable (Playwright's click() refuses
    // aria-disabled elements, unlike real pointers).
    await exportButton.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#export-reason")).toBeFocused();
    await expect(page.locator("#export-reason")).toBeInViewport();
  });

  test("has no horizontal overflow and no console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto("/studio/effects");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
    expect(errors).toEqual([]);
  });
});

test.describe("desktop parameter panel", () => {
  test.skip(({ isMobile }) => !!isMobile, "desktop only");

  test("is always open and has no toggle in the tab order", async ({ page }) => {
    await page.goto("/studio/effects");
    await expect(page.getByRole("button", { name: /parameter/i })).toHaveCount(0);
    await expect(page.getByText("Lab ini belum dibuka.")).toBeInViewport();
  });
});

test.describe("mobile parameter sheet", () => {
  test.skip(({ isMobile }) => !isMobile, "bottom sheet only exists on phones");

  test("opens and closes", async ({ page }) => {
    await page.goto("/studio/effects");
    const toggle = page.getByRole("button", { name: "Tampilkan parameter" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    // Peeking: the rest of the sheet sits under the lab bar, which covers it.
    const barTop = (await page.getByRole("navigation", { name: "Lab" }).boundingBox())!.y;
    const hiddenTop = (await page.getByText("Lab ini belum dibuka.").boundingBox())!.y;
    expect(hiddenTop).toBeGreaterThanOrEqual(barTop);
    await toggle.click();
    const close = page.getByRole("button", { name: "Sembunyikan parameter" });
    await expect(close).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Lab ini belum dibuka.")).toBeInViewport();
    await close.click();
    await expect(page.getByRole("button", { name: "Tampilkan parameter" })).toBeVisible();
  });
});
