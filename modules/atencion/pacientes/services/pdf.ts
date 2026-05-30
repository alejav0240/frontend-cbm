import { jsPDF } from 'jspdf';
import autoTable from "jspdf-autotable";

export const generatePatientsPDF = (patients: any[]) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Pacientes', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableColumn = ["ID", "Nombre", "Edad", "Tutor", "Estado"];
    const tableRows = patients.map(p => [
        p.idNumber || p.id,
        p.name,
        p.age,
        p.tutor,
        p.status
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        headStyles: { fillColor: '#008080' },
    });

    return doc;
};