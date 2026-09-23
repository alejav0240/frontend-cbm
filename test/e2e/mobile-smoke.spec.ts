import { expect, test } from "./support/e2e";

test.describe("Compatibilidad móvil", () => {
  test("mantiene viewport, scroll y permisos de medios", async ({ page }) => {
    const response = await page.goto("/login");

    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      )
      .toBe(true);
    expect(response?.headers()["permissions-policy"]).toContain(
      "camera=(self)",
    );
    expect(response?.headers()["permissions-policy"]).toContain(
      "microphone=(self)",
    );
  });
});
