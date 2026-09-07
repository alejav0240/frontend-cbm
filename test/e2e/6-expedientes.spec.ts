import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Expedientes Clínicos', () => {
  test.beforeEach(async ({ page }) => {
    // Iniciar sesión
    await loginAsAdmin(page);

    // Navegar a Expedientes
    await page.getByRole('button', { name: 'Expedientes', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Expedientes Clínicos' })).toBeVisible();
  });

  test('debe permitir buscar y seleccionar un paciente', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Buscar paciente por nombre o carnet...');
    await searchInput.fill('Juan');
    
    // Debería aparecer al menos un paciente con ese nombre
    const patientCard = page.getByText('Juan Pérez').first();
    await expect(patientCard).toBeVisible();
    
    // Seleccionar al paciente
    await patientCard.click();
    
    // Verificar que se muestra la cabecera del paciente seleccionado (usando el nombre como heading)
    await expect(page.getByRole('heading', { name: 'Juan Pérez' })).toBeVisible();
  });

  test('debe permitir abrir y cerrar el formulario de información clínica', async ({ page }) => {
    // Seleccionar un paciente primero
    await page.getByText('Juan Pérez').first().click();
    
    // Abrir formulario (es el botón con el icono de lápiz/PenTool en el header)
    // En PatientHeader es el botón después de "Cuestionario"
    const editButton = page.locator('button').filter({ has: page.locator('svg') }).nth(2); // El primero es Volver, el segundo es Cuestionario (si tiene texto), el tercero es Editar
    // Pero Cuestionario SI tiene texto. Vamos a buscar por el título del botón si lo tiene o por posición
    await page.getByRole('button', { name: 'Cuestionario' }).locator('..').locator('button').nth(1).click();
    
    await expect(page.getByRole('heading', { name: 'Actualizar Información Clínica' })).toBeVisible();
    
    // Cerrar formulario con el botón cancelar
    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page.getByRole('heading', { name: 'Actualizar Información Clínica' })).not.toBeVisible();
  });

  test('debe permitir abrir y cerrar el cuestionario de ingreso', async ({ page }) => {
    // Seleccionar un paciente primero
    await page.getByText('Juan Pérez').first().click();
    
    // Abrir cuestionario
    await page.getByRole('button', { name: 'Cuestionario' }).click();
    
    // El modal tiene un h2 con el título. Al abrirse el modal, hay dos h2 con ese texto:
    // 1. El de la vista de fondo (h2.text-lg)
    // 2. El del modal (h2.text-2xl)
    const modalHeading = page.locator('h2').filter({ hasText: 'Cuestionario de Ingreso' }).last();
    await expect(modalHeading).toBeVisible();
    await expect(modalHeading).toHaveClass(/text-2xl/); // Verificamos que sea el del modal
    
    // Cerrar usando el botón Cancelar que está dentro del modal
    // Usamos el texto "Cancelar" que suele ser único en el formulario abierto
    await page.getByRole('button', { name: 'Cancelar' }).click();
    
    // Verificar que el encabezado del modal ya no está (solo debería quedar el de la vista)
    await expect(page.locator('h2').filter({ hasText: 'Cuestionario de Ingreso' })).toHaveCount(1);
  });

  test('debe permitir volver a la lista de pacientes', async ({ page }) => {
    await page.getByText('Juan Pérez').first().click();
    await expect(page.getByRole('heading', { name: 'Juan Pérez' })).toBeVisible();
    
    // Botón para volver (flecha atrás)
    await page.getByRole('button', { name: 'Volver a la lista de pacientes' }).click();
    
    await expect(page.getByPlaceholder('Buscar paciente por nombre o carnet...')).toBeVisible();
  });
});
