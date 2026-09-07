import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Análisis (Reports)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Análisis
    await page.getByRole('button', { name: 'Análisis' }).click();
    await expect(page.getByText('Análisis e Informes', { exact: false })).toBeVisible();
  });

  test('debe mostrar los gráficos de salud financiera e impacto terapéutico', async ({ page }) => {
    // Verificar que los contenedores de los gráficos estén presentes
    await expect(page.getByText('Salud Financiera', { exact: true })).toBeVisible();
    await expect(page.getByText('Impacto Terapéutico', { exact: true })).toBeVisible();
    await expect(page.getByText('Distribución de Pacientes')).toBeVisible();
  });

  test('debe permitir cambiar el rango de tiempo', async ({ page }) => {
    // Los selectores de tiempo son botones en un flex container
    const trimesterBtn = page.getByRole('button', { name: 'Trimestre', exact: true });
    await expect(trimesterBtn).toBeVisible();
    await trimesterBtn.click();
    
    // Al ser un mock, simplemente verificamos que el botón reciba el clic
    // (En una app real podríamos verificar que los datos cambien)
    await expect(trimesterBtn).toHaveClass(/bg-\[#008080\]/);
  });
});
