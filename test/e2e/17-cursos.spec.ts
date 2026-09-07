import { expect, loginAsAdmin, test } from './support/e2e';

test.describe('Vista de Cursos', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);

    // Navegar a Cursos
    await page.getByRole('button', { name: 'Cursos', exact: true }).click();
    await expect(page.getByText('Gestión de Cursos', { exact: false })).toBeVisible();
  });

  test('debe mostrar las estadísticas de cursos', async ({ page }) => {
    await expect(page.getByText('Ingresos Totales')).toBeVisible();
    await expect(page.getByText('Total Estudiantes')).toBeVisible();
    await expect(page.getByText('Cursos Activos')).toBeVisible();
  });

  test('debe permitir abrir el formulario de Crear Nuevo Curso', async ({ page }) => {
    await page.getByRole('button', { name: 'Nuevo Curso' }).click();
    await expect(page.getByRole('heading', { name: 'Crear Nuevo Curso' })).toBeVisible();
    
    // Verificar que los campos de texto del formulario estén presentes (los labels)
    await expect(page.getByText('Nombre del Curso', { exact: true })).toBeVisible();
    await expect(page.getByText('Precio ($)', { exact: true })).toBeVisible();
    
    await page.keyboard.press('Escape');
  });

  test('debe permitir abrir el formulario de Inscribir Estudiante', async ({ page }) => {
    // El botón se llama "Inscribir Estudiante" según el snapshot
    await page.getByRole('button', { name: 'Inscribir Estudiante' }).first().click();
    
    // El título del modal contiene "Inscribir Estudiante"
    await expect(page.getByText('Inscribir Estudiante', { exact: false })).toBeVisible();
    await page.keyboard.press('Escape');
  });

  test('debe permitir ver la lista de estudiantes de un curso', async ({ page }) => {
    // El botón se llama "Ver Estudiantes" según el snapshot
    await page.getByRole('button', { name: 'Ver Estudiantes' }).first().click();
    
    await expect(page.getByText('Lista de estudiantes inscritos', { exact: false })).toBeVisible();
    
    // Volver a la lista de cursos
    await page.getByRole('button', { name: 'Volver a Cursos' }).click();
    await expect(page.getByRole('heading', { name: 'Gestión de Cursos' })).toBeVisible();
  });
});
