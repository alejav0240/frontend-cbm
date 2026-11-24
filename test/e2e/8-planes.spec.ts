import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Planes de Intervención', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión
    await loginAsAdmin(page);

    // Navegar a Planes
    await page.getByRole('button', { name: 'Planes' }).click();
    await expect(page.getByRole('heading', { name: 'Planes de Intervención', level: 1 })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nuevo Plan', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Plan' }).click();
    await expect(page.getByRole('heading', { name: 'Crear Plan de Intervención' })).toBeVisible();
    
    // Verificar campos
    await expect(page.getByText('Paciente', { exact: true })).toBeVisible();
    await expect(page.getByText('Objetivo Principal')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir expandir un plan y abrir el formulario de pasos', async ({ page }) => {
    // Expandir el primer plan haciendo clic en "Ver Detalles"
    const detailsButton = page.getByRole('button', { name: 'Ver Detalles' }).first();
    test.skip(
      !(await detailsButton.isVisible()),
      'Requiere planes sembrados en el backend E2E',
    );
    await detailsButton.click();
    
    // Buscar botón para añadir paso
    const addStepButton = page.getByRole('button', { name: 'Añadir Paso' }).first();
    await addStepButton.click();
    
    await expect(page.getByRole('heading', { name: 'Añadir Paso al Plan' })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('debe abrir el modal de exportación PDF', async ({ page }) => {
    // El botón de exportar está en la tarjeta
    const exportButton = page.getByTitle('Exportar PDF').first();
    test.skip(
      !(await exportButton.isVisible()),
      'Requiere planes sembrados en el backend E2E',
    );
    await exportButton.click();
    
    await expect(page.getByRole('heading', { name: 'Vista Previa de Plan de Intervención' })).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
