import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Marketing CRM', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Marketing
    await page.getByRole('button', { name: 'Marketing' }).click();
    await expect(page.getByText('Marketing Intelligence', { exact: false })).toBeVisible();
  });

  test('debe mostrar el dashboard de marketing con gráficos', async ({ page }) => {
    await expect(page.getByText('Inversión Total')).toBeVisible();
    await expect(page.getByText('Total Leads')).toBeVisible();
    // Gráficos
    await expect(page.getByText('Rendimiento de Campañas')).toBeVisible();
    await expect(page.getByText('Origen de Leads')).toBeVisible();
  });

  test('debe alternar entre pestañas de Campañas y Leads', async ({ page }) => {
    // Pestaña Campañas
    await page.getByRole('button', { name: 'Campañas', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Nueva Campaña' })).toBeVisible();

    // Pestaña Leads
    await page.getByRole('button', { name: 'Leads', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Nuevo Lead' })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nueva Campaña', async ({ page }) => {
    await page.getByRole('button', { name: 'Nueva Campaña' }).click();
    await expect(page.getByText('Crear Nueva Campaña', { exact: true })).toBeVisible();
    
    // Verificar campos
    await expect(page.getByText('Nombre de la Campaña')).toBeVisible();
    await expect(page.getByText('Plataforma')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir abrir el formulario de Nuevo Lead', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Lead' }).click();
    await expect(page.getByText('Registrar Nuevo Lead', { exact: true })).toBeVisible();
    
    // Verificar campos
    await expect(page.getByText('Nombre Completo')).toBeVisible();
    await expect(page.getByText('Teléfono / WhatsApp')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });
});
