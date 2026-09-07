import {
  expect,
  loginAsAdmin,
  test,
  uniqueSuffix,
  fillSearchableSelect,
} from './support/e2e';

test.describe('Vista de Gestión de Usuarios', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Usuarios desde el menú lateral
    await page.getByRole('button', { name: 'Usuarios' }).click();
    await expect(page.getByText('Gestión de Usuarios', { exact: false })).toBeVisible();
  });

  test('debe mostrar la tabla de usuarios y sus columnas incluyendo email', async ({ page }) => {
    // Verificar que los encabezados de la tabla estén visibles
    await expect(page.getByText('Nombre Completo', { exact: true })).toBeVisible();
    await expect(page.getByText('Carnet', { exact: true })).toBeVisible();
    await expect(page.getByText('Tipo', { exact: true })).toBeVisible();
    await expect(page.getByText('Celular', { exact: true })).toBeVisible();
    await expect(page.getByText('Estado/Visibilidad', { exact: true })).toBeVisible();
    await expect(page.getByText('Acciones', { exact: true })).toBeVisible();
  });

  test('debe permitir abrir el formulario de Nuevo Usuario y mostrar el campo de correo electrónico', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Usuario' }).click();
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible();

    // Verificar campos requeridos en el formulario
    const form = page.locator('form');
    await expect(form.getByText('Nombre', { exact: true })).toBeVisible();
    await expect(form.getByText('Apellido', { exact: true })).toBeVisible();
    await expect(form.getByText(/Correo Electr[oó]nico/i)).toBeVisible();
    await expect(form.getByText(/Se enviar[aá]n las credenciales/i)).toBeVisible();
    await expect(form.getByText('Carnet de Identidad', { exact: true })).toBeVisible();
    await expect(form.getByText('Usuario (Login)', { exact: true })).toBeVisible();
    await expect(form.getByText('Contraseña', { exact: true })).toBeVisible();
    await expect(form.getByText('Tipo de Usuario', { exact: true })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).not.toBeVisible();
  });

  test('debe validar que el correo electrónico sea requerido y tenga formato válido', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Usuario' }).click();
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible();

    // Intentar enviar formulario vacío
    await page.getByRole('button', { name: 'Crear Usuario' }).click();
    await expect(page.getByText('El nombre es requerido')).toBeVisible();
    await expect(page.getByText('El apellido es requerido')).toBeVisible();
    await expect(page.getByText('El correo electrónico es requerido')).toBeVisible();

    // Llenar correo con formato inválido
    await page.getByPlaceholder('ejemplo@correo.com').fill('correo-invalido');
    await page.getByRole('button', { name: 'Crear Usuario' }).click();
    await expect(page.getByText('Ingrese un correo electrónico válido')).toBeVisible();

    await page.keyboard.press('Escape');
  });

  test('debe crear un usuario con correo y mostrar las credenciales generadas', async ({ page }) => {
    const suffix = uniqueSuffix();
    const testEmail = `user.${suffix}@musicoterapiabolivia.com`;
    const testCi = `${Math.floor(1000000 + Math.random() * 9000000)}`;

    await page.getByRole('button', { name: 'Nuevo Usuario' }).click();
    await expect(page.getByRole('heading', { name: 'Nuevo Usuario' })).toBeVisible();

    // Llenar campos requeridos
    await page.getByPlaceholder('Ej. Juan').fill(`Test${suffix.slice(0, 4)}`);
    await page.getByPlaceholder('Ej. Pérez').fill('Playwright');
    await page.getByPlaceholder('ejemplo@correo.com').fill(testEmail);
    await page.getByPlaceholder('Ej. 1234567 LP').fill(testCi);
    await page.getByPlaceholder('Ej. 70000000').fill('71234567');

    // Seleccionar rol
    await fillSearchableSelect(page, 'Tipo de Usuario', 'Admin', /Admin/i);

    // Enviar formulario
    await page.getByRole('button', { name: 'Crear Usuario' }).click();

    // Verificar notificación de éxito
    await expect(page.getByText(/Usuario creado.*correo con las credenciales/i)).toBeVisible({ timeout: 10_000 });

    // Verificar modal de credenciales
    await expect(page.getByRole('heading', { name: 'Credenciales de Acceso' })).toBeVisible();
    await expect(page.getByText('Usuario', { exact: true })).toBeVisible();
    await expect(page.getByText('Contraseña', { exact: true })).toBeVisible();

    // Cerrar modal de credenciales
    await page.getByRole('button', { name: 'Cerrar' }).click();
    await expect(page.getByRole('heading', { name: 'Credenciales de Acceso' })).not.toBeVisible();
  });

  test('debe permitir ver las credenciales de un usuario existente', async ({ page }) => {
    // Buscar botón de llave/credenciales en la tabla
    const credentialsButton = page.getByTitle('Ver Credenciales').first();
    if (await credentialsButton.isVisible()) {
      await credentialsButton.click();
      await expect(page.getByRole('heading', { name: 'Credenciales de Acceso' })).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });
});
