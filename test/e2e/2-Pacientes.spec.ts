import { expect, openDashboardView, test, uniqueSuffix } from './support/e2e';
import path from 'path';

test.describe('Gestión de Pacientes', () => {
  // Configuramos modo serial para evitar conflictos de datos entre tests que dependen de la misma tabla
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await openDashboardView(page, /Pacientes/i, /Módulo de Clientes/i);
  });

  test('debe crear un nuevo paciente con foto correctamente', async ({ page }) => {
    // 1. Abrir el formulario de creación
    await page.getByRole('button', { name: /Nuevo Cliente/i }).click();
    
    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('heading', { name: /Registrar Nuevo Cliente/i })).toBeVisible();

    // 2. Llenar datos personales con un timestamp para evitar duplicados
    const timestamp = uniqueSuffix();
    await modal.getByPlaceholder('Ej. Juan').fill('Paciente');
    await modal.getByPlaceholder('Ej. Pérez').fill(`Test-${timestamp}`);
    await modal.locator('input[type="date"]').first().fill('2015-05-20');
    await modal.getByPlaceholder('Ej. 1234567').first().fill(timestamp.replace(/\D/g, '').slice(-8).padEnd(8, '0'));

    // 3. Subir foto
    await page.locator('input[type="file"]').setInputFiles(path.join(__dirname, 'test-assets', 'avatar.png'));

    // 4. Datos del tutor
    await modal.getByPlaceholder(/Ej\. María Pérez/i).fill('Tutor Test');
    await modal.getByPlaceholder(/Ej\. 7654321/i).fill('13085591');
    await modal.getByPlaceholder(/Ej\. 70012345/i).fill('77777777');
    await modal.getByPlaceholder(/Ej\. contacto@ejemplo\.com/i).fill('tutor@test.com');

    // 5. Enviar formulario
    await modal.getByRole('button', { name: /Crear Cliente/i }).click();

    // 6. Verificar éxito
    await expect(page.getByText(/Paciente registrado correctamente/i)).toBeVisible();
  });

  test('debe filtrar pacientes en la tabla', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/Buscar por nombre o carnet/i);
    await searchInput.fill('NombreInexistenteQueNoDeberiaEstar');
    
    // Debería mostrar mensaje de "no se encontraron resultados"
    await expect(page.getByText(/Mostrando 0 de 0 clientes/i)).toBeVisible();
  });

  test('debe completar el registro clínico desde el botón de acción en la tabla', async ({ page }) => {
    // 1. Buscar al paciente "Test"
    const searchInput = page.getByPlaceholder(/Buscar por nombre o carnet/i);
    await searchInput.fill('Test-');

    // 2. Hacer hover sobre la primera fila y click en "Completar Registro Clínico"
    const patientRow = page.getByRole('row', { name: /Test-/i }).first();
    await patientRow.hover();
    await patientRow.getByTitle('Completar Registro Clínico').click();

    const modal = page.getByRole('dialog');
    await expect(modal.getByRole('heading', { name: /Completar Registro Clínico/i })).toBeVisible();

    // 3. Llenar los campos obligatorios (Zod validation)
    await modal.getByPlaceholder(/Mejorar la comunicación verbal/i).fill('Objetivo de prueba para test');
    await modal.getByPlaceholder(/Sin limitaciones/i).fill('Físico ok');
    await modal.getByPlaceholder(/Estable/i).fill('Emocional ok');
    await modal.getByPlaceholder(/Acorde a edad/i).fill('Cognitivo ok');
    await modal.getByPlaceholder(/Introvertido/i).fill('Social ok');
    await modal.getByPlaceholder(/Musicoterapia Creativa/i).fill('Método de prueba');

    // 4. Guardar
    await modal.getByRole('button', { name: /Guardar Registro Clínico/i }).click();

    // 5. Verificar éxito
    await expect(page.getByText(/Registro clínico completado correctamente/i)).toBeVisible();
  });

  test('debe eliminar un paciente desde la tabla', async ({ page }) => {
    // 1. Buscar al paciente "Test"
    const searchInput = page.getByPlaceholder(/Buscar por nombre o carnet/i);
    await searchInput.fill('Test-');

    // 2. Hover y click en eliminar
    const patientRow = page.getByRole('row', { name: /Test-/i }).first();
    await patientRow.hover();
    await patientRow.getByTitle('Eliminar').click();

    // 3. Confirmar en el modal de eliminación
    const modal = page.getByRole('dialog');
    await modal.getByRole('button', { name: 'Eliminar Paciente' }).click();

    // 4. Verificar éxito con timeout extendido
    await expect(page.getByText(/Paciente eliminado correctamente/i)).toBeVisible({ timeout: 10000 });
  });
});
