import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Capture an element by id and generate a multi-page PDF (basic layout)
export async function generatePdfReport(elementId: string, fileName = 'madurai-report.pdf') {
  const el = document.getElementById(elementId);
  if (!el) throw new Error('Element not found: ' + elementId);

  // Ensure visible and stable
  const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: null });
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
  // If content larger than single page, fit into A4-ish pages
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Scale image to page while preserving aspect
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imgW = canvas.width * ratio;
  const imgH = canvas.height * ratio;

  pdf.addImage(imgData, 'PNG', (pageWidth - imgW) / 2, 20, imgW, imgH);
  pdf.save(fileName);
}
