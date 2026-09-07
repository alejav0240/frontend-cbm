import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Instituciones', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Instituciones
    await page.getByRole('button', { name: 'Instituciones' }).click();
    await expect(page.getByText('Convenios Institucionales', { exact: false })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nueva Institución', async ({ page }) => {
    await page.getByRole('button', { name: 'Nueva Institución' }).click();
    await expect(page.getByRole('heading', { name: 'Nueva Institución' })).toBeVisible();
    
    // Verificar campos (buscando por el texto de las etiquetas)
    await expect(page.getByText('Nombre de la Institución')).toBeVisible();
    await expect(page.getByText('Persona de Contacto')).toBeVisible();
    
    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'Nueva Institución' })).not.toBeVisible();
  });

  test('debe navegar al detalle de una institución y abrir formulario de grupo', async ({ page }) => {
    // Seleccionar la primera institución de la lista
    const firstInstitution = page.getByText('Colegio San Pepito').first();
    await firstInstitution.click();
    
    await expect(page.getByText('Volver a Instituciones')).toBeVisible();
    
    // Abrir formulario de nuevo grupo
    await page.getByRole('button', { name: 'Nuevo Grupo' }).click();
    const heading = page.getByRole('heading', { name: 'Crear Nuevo Grupo' });
    await expect(heading).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(heading).not.toBeVisible();
    
    // Volver a la lista
    await page.getByRole('button', { name: 'Volver a Instituciones' }).click();
    await expect(page.getByText('Convenios Institucionales', { exact: false })).toBeVisible();
  });

  test('debe navegar al detalle de un grupo y abrir formulario de sesión', async ({ page }) => {
    // Ir a la institución primero
    await page.getByText('Colegio San Pepito').first().click();
    
    // Seleccionar un grupo
    const firstGroup = page.getByText('Grupo A - Primaria').first();
    await firstGroup.click();
    
    await expect(page.getByText('Volver a Grupos')).toBeVisible();
    
    // Abrir formulario de nueva sesión
    await page.getByRole('button', { name: 'Nueva Sesión' }).click();
    const heading = page.getByRole('heading', { name: 'Programar Sesión Grupal' });
    await expect(heading).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(heading).not.toBeVisible();
  });
});
