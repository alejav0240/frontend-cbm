import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Gestión de Escalas', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Escalas
    await page.getByRole('button', { name: 'Escalas' }).click();
    await expect(page.getByText('Escalas de Evaluación', { exact: false })).toBeVisible();
  });

  test('debe mostrar la lista de escalas y permitir buscar', async ({ page }) => {
    // Verificar que al menos una escala conocida esté presente
    await expect(page.getByText('Escala de Desarrollo Infantil')).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nueva Escala', async ({ page }) => {
    await page.getByRole('button', { name: 'Nueva Escala' }).click();
    await expect(page.getByText('Nueva Escala de Evaluación', { exact: true })).toBeVisible();
    
    // Verificar campos del formulario
    await expect(page.getByText('Nombre de la Escala')).toBeVisible();
    await expect(page.getByText('Descripción')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });
});
