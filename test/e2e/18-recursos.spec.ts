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
    await expect(page.getByText('Tipo', { exact: true })).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir buscar recursos', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar pacientes, sesiones, reportes...');
    await searchInput.fill('Guía');
    // Debería filtrar la lista
    await expect(page.getByRole('heading', { name: 'Guía de Estimulación Temprana' })).toBeVisible();
  });
});
