import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Evaluaciones', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión
    await loginAsAdmin(page);

    // Navegar a Evaluaciones
    await page.getByRole('button', { name: 'Evaluaciones' }).click();
    await expect(page.getByText('Evaluaciones Clínicas', { exact: false })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nueva Evaluación', async ({ page }) => {
    await page.getByRole('button', { name: 'Nueva Evaluación' }).click();
    await expect(page.getByRole('heading', { name: 'Nueva Evaluación' })).toBeVisible();
    
    // Verificar campos básicos
    await expect(page.getByText('Paciente', { exact: true })).toBeVisible();
    await expect(page.getByText('Escala de Evaluación', { exact: true })).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir ver los detalles de una evaluación', async ({ page }) => {
    // Buscamos una tarjeta de evaluación y hacemos clic en ella (toda la tarjeta es clickable)
    const firstCard = page.locator('h3').filter({ hasText: /./ }).first();
    await firstCard.click();
    
    // Debería abrirse el EvaluationDetailsModal
    await expect(page.getByRole('heading', { name: 'Detalle de Evaluación' })).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
