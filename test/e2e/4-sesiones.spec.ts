import { expect, fillSearchableSelect, openDashboardView, test } from './support/e2e';

test.describe('Gestión de Sesiones', () => {
  test.beforeEach(async ({ page }) => {
    await openDashboardView(page, /Sesiones/i);
  });

  test('debe crear una nueva sesión correctamente', async ({ page }) => {
    // 1. Abrir modal de nueva sesión
    await page.getByRole('button', { name: /Nueva Sesión/i }).click();

    // 2. Llenar el formulario
    // Cliente (SearchableSelect)
    await fillSearchableSelect(page, 'Cliente', 'Juan', 'Juan Pérez');

    await page.getByPlaceholder(/Ej. 13/i).fill('10');
    await page.locator('input[type="date"]').fill('2026-05-20');

    // Terapeuta (SearchableSelect)
    await fillSearchableSelect(page, 'Terapeuta', 'María René', 'Lic. María René Vargas');

    // Tipo de Sesión (SearchableSelect)
    const typeSelect = page.getByText('Tipo de Sesión', { exact: true }).locator('..').locator('.cursor-pointer').first();
    await typeSelect.click({ force: true });
    await page.locator('div.cursor-pointer').filter({ hasText: 'Individual' }).first().click({ force: true });

    await page.getByPlaceholder(/Ej. 45/i).fill('60');

    // Esperar a que el backdrop del último select desaparezca
    await expect(page.locator('.fixed.inset-0.z-40')).not.toBeVisible();

    // 3. Enviar
    await page.getByRole('button', { name: /Registrar Sesión/i }).click();

    // 4. Verificar éxito
    await expect(page.getByText(/Sesión registrada/i)).toBeVisible();
  });

  test('debe iniciar una sesión y navegar a la vista de sesión en curso', async ({ page }) => {
    // 1. Localizar la primera sesión y hacer hover para ver acciones
    const firstRow = page.locator('tbody tr').first();
    await firstRow.hover();

    // 2. Click en el botón "Iniciar Sesión" (Play icon)
    await firstRow.getByTitle('Iniciar Sesión').click();

    // 3. Verificar que navegamos o cambia la vista
    await expect(page.getByText('En Vivo')).toBeVisible();
    await expect(page.getByRole('button', { name: /Finalizar/i })).toBeVisible();
  });

  test('debe marcar una sesión como completada desde la tabla', async ({ page }) => {
    const rowToComplete = page.locator('tbody tr').filter({ hasText: /Confirmada/i }).first();
    const sessionNum = await rowToComplete.locator('td').first().textContent();
    
    await rowToComplete.hover();

    // Click en "Marcar como Completada" (Check icon)
    await rowToComplete.getByTitle('Marcar como Completada').click();

    // Verificar toast
    await expect(page.getByText(/Sesión marcada como completada/i)).toBeVisible();
    
    // Buscar la fila por el número de sesión para validar el nuevo estado
    const updatedRow = page.locator('tbody tr').filter({ hasText: sessionNum || '' }).first();
    await expect(updatedRow.getByText(/Completada/i)).toBeVisible();
  });

  test('debe ver detalles de una sesión y editar notas', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    await firstRow.hover();

    // Ver detalles
    await firstRow.getByTitle('Ver Detalles').click();

    // En el modal, click en editar notas (si está disponible)
    const editBtn = page.getByRole('button', { name: /Editar Notas/i });
    if (await editBtn.isVisible()) {
      await editBtn.click();
      await page.locator('textarea').fill('Observaciones clínicas de prueba actualizadas.');
      await page.getByRole('button', { name: /Guardar Notas/i }).click();
      await expect(page.getByText(/Notas actualizadas/i)).toBeVisible();
    }
  });

  test('debe eliminar una sesión', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    const sessionNum = await firstRow.locator('td').first().textContent();
    
    await firstRow.hover();
    await firstRow.getByTitle('Eliminar').click();

    // Confirmar en el modal
    await page.getByRole('button', { name: /Eliminar Sesión/i }).click();

    // Verificar éxito
    await expect(page.getByText(/Sesión eliminada correctamente/i)).toBeVisible();
    await expect(page.getByText(sessionNum || '')).not.toBeVisible();
  });
});
