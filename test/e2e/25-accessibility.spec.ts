import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("Accesibilidad y SEO básico", () => {
  test("la pantalla de login no presenta violaciones críticas", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/CBM|Musicoterapia/i);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
