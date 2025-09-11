import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBillById } from '../api/billingApi';
import Loader from '../components/Loader';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const BillDetails = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return; 

    const fetchBill = async () => {
      try {
        const response = await getBillById(id);
        setBill(response.data);
      } catch (error) {
        console.error("Failed to fetch bill details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBill();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const downloadPdf = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("NEXUS Electronics", 14, 35);
    doc.text(`Invoice #: ${bill.id}`, 200, 35, { align: "right" });
    doc.text("Bill To: Valued Customer", 14, 40);
    doc.text(`Date: ${new Date(bill.created_at).toLocaleDateString()}`, 200, 40, { align: "right" });

    autoTable(doc, { 
      html: '#bill-table',
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] }, // slate-800
    });
    
    const finalY = doc.lastAutoTable.finalY;

    const subtotal = bill.total_amount - bill.gst_amount;
    doc.setFontSize(12);
    doc.text(`Subtotal:`, 150, finalY + 10, { align: "right" });
    doc.text(`₹${subtotal.toFixed(2)}`, 200, finalY + 10, { align: "right" });
    doc.text(`GST:`, 150, finalY + 17, { align: "right" });
    doc.text(`₹${parseFloat(bill.gst_amount).toFixed(2)}`, 200, finalY + 17, { align: "right" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL:`, 150, finalY + 25, { align: "right" });
    doc.text(`₹${parseFloat(bill.total_amount).toFixed(2)}`, 200, finalY + 25, { align: "right" });
    
    doc.save(`Invoice-${bill.id.substring(0, 8)}.pdf`);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-800"><Loader /></div>;
  }

  if (!bill) {
    return (
      <div className="text-center p-10 bg-slate-800 text-white min-h-screen">
        <h1 className="text-2xl font-bold">Bill Not Found</h1>
        <Link to="/billing" className="text-blue-400 hover:underline mt-4 inline-block">
          Back to Billing History
        </Link>
      </div>
    );
  }

  const subtotal = bill.total_amount - bill.gst_amount;

  return (
    <div className="bg-slate-800 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-2xl print-container relative overflow-hidden">
        
        {/* --- Watermark --- */}
        <div className="absolute -top-16 -left-12 text-gray-100 text-[12rem] font-bold opacity-30 select-none pointer-events-none">
          NEXUS
        </div>

        {/* --- Header --- */}
        <header className="flex justify-between items-center z-10 relative">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Invoice</h1>
            <p className="text-slate-500">NEXUS Electronics</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold text-slate-700">Invoice #</h2>
            <p className="font-mono text-slate-500">{bill.id}</p>
          </div>
        </header>

        {/* --- Details & Paid Stamp --- */}
        <section className="flex justify-between items-end mt-12 z-10 relative">
          <div>
            <p className="font-semibold text-slate-600">Bill To:</p>
            <p>Valued Customer</p>
          </div>
          <div className="text-right">
             <p className="font-semibold text-slate-600">Date:</p>
             <p>{new Date(bill.created_at).toLocaleDateString()}</p>
          </div>
          <div className="border-4 border-green-500 text-green-500 p-2 rounded-lg rotate-[-12deg]">
             <h2 className="text-2xl font-bold tracking-wider">PAID</h2>
          </div>
        </section>

        {/* --- Items Table --- */}
        <section className="mt-8 z-10 relative">
          <table id="bill-table" className="w-full text-left">
            <thead className="bg-slate-800 text-white text-sm">
              <tr>
                <th className="p-3 rounded-l-lg">ITEM</th>
                <th className="p-3 text-center">QTY</th>
                <th className="p-3 text-right">PRICE</th>
                <th className="p-3 text-right rounded-r-lg">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {bill.items.map((item, index) => (
                <tr key={index}>
                  <td className="p-3 border-b border-slate-200 font-medium">{item.name}</td>
                  <td className="p-3 border-b border-slate-200 text-center">{item.quantity}</td>
                  <td className="p-3 border-b border-slate-200 text-right">₹{parseFloat(item.price).toFixed(2)}</td>
                  <td className="p-3 border-b border-slate-200 text-right font-medium">₹{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* --- Totals --- */}
        <section className="mt-6 flex justify-end z-10 relative">
          <div className="w-full max-w-sm space-y-2 text-slate-600">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>GST</p>
              <p>₹{parseFloat(bill.gst_amount).toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-xl text-slate-800 border-t-2 border-slate-800 pt-2 mt-2">
              <p>Grand Total</p>
              <p>₹{parseFloat(bill.total_amount).toFixed(2)}</p>
            </div>
          </div>
        </section>

      </div>

      {/* --- Action Buttons --- */}
      <div className="text-center mt-8 space-x-4 no-print">
        <Link to="/billing" className="px-6 py-2.5 rounded-lg font-semibold text-slate-400 bg-slate-700 hover:bg-slate-600 transition">
          Back
        </Link>
        <button onClick={handlePrint} className="px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition">
          Print
        </button>
        <button onClick={downloadPdf} className="px-6 py-2.5 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default BillDetails;