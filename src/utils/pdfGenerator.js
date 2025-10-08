// src/utils/pdfGenerator.js

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePdf = (bill, user) => {
  if (!bill || !bill.items) {
    console.error("Bill data is incomplete for PDF generation.");
    return;
  }

  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("NEXUS Electronics", 14, 35);
  doc.text(`Invoice ID: ${bill.bill_no}`, 200, 35, { align: "right" });
  doc.text(`Bill To: ${user?.username || 'Valued Customer'}`, 14, 40);
  doc.text(`Date: ${new Date(bill.created_at).toLocaleDateString()}`, 200, 40, { align: "right" });

  const tableHead = [['Item', 'Qty', 'Price', 'Total']];
  const tableBody = bill.items.map(item => [
    item.name,
    item.quantity,
    `₹${parseFloat(item.price).toFixed(2)}`,
    `₹${(item.quantity * item.price).toFixed(2)}`,
  ]);

  autoTable(doc, { 
    head: tableHead,
    body: tableBody,
    startY: 50,
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59] },
    styles: { halign: 'left' },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
    }
  });
  
  const finalY = doc.lastAutoTable.finalY;
  const subtotal = bill.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const gstAmount = bill.total_amount - subtotal;

  doc.setFontSize(12);
  doc.text(`Subtotal:`, 150, finalY + 10, { align: "right" });
  doc.text(`₹${subtotal.toFixed(2)}`, 200, finalY + 10, { align: "right" });
  doc.text(`GST:`, 150, finalY + 17, { align: "right" });
  doc.text(`₹${gstAmount.toFixed(2)}`, 200, finalY + 17, { align: "right" });
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL:`, 150, finalY + 25, { align: "right" });
  doc.text(`₹${parseFloat(bill.total_amount).toFixed(2)}`, 200, finalY + 25, { align: "right" });
  
  doc.save(`Invoice-${bill.bill_no}.pdf`);
};