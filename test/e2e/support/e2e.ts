import { expect, type Locator, type Page, test } from "@playwright/test";

export { expect, test };

export const credentials = {
  adminUser: process.env.E2E_ADMIN_USER ?? "admin",
  adminPassword: process.env.E2E_ADMIN_PASSWORD ?? "admin",
};

export async function loginAsAdmin(page: Page) {
  await page.goto("/login");
  await page.getByPlaceholder("usuario").fill(credentials.adminUser);
  await page.getByPlaceholder("••••••••").fill(credentials.adminPassword);
  await page.getByRole("button", { name: /Iniciar Sesión/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
  await expect(page.getByRole("main")).toBeVisible();
}

export async function logout(page: Page) {
  await page.getByRole("button", { name: /Cerrar Sesión/i }).click();
  await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
}

export async function openDashboardView(
  page: Page,
  viewName: string | RegExp,
  expectedText?: string | RegExp,
) {
  await loginAsAdmin(page);
  await page
    .getByRole("navigation")
    .getByRole("button", { name: viewName })
    .click();

  if (expectedText) {
    await expect(
      page.getByRole("main").getByText(expectedText, { exact: false }),
    ).toBeVisible();
  }
}

export async function expectDialogHeading(
  page: Page,
  heading: string | RegExp,
) {
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: heading })).toBeVisible();
  return dialog;
}

export async function closeDialog(page: Page) {
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
}

export async function fillSearchableSelect(
  page: Page,
  label: string | RegExp,
  search: string,
  option: string | RegExp,
) {
  const select = page
    .getByText(label, { exact: typeof label === "string" })
    .locator("..")
    .locator(".cursor-pointer")
    .first();
  await select.click({ force: true });
  await page.getByPlaceholder("Buscar...").fill(search);
  await page
    .locator("div.cursor-pointer")
    .filter({ hasText: option })
    .first()
    .click({ force: true });
  await expect(page.getByPlaceholder("Buscar...")).not.toBeVisible();
  return select;
}

export async function expectVisible(locator: Locator) {
  await expect(locator).toBeVisible();
  return locator;
}

export function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
