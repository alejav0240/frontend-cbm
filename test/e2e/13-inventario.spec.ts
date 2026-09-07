import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Inventario (Inventory)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Inventario
    await page.getByRole('button', { name: 'Inventario' }).click();
    await expect(page.getByText('Inventario de', { exact: false })).toBeVisible();
  });

  test('debe mostrar las estadísticas de inventario', async ({ page }) => {
    await expect(page.getByText('Total Items', { exact: true })).toBeVisible();
    await expect(page.getByText('Disponibles', { exact: true })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Añadir Item', async ({ page }) => {
    await page.getByRole('button', { name: 'Añadir Item' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('heading', { name: 'Añadir Item al Inventario' })).toBeVisible();

    // Verificar campos (scoped to modal)
    await expect(modal.getByText('Nombre del Instrumento / Material')).toBeVisible();
    await expect(modal.getByText('Tipo', { exact: true })).toBeVisible();

    await page.keyboard.press('Escape');
  });

  test('debe permitir buscar en el inventario', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar instrumentos...');
    await searchInput.fill('Instrumento');
    // Debería filtrar la tabla
  });
});
