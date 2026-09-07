import { expect, loginAsAdmin, logout, test } from "./support/e2e";

test.describe("Autenticación", () => {
  test("debe iniciar sesión con éxito y redirigir al dashboard", async ({
    page,
  }) => {
    await loginAsAdmin(page);
    await expect(page.getByText("Hola, ")).toBeVisible();
  });

  test("debe mostrar error con credenciales inválidas", async ({ page }) => {
    await page.goto("/login");

    await page.getByPlaceholder("usuario").fill("usuario_falso");
    await page.getByPlaceholder("••••••••").fill("pass_incorrecta");

    await page.getByRole("button", { name: "Iniciar Sesión" }).click();

    // Debería aparecer un mensaje de error (usando Sonner toast)
    await expect(page.getByText(/Error al iniciar sesión/i)).toBeVisible();
  });

  test("debe cerrar sesión correctamente", async ({ page }) => {
    await loginAsAdmin(page);
    await logout(page);

    await page.goto("/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});
