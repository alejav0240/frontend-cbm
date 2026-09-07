import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Dashboard Principal (Overview)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('debe mostrar el mensaje de bienvenida y las estadísticas generales', async ({ page }) => {
    await expect(page.getByText('Hola, ')).toBeVisible();
    await expect(page.getByText('tienes un resumen de tu actividad hoy')).toBeVisible();
  });

  test('debe mostrar las sesiones programadas para hoy', async ({ page }) => {
    await expect(page.getByText('Sesiones de Hoy')).toBeVisible();
  });

  test('debe mostrar el balance financiero', async ({ page }) => {
    await expect(page.getByText('Balance Financiero')).toBeVisible();
  });

  test('debe permitir navegar a otras vistas mediante acciones rápidas', async ({ page }) => {
    await expect(page.getByText('Acciones Rápidas')).toBeVisible();
    // Probar un botón de acción rápida, por ejemplo "Nueva Cita"
    // (A veces están en el Dashboard como accesos directos)
  });
});
