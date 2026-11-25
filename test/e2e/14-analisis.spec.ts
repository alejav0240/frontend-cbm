import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Análisis (Reports)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Análisis
    await page.getByRole('button', { name: 'Análisis' }).click();
    await expect(page.getByRole('heading', { name: 'Análisis y Estadísticas' })).toBeVisible();
  });

  test('debe mostrar los gráficos de salud financiera e impacto terapéutico', async ({ page }) => {
    // Verificar que los contenedores de los gráficos estén presentes
    await expect(page.getByText('Evolución y Crecimiento de Pacientes', { exact: true })).toBeVisible();
    await expect(page.getByText('Estado de Pacientes', { exact: true })).toBeVisible();
    await expect(page.getByText('Distribución por Diagnóstico', { exact: true })).toBeVisible();
  });

  test('debe permitir filtrar pacientes por diagnóstico', async ({ page }) => {
    const diagnosisFilter = page.locator('select').first();
    await expect(diagnosisFilter).toBeVisible();
    await diagnosisFilter.selectOption('Todos');
    await expect(diagnosisFilter).toHaveValue('Todos');
  });
});
