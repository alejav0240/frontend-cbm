import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const generatePatientsPDF = (patients: any[]) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Pacientes', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);
    autoTable(doc, {
        head: [["ID", "Nombre", "Edad", "Tutor", "Estado"]],
        body: patients.map(p => [p.idNumber || p.id, p.name, p.age, p.tutor, p.status]),
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: '#008080' },
    });
    return doc;
};

export const generatePatientsExcel = (patients: any[], fileName = 'reporte_pacientes') => {
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