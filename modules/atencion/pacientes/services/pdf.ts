import { NormalizedPatient } from '@/modules/atencion/pacientes/types/patient';

export const generatePatientsPDF = async (patients: NormalizedPatient[]) => {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
    ]);
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Pacientes', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);
    autoTable(doc, {
        head: [["ID", "Nombre", "Diagnóstico", "Estado", "Tutor"]],
        body: patients.map(p => [p.idNumber || p.id, p.name, p.diagnosis ?? '', p.status, p.tutor?.firstName ?? '']),
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: '#008080' },
    });
    return doc;
};

export const generatePatientsExcel = async (patients: NormalizedPatient[], fileName = 'reporte_pacientes') => {
    const XLSX = await import('xlsx');
    const rows = patients.map(p => ({
        ID: p.idNumber || p.id,
        Nombre: p.name,
        'Fecha Nacimiento': p.birthDate ?? '',
        Diagnóstico: p.diagnosis ?? '',
        Estado: p.status,
        Tutor: p.tutor?.firstName ?? '',
        'Teléfono Tutor': p.tutor?.celular ?? '',
        'Registro Completo': p.registrationComplete ? 'Sí' : 'No',
        'Fecha Registro': p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pacientes');
    XLSX.writeFile(wb, `${fileName}_${Date.now()}.xlsx`);
};
