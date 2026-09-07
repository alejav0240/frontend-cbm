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
      await expect(button).toHaveClass(/bg-\[#008080\]/);
    }
  });

  test('debe abrir el formulario de Nueva Cita y permitir buscar un paciente', async ({ page }) => {
    await page.getByRole('button', { name: 'Nueva Cita' }).click();

    await expectDialogHeading(page, 'Programar Nueva Cita');

    const patientSelect = await fillSearchableSelect(page, 'Paciente', 'Juan', 'Juan Pérez');
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
    const today = page.getByRole('button', { name: /Hoy/i });
    await expect(today).toBeVisible();
    await today.click();
    await expect(page.getByText(/Agenda/i).first()).toBeVisible();
  });
});
