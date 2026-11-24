import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Pagos', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Pagos (específicamente desde el sidebar/navegación)
    await page.getByRole('navigation').getByRole('button', { name: 'Pagos' }).click();
    await expect(
      page.getByRole('main').getByText('Gestión de Pagos', { exact: false }).first(),
    ).toBeVisible();
  });

  test('debe alternar entre las pestañas de Pagos y Descuentos', async ({ page }) => {
    const main = page.getByRole('main');
    
    // Ir a pestaña Descuentos
    await main.getByRole('tab', { name: 'Descuentos', exact: true }).click();
    await expect(main.getByRole('tab', { name: 'Descuentos', exact: true }))
      .toHaveAttribute('aria-selected', 'true');

    // Volver a pestaña Pagos
    await main.getByRole('tab', { name: 'Pagos', exact: true }).click();
    await expect(page.getByText('Ingresos del Mes')).toBeVisible();
  });

  test('debe abrir el formulario de Nuevo Pago', async ({ page }) => {
    await page.getByRole('button', { name: 'Registrar Pago' }).click();
    await expect(page.getByRole('heading', { name: 'Registrar Pago' })).toBeVisible();
    
    // Verificar campos del formulario (scope to form)
    const form = page.locator('form');
    await expect(form.getByText('Paciente', { exact: true })).toBeVisible();
    await expect(form.getByText('Precio por Sesión (Bs.)')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe abrir el modal de exportación de pagos', async ({ page }) => {
    await page.getByRole('button', { name: 'Exportar' }).click();
    await expect(page.getByRole('heading', { name: 'Exportar Pagos' })).toBeVisible();
    await page.keyboard.press('Escape');
  });
});
