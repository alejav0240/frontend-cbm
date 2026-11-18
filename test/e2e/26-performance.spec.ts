import { expect, test } from "@playwright/test";

test.describe("Rendimiento inicial", () => {
  test("login cumple presupuestos básicos de carga y estabilidad", async ({ page }) => {
    await page.goto("/login");

    const metrics = await page.evaluate(async () => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByName("first-contentful-paint")[0] as PerformancePaintTiming | undefined;

      return {
        domContentLoaded: navigation.domContentLoadedEventEnd,
        firstContentfulPaint: paint?.startTime ?? null,
      };
    });

    expect(metrics.domContentLoaded).toBeLessThan(3_000);
    if (metrics.firstContentfulPaint !== null) {
      expect(metrics.firstContentfulPaint).toBeLessThan(2_500);
    }
  });
});
