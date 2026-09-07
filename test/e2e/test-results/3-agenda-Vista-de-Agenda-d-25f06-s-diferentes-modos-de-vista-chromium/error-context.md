# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 3-agenda.spec.ts >> Vista de Agenda >> debe cambiar entre los diferentes modos de vista
- Location: test/e2e/3-agenda.spec.ts:8:7

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - button "Cambiar tema" [ref=e4]
    - generic [ref=e8]:
      - generic [ref=e9]:
        - img "Logo" [ref=e11]
        - heading "Panel Administrativo" [level=1] [ref=e12]
        - paragraph [ref=e13]: Ingresa tus credenciales para continuar
      - generic [ref=e14]:
        - generic [ref=e15]:
          - text: Usuario
          - textbox "usuario" [ref=e20]: admin
        - generic [ref=e21]:
          - text: Contraseña
          - textbox "••••••••" [ref=e26]: admin
        - button "Iniciar Sesión" [ref=e27]
      - generic [ref=e30]: Centro Boliviano de Musicoterapia
  - region "Notifications alt+T"
  - generic [ref=e41] [cursor=pointer]:
    - button "Open Next.js Dev Tools" [ref=e42]
    - generic [ref=e46]:
      - button "Open issues overlay" [ref=e47]:
        - generic [ref=e48]:
          - generic [ref=e49]: "0"
          - generic [ref=e50]: "1"
        - generic [ref=e51]: Issue
      - button "Collapse issues badge" [ref=e52]
  - alert [ref=e55]
```

# Test source

```ts
  1  | import { expect, type Locator, type Page, test } from "@playwright/test";
  2  | 
  3  | export { expect, test };
  4  | 
  5  | export const credentials = {
  6  |   adminUser: process.env.E2E_ADMIN_USER ?? "admin",
  7  |   adminPassword: process.env.E2E_ADMIN_PASSWORD ?? "admin",
  8  | };
  9  | 
  10 | export async function loginAsAdmin(page: Page) {
  11 |   await page.goto("/login");
  12 |   await page.getByPlaceholder("usuario").fill(credentials.adminUser);
  13 |   await page.getByPlaceholder("••••••••").fill(credentials.adminPassword);
  14 |   await page.getByRole("button", { name: /Iniciar Sesión/i }).click();
> 15 |   await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
     |              ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  16 |   await expect(page.getByRole("main")).toBeVisible();
  17 | }
  18 | 
  19 | export async function logout(page: Page) {
  20 |   await page.getByRole("button", { name: /Cerrar Sesión/i }).click();
  21 |   await expect(page).toHaveURL(/\/login/, { timeout: 15_000 });
  22 | }
  23 | 
  24 | export async function openDashboardView(
  25 |   page: Page,
  26 |   viewName: string | RegExp,
  27 |   expectedText?: string | RegExp,
  28 | ) {
  29 |   await loginAsAdmin(page);
  30 |   await page
  31 |     .getByRole("navigation")
  32 |     .getByRole("button", { name: viewName })
  33 |     .click();
  34 | 
  35 |   if (expectedText) {
  36 |     await expect(
  37 |       page.getByRole("main").getByText(expectedText, { exact: false }),
  38 |     ).toBeVisible();
  39 |   }
  40 | }
  41 | 
  42 | export async function expectDialogHeading(
  43 |   page: Page,
  44 |   heading: string | RegExp,
  45 | ) {
  46 |   const dialog = page.getByRole("dialog");
  47 |   await expect(dialog.getByRole("heading", { name: heading })).toBeVisible();
  48 |   return dialog;
  49 | }
  50 | 
  51 | export async function closeDialog(page: Page) {
  52 |   await page.keyboard.press("Escape");
  53 |   await expect(page.getByRole("dialog")).not.toBeVisible();
  54 | }
  55 | 
  56 | export async function fillSearchableSelect(
  57 |   page: Page,
  58 |   label: string | RegExp,
  59 |   search: string,
  60 |   option: string | RegExp,
  61 | ) {
  62 |   const select = page
  63 |     .getByText(label, { exact: typeof label === "string" })
  64 |     .locator("..")
  65 |     .locator(".cursor-pointer")
  66 |     .first();
  67 |   await select.click({ force: true });
  68 |   await page.getByPlaceholder("Buscar...").fill(search);
  69 |   await page
  70 |     .locator("div.cursor-pointer")
  71 |     .filter({ hasText: option })
  72 |     .first()
  73 |     .click({ force: true });
  74 |   await expect(page.getByPlaceholder("Buscar...")).not.toBeVisible();
  75 |   return select;
  76 | }
  77 | 
  78 | export async function expectVisible(locator: Locator) {
  79 |   await expect(locator).toBeVisible();
  80 |   return locator;
  81 | }
  82 | 
  83 | export function uniqueSuffix() {
  84 |   return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  85 | }
  86 | 
```