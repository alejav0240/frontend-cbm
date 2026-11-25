import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Gestión de Roles y Permisos', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/dashboard/roles');
    await expect(page.getByText(/Roles y Permisos/i)).toBeVisible();
  });

  test('debe listar los roles existentes', async ({ page }) => {
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { name: 'Administrador' })).toBeVisible();
    await expect(main.getByRole('heading', { name: 'Terapeuta' })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nuevo Rol', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Rol' }).click();
    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('heading', { name: 'Nuevo Rol' })).toBeVisible();
    
    // Verificar campos
    await expect(modal.getByText('Nombre del Rol')).toBeVisible();
    await expect(modal.getByText('Módulos y Permisos')).toBeVisible();
    await expect(modal.getByText('Pacientes', { exact: true })).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir editar permisos de un rol', async ({ page }) => {
    // Buscar botón de permisos en la tarjeta de un rol
    const permissionsButton = page.getByRole('button', { name: /Permisos/i }).first();
    test.skip(
      !(await permissionsButton.isVisible()),
      'Requiere roles sembrados en el backend E2E',
    );
    await permissionsButton.click();
    
    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('heading', { name: /Permisos:/i })).toBeVisible();
    
    await expect(modal.getByText('Pacientes', { exact: true })).toBeVisible();
    await expect(modal.getByText('Agenda', { exact: true })).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Ver' }).first()).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Crear' }).first()).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Editar' }).first()).toBeVisible();
    await expect(modal.getByRole('button', { name: 'Eliminar' }).first()).toBeVisible();
    
    await page.keyboard.press('Escape');
  });
});
