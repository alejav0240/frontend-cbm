import { expect, loginAsAdmin, test } from './support/e2e';
import type { Page } from '@playwright/test';

// Configuramos modo serial para que no haya conflictos con el localStorage/estado
test.describe.configure({ mode: 'serial' });

async function createTestCycle(page: Page) {
  // Solo crear si no existe ya una tarjeta para Juan Pérez (para ahorrar tiempo en modo serial)
  if (await page.locator('h3').filter({ hasText: 'Juan Pérez' }).count() > 0) {
    return;
  }

  await page.getByRole('button', { name: 'Nuevo Ciclo' }).click();
  
  // Paciente
  const patientSelect = page.getByText('Paciente').locator('..').locator('.cursor-pointer').first();
  await patientSelect.click({ force: true });
  await page.getByPlaceholder('Buscar...').fill('Juan');
  await page.locator('div.cursor-pointer').filter({ hasText: 'Juan Pérez' }).first().click({ force: true });
  await expect(page.getByPlaceholder('Buscar...')).not.toBeVisible();

  // Terapeuta
  const therapistSelect = page.getByText('Terapeuta Responsable').locator('..').locator('.cursor-pointer').first();
  await therapistSelect.click({ force: true });
  await page.getByPlaceholder('Buscar...').fill('María');
  await page.locator('div.cursor-pointer').filter({ hasText: 'Lic. María René Vargas' }).first().click({ force: true });
  await expect(page.getByPlaceholder('Buscar...')).not.toBeVisible();

  // Enviar
  await page.getByRole('button', { name: 'Crear Ciclo' }).click({ force: true });
  await expect(page.getByText(/Ciclo de 4 sesiones creado/i)).toBeVisible();
}

test.describe('Gestión de Ciclos de Terapia', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('button', { name: 'Ciclos', exact: true }).click();
  });

  test('debe crear un nuevo ciclo de terapia correctamente', async ({ page }) => {
    await createTestCycle(page);
  });

  test('debe expandir un ciclo y completar una sesión', async ({ page }) => {
    await createTestCycle(page);
    const card = page.locator('div').filter({ has: page.locator('h3').filter({ hasText: 'Juan Pérez' }) }).first();
    await card.getByRole('button', { name: 'Ver Sesiones' }).click();
    
    // Verificar que las sesiones son visibles
    await expect(page.getByText(/Sesión 1/i).first()).toBeVisible();

    const completeBtn = page.getByRole('button', { name: 'Completar' }).first();
    await completeBtn.click();
    await expect(page.getByText(/Sesión marcada como completada/i)).toBeVisible();
  });

  test('debe cambiar el estado de pago de un ciclo', async ({ page }) => {
    await createTestCycle(page);
    const card = page.locator('div').filter({ has: page.locator('h3').filter({ hasText: 'Juan Pérez' }) }).first();
    const paymentBtn = card.getByTitle('Cambiar estado de pago del ciclo');
    
    await paymentBtn.click();
    await expect(page.getByText(/Estado de pago del ciclo actualizado/i)).toBeVisible();
  });

  test('debe eliminar un ciclo de terapia', async ({ page }) => {
    await createTestCycle(page);
    const card = page.locator('div').filter({ has: page.locator('h3').filter({ hasText: 'Juan Pérez' }) }).first();
    await card.getByTitle('Eliminar').click();
    await page.getByRole('button', { name: 'Eliminar Ciclo' }).click();
    await expect(page.getByText('Ciclo eliminado correctamente')).toBeVisible();
  });
});
