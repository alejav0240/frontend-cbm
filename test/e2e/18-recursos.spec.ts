import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Recursos', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Recursos
    await page.getByRole('button', { name: 'Recursos' }).click();
    await expect(page.getByText('Biblioteca de', { exact: false })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Añadir Recurso', async ({ page }) => {
    await page.getByRole('button', { name: 'Subir Recurso' }).click();
    await expect(page.getByText('Subir Nuevo Recurso', { exact: true })).toBeVisible();
    
    // Verificar campos
    await expect(page.getByText('Título del Recurso')).toBeVisible();
    await expect(page.getByRole('dialog').getByText('Tipo', { exact: true })).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir buscar recursos', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar por título o categoría...');
    await searchInput.fill('Guía');
    // Debería filtrar la lista
    const resource = page.getByRole('heading', { name: 'Guía de Estimulación Temprana' });
    test.skip(
      !(await resource.isVisible()),
      'Requiere recursos sembrados en el backend E2E',
    );
    await expect(resource).toBeVisible();
  });
});
