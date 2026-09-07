import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Gastos (Expenses)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Gastos
    await page.getByRole('button', { name: 'Gastos' }).click();
    await expect(page.getByText('Control de', { exact: false })).toBeVisible();
  });

  test('debe mostrar las estadísticas de gastos', async ({ page }) => {
    await expect(page.getByText('Total Egresos')).toBeVisible();
    await expect(page.getByText('Pagados', { exact: true })).toBeVisible();
    await expect(page.getByText('Pendientes', { exact: true })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Registrar Nuevo Gasto', async ({ page }) => {
    await page.getByRole('button', { name: 'Registrar Gasto' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('heading', { name: 'Registrar Nuevo Gasto' })).toBeVisible();

    // Verificar campos (scoped to modal)
    await expect(modal.getByText('Descripción')).toBeVisible();
    await expect(modal.getByText('Monto (Bs)')).toBeVisible();
    await expect(modal.getByText('Categoría', { exact: true })).toBeVisible();

    await page.keyboard.press('Escape');
  });
  test('debe permitir buscar gastos', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar por descripción o categoría...');
    await searchInput.fill('Servicios');
    // Debería filtrar la tabla
  });
});
