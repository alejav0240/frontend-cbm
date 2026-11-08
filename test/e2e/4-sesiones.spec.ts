import { expect, fillSearchableSelect, openDashboardView, test } from './support/e2e';
import type { Page } from '@playwright/test';

test.describe('Gestión de Sesiones', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await openDashboardView(page, /Sesiones/i);
    await expect(page.getByRole('heading', { name: /Ciclos y Sesiones/i })).toBeVisible();
  });

  test('debe crear una nueva sesión correctamente', async ({ page }) => {
    // 1. Abrir modal de nueva sesión
    await page.getByRole('button', { name: /Nueva Sesión/i }).click({ force: true });
    await expect(page.getByRole('heading', { name: 'Nueva Sesión' })).toBeVisible();

    // 2. Llenar el formulario
    // Cliente (SearchableSelect)
    await fillSearchableSelect(page, 'Paciente', 'Javier', /Javier Chipana/i);

    await page.locator('input[type="number"]').first().fill('10');
    await page.locator('input[name="sessionDate"]').fill('2026-05-20');

    // Terapeuta (SearchableSelect)
    await fillSearchableSelect(page, 'Terapeuta', 'Alejandro', /Alejandro Chipana/i);

    // Tipo de Sesión (SearchableSelect)
    await page.locator('select').selectOption('individual');

    await page.locator('input[type="number"]').last().fill('60');

    // 3. Enviar
    await page.getByRole('button', { name: /Crear Cita/i }).click();

    // 4. Verificar éxito
    await expect(page.getByText(/Sesión creada correctamente/i)).toBeVisible();
  });

  async function mostrarAcciones(page: Page) {
    const scroller = page.locator('table').first().locator('..');
    await scroller.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
  }

  async function abrirMenuAcciones(page: Page, row: ReturnType<Page['locator']>) {
    await mostrarAcciones(page);
    await row.locator('button').last().click();
  }

  test('debe iniciar una sesión y navegar a la vista de sesión en curso', async ({ page }) => {
    // 1. Localizar la primera sesión y hacer hover para ver acciones
    const firstRow = page.locator('tbody tr').filter({ hasText: /Pendiente/i }).first();
    await abrirMenuAcciones(page, firstRow);

    // 2. Click en el botón "Iniciar Sesión" (Play icon)
    await page.getByRole('button', { name: 'Iniciar Sesión', exact: true }).click();

    // 3. Verificar que navegamos o cambia la vista
    await expect(page.getByText('En Vivo')).toBeVisible();
    await expect(page.getByRole('button', { name: /Finalizar/i })).toBeVisible();
  });

  test('debe marcar una sesión como completada desde la tabla', async ({ page }) => {
    const rowToComplete = page.locator('tbody tr').filter({ hasText: /Pendiente/i }).first();
    await abrirMenuAcciones(page, rowToComplete);

    // Click en "Marcar como Completada" (Check icon)
    await page.getByRole('button', { name: 'Marcar Completada', exact: true }).click();

    // Buscar la fila por el número de sesión para validar el nuevo estado
    await expect(rowToComplete).toContainText(/Completada/i);
  });

  test('debe ver detalles de una sesión y editar notas', async ({ page }) => {
    const firstRow = page.locator('tbody tr').first();
    await abrirMenuAcciones(page, firstRow);

    // Ver detalles
    await page.getByRole('button', { name: 'Ver Detalles', exact: true }).click();

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
    const sessionNum = await firstRow.locator('td').nth(1).textContent();
    await abrirMenuAcciones(page, firstRow);
    await page.getByRole('button', { name: 'Eliminar', exact: true }).click();

    // Confirmar en el modal
    await page.getByRole('button', { name: 'Eliminar', exact: true }).click();

    // Verificar éxito
    await expect(page.getByText(/Sesión eliminada correctamente/i)).toBeVisible();
    await expect(page.locator('tbody tr').filter({ hasText: sessionNum?.trim() || '#invalid' })).toHaveCount(0);
  });
});
