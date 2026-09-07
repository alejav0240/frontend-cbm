import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Gestión de Blog', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Blog
    await page.getByRole('button', { name: 'Blog' }).click();
    await expect(page.getByText('Gestión de Blog', { exact: false })).toBeVisible();
  });

  test('debe listar los artículos del blog', async ({ page }) => {
    // Verificar que al menos un artículo esté presente
    const postCard = page.locator('.grid > div').first();
    await expect(postCard).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nuevo Artículo', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Artículo' }).click();
    
    // Usamos getByRole('heading') para diferenciar el título del modal del botón
    await expect(page.getByRole('heading', { name: 'Nuevo Artículo', exact: true })).toBeVisible();
    
    // Verificar campos usando placeholders (ya que los labels no tienen htmlFor)
    await expect(page.getByPlaceholder('Ej. Beneficios de la Musicoterapia')).toBeVisible();
    await expect(page.getByPlaceholder('Breve resumen para la tarjeta del blog...')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir previsualizar un artículo en el editor', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Artículo' }).click();
    
    // Cambiar a pestaña Vista Previa dentro del modal
    await page.getByRole('button', { name: 'Vista Previa' }).click();
    
    // Verificar que cambie el modo (podría aparecer el nombre del autor o la fecha)
    await expect(page.getByText('Dra. Elena Ríos')).toBeVisible();
    
    await page.keyboard.press('Escape');
  });
});
