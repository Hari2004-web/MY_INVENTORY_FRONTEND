// src/pages/BillDetails.jsx

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBillById } from '../api/billingApi';
import Loader from '../components/Loader';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable directly

const BillDetails = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  // FIX: Update the downloadPdf function
  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, { html: '#bill-table' }); // Call autoTable as a function here
    doc.save(`bill-${id}.pdf`);
  };

  if (loading) {
    return <Loader />;
  }

  if (!bill) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Bill Not Found</h1>
        <Link to="/billing" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Billing
        </Link>
      </div>
    );
  }

  const subtotal = bill.total_amount - bill.gst_amount;

  return (
    <>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg print-container">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Invoice</h1>
          <p className="text-gray-500">NEXUS Electronics</p>
        </div>

        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold">Bill To:</h2>
            <p>Valued Customer</p>
          </div>
          <div className="text-right">
            <p><span className="font-semibold">Invoice #:</span> {bill.id}</p>
            <p><span className="font-semibold">Date:</span> {new Date(bill.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Add the id to the table for jspdf-autotable to find it */}
        <table id="bill-table" className="w-full mb-8">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-3">Item</th>
              <th className="p-3">Quantity</th>
              <th className="text-right p-3">Unit Price</th>
              <th className="text-right p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.name}</td>
                <td className="text-center p-3">{item.quantity}</td>
                <td className="text-right p-3">₹{parseFloat(item.price).toFixed(2)}</td>
                <td className="text-right p-3">₹{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-full md:w-1/2">
            <div className="flex justify-between p-2">
              <span className="font-semibold">Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2">
              <span className="font-semibold">GST:</span>
              <span>₹{parseFloat(bill.gst_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between bg-gray-200 p-3 rounded-md font-bold text-xl">
              <span>Total:</span>
              <span>₹{parseFloat(bill.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 no-print">
        <Link to="/billing" className="text-gray-600 bg-gray-200 px-6 py-2 rounded-md mr-4 hover:bg-gray-300">
          Back
        </Link>
        <button onClick={handlePrint} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Print Bill
        </button>
        {/* I've added a button to download the PDF, assuming that was your intention */}
        <button onClick={downloadPdf} className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 ml-2">
          Download PDF
        </button>
      </div>
    </>
  );
};

export default BillDetails;