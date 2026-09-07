import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Perfil de Usuario', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Perfil (normalmente desde el menú de perfil)
    // El SidebarItem también puede tenerlo, pero vamos a probar el menú de la cabecera
    await page.locator('header').getByRole('button').last().click(); // Clic en el avatar/nombre
    await page.getByRole('button', { name: 'Mi Perfil' }).click();
    
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { name: 'Mi Perfil' })).toBeVisible();
  });

  test('debe mostrar la información básica del usuario', async ({ page }) => {
    await expect(page.getByText('Información de Contacto')).toBeVisible();
    await expect(page.getByText('Especialización')).toBeVisible();
  });

  test('debe permitir entrar en modo edición', async ({ page }) => {
    await page.getByRole('button', { name: 'Editar Perfil' }).click();
    await expect(page.getByRole('button', { name: 'Guardar Cambios' })).toBeVisible();
    
    // El botón de editar debería cambiar a guardar
    await page.getByRole('button', { name: 'Guardar Cambios' }).click();
    await expect(page.getByText('Perfil actualizado correctamente')).toBeVisible();
  });
});
