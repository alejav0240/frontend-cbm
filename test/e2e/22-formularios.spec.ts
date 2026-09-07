import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Gestión de Formularios', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Formularios
    await page.getByRole('button', { name: 'Formularios' }).click();
    await expect(page.getByText('Gestión de Formularios', { exact: false })).toBeVisible();
  });

  test('debe alternar entre las pestañas de Plantillas, Asignaciones y Respuestas', async ({ page }) => {
    // Pestaña Asignaciones
    await page.getByRole('button', { name: 'Asignaciones' }).click();
    await expect(page.getByRole('table').locator('th').filter({ hasText: 'Asignado a' })).toBeVisible();

    // Pestaña Respuestas
    await page.getByRole('button', { name: 'Respuestas' }).click();
    await expect(page.getByRole('table').locator('th').filter({ hasText: 'Usuario' })).toBeVisible();

    // Volver a Plantillas
    await page.getByRole('button', { name: 'Plantillas' }).click();
    await expect(page.getByRole('heading', { name: 'Anamnesis Musical' })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Crear Nuevo Formulario', async ({ page }) => {
    await page.getByRole('button', { name: 'Crear Formulario' }).click();
    await expect(page.getByText('Crear Nuevo Formulario', { exact: true })).toBeVisible();
    
    // Verificar campos básicos
    await expect(page.getByText('Nombre del Formulario')).toBeVisible();
    await expect(page.getByText('Descripción')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir previsualizar un formulario', async ({ page }) => {
    // Buscar el primer botón de previsualización (icono de ojo)
    const previewButton = page.getByTitle('Vista Previa').first();
    await previewButton.click();
    
    await expect(page.getByText('Vista Previa:', { exact: false })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('debe permitir abrir el modal de asignación de formulario', async ({ page }) => {
    // Buscar el primer botón de asignar (icono de enviar)
    const assignButton = page.getByTitle('Asignar').first();
    await assignButton.click();
    
    await expect(page.getByText('Asignar Formulario', { exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
