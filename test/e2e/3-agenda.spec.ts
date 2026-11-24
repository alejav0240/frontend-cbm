import { expect, expectDialogHeading, fillSearchableSelect, openDashboardView, test } from './support/e2e';

test.describe('Vista de Agenda', () => {
  test.beforeEach(async ({ page }) => {
    await openDashboardView(page, 'Agenda', 'Agenda');
  });

  test('debe cambiar entre los diferentes modos de vista', async ({ page }) => {
    for (const viewName of ['Calendario', 'Por Horas', 'Terapeutas']) {
      const button = page.getByRole('button', { name: viewName });
      await expect(button).toBeVisible();
      await button.click();
      await expect(button).toHaveClass(/bg-white/);
    }
  });

  test('debe abrir el formulario de Nueva Cita y permitir buscar un paciente', async ({ page }) => {
    await page.getByRole('button', { name: 'Nueva Cita' }).click();

    await expectDialogHeading(page, 'Nueva Cita');

    const patientSelect = page.getByText('Paciente', { exact: true }).locator('..').locator('.cursor-pointer').first();
    await patientSelect.click({ force: true });
    await page.getByPlaceholder('Buscar...').fill('Juan');
    const patientOption = page.locator('div.cursor-pointer').filter({ hasText: 'Juan Pérez' }).first();
    test.skip(
      !(await patientOption.isVisible()),
      'Requiere pacientes sembrados en el backend E2E',
    );
    await patientOption.click({ force: true });
    await expect(page.getByPlaceholder('Buscar...')).not.toBeVisible();
    await expect(patientSelect).toContainText('Juan Pérez');

    const therapistSelect = await fillSearchableSelect(page, 'Terapeuta', 'María René', 'Lic. María René Vargas');
    await expect(therapistSelect).toContainText('Lic. María René Vargas');

    // Llenar otros campos (usando selectores alternativos a getByLabel)
    const fechaInput = page.locator('div').filter({ hasText: /^Fecha$/ }).locator('input[type="date"]');
    const horaInput = page.locator('div').filter({ hasText: /^Hora$/ }).locator('input[type="time"]');

    await fechaInput.fill('2026-05-01');
    await horaInput.fill('10:30');

    // Cerrar el modal
    await page.keyboard.press('Escape');
  });

  test('debe abrir el formulario de Sesión de Prueba', async ({ page }) => {
    await page.getByRole('button', { name: 'Sesión de Prueba' }).click();
    
    const dialog = await expectDialogHeading(page, 'Agendar Sesión de Prueba');
    await expect(dialog.getByText('Nombre del Paciente', { exact: true })).toBeVisible();
    
    // Cerrar el modal
    await page.keyboard.press('Escape');
  });

  test('debe permitir navegar entre fechas', async ({ page }) => {
    const datePicker = page.getByRole('combobox', { name: 'Seleccionar fecha' });
    await expect(datePicker).toBeVisible();
    await datePicker.click();
    await expect(page.getByRole('button', { name: 'Ir a Hoy' })).toBeVisible();
    await page.getByRole('button', { name: 'Ir a Hoy' }).click();
  });
});
