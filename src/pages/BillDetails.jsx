// src/pages/BillDetails.jsx

import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBillById } from '../api/billingApi';
import Loader from '../components/Loader';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../context/AuthContext';

// --- NEW COMPONENT to dynamically show the bill status ---
const StatusStamp = ({ status }) => {
  if (status === 'paid') {
    return (
      <div className="text-right border-4 border-green-500 text-green-500 p-2 rounded-lg rotate-[-12deg] translate-y-[-10px]">
        <h2 className="text-2xl font-bold tracking-wider">PAID</h2>
      </div>
    );
  }
  if (status === 'unpaid') {
    return (
      <div className="text-right border-4 border-yellow-500 text-yellow-500 p-2 rounded-lg rotate-[-12deg] translate-y-[-10px]">
        <h2 className="text-2xl font-bold tracking-wider">UNPAID</h2>
      </div>
    );
  }
  // Fallback for any other status
  return (
    <div className="text-right border-4 border-gray-500 text-gray-500 p-2 rounded-lg rotate-[-12deg] translate-y-[-10px]">
      <h2 className="text-2xl font-bold tracking-wider">{status?.toUpperCase()}</h2>
    </div>
  );
};


const BillDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchBill = async () => {
      try {
        setLoading(true);
        const response = await getBillById(id);
        if (response.success) {
          setBill(response.data);
        } else {
          setError(response.message || "Failed to fetch bill details.");
        }
      } catch (err) {
        setError("An error occurred while fetching the bill.");
        console.error("Fetch bill error:", err);
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
    if (!bill) return;
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

    autoTable(doc, { 
      html: '#bill-table',
      startY: 50,
      theme: 'striped',
      headStyles: { fillColor: [30, 41, 59] },
    });
    
    const finalY = doc.lastAutoTable.finalY;

    const subtotal = bill.total_amount - bill.gst_amount;
    doc.setFontSize(12);
    doc.text(`Subtotal:`, 150, finalY + 10, { align: "right" });
    doc.text(`₹${subtotal.toFixed(2)}`, 200, finalY + 10, { align: "right" });
    doc.text(`GST (18%):`, 150, finalY + 17, { align: "right" });
    doc.text(`₹${parseFloat(bill.gst_amount).toFixed(2)}`, 200, finalY + 17, { align: "right" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL:`, 150, finalY + 25, { align: "right" });
    doc.text(`₹${parseFloat(bill.total_amount).toFixed(2)}`, 200, finalY + 25, { align: "right" });
    
    doc.save(`Invoice-${bill.bill_no}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <Loader />
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="text-center p-10 bg-slate-100 min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-slate-600 mt-2">{error || "Bill not found."}</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-indigo-700">
          Go Back
        </button>
      </div>
    );
  }
  
  const subtotal = bill.total_amount - bill.gst_amount;

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-8 font-sans print:bg-white">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-lg shadow-2xl relative">
        
        <header className="flex justify-between items-start pb-6 border-b">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tighter">INVOICE</h1>
            <p className="text-slate-500">NEXUS Electronics</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-slate-700">{bill.bill_no}</h2>
            <p className="text-sm text-slate-500">Date: {new Date(bill.created_at).toLocaleDateString()}</p>
          </div>
        </header>

        <section className="flex justify-between mt-8">
          <div>
            <p className="font-semibold text-slate-600">Bill To:</p>
            <p className="text-slate-800 font-medium">{user?.username || 'Valued Customer'}</p>
            <p className="text-slate-500">{user?.email}</p>
          </div>
          {/* --- THIS IS THE DYNAMIC STAMP --- */}
          <StatusStamp status={bill.status} />
        </section>

        <section className="mt-8">
          <table id="bill-table" className="w-full text-left">
            <thead className="bg-slate-800 text-white text-sm uppercase">
              <tr>
                <th className="p-3 rounded-l-lg font-semibold">Item</th>
                <th className="p-3 text-center font-semibold">Qty</th>
                <th className="p-3 text-right font-semibold">Price</th>
                <th className="p-3 text-right rounded-r-lg font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {bill.items && bill.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-100">
                  <td className="p-3 font-medium text-slate-800">{item.name}</td>
                  <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                  <td className="p-3 text-right text-slate-600">₹{parseFloat(item.price).toFixed(2)}</td>
                  <td className="p-3 text-right font-medium text-slate-800">₹{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹{subtotal.toFixed(2)}</p>
            </div>
            <div className="flex justify-between">
              <p>GST (18%)</p>
              <p>₹{parseFloat(bill.gst_amount).toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-xl text-slate-800 border-t-2 border-slate-800 pt-2 mt-2">
              <p>Grand Total</p>
              <p>₹{parseFloat(bill.total_amount).toFixed(2)}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center mt-8 space-x-4 print:hidden">
        <button onClick={() => navigate(-1)} className="px-6 py-2.5 rounded-lg font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition">
          Back
        </button>
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