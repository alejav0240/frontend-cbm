import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Informes Terapéuticos', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Informes
    await page.getByRole('button', { name: 'Informes' }).click();
    await expect(page.getByText('Informes Terapéuticos', { exact: false })).toBeVisible();
  });

  test('debe permitir buscar informes por paciente', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar por paciente o título...');
    await searchInput.fill('Alejandro');
    // Debería filtrar los informes
  });

  test('debe abrir el formulario de Nuevo Informe', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Informe' }).click();
    await expect(page.getByText('Crear Nuevo Informe', { exact: true })).toBeVisible();
    
    // Verificar campos
    await expect(page.getByText('Paciente', { exact: true })).toBeVisible();
    await expect(page.getByText('Título del Informe')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe mostrar la lista de tutores', async ({ page }) => {
    await expect(page.getByText('Tutores Activos')).toBeVisible();
    // Debería haber una lista de pacientes/tutores
  });
});
