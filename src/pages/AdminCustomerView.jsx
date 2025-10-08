// src/pages/AdminCustomerView.jsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomerHistory } from "../api/userApi";
import toast from 'react-hot-toast';
import Button from "../components/Button";
import Loader from "../components/Loader";

// FIX: Renamed the component to avoid conflicts
const AdminCustomerView = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const fetchHistory = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await getCustomerHistory(id);
          setHistory(response.data || []);
        } catch (error) {
          console.error("Failed to fetch purchase history:", error);
          toast.error("Failed to fetch purchase history.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [id]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = history.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(history.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="p-8 flex justify-center items-center h-full"><Loader /></div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-900">Customer Purchase History</h1>
        <Link to="/customers" className="text-indigo-600 hover:underline text-sm">
          &larr; Back to All Customers
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Invoice ID</th>
                <th className="p-4 font-semibold text-slate-600">Date</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Total Amount</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((bill) => (
                  <tr key={bill.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-sm text-slate-800 font-mono">{bill.bill_no || `BILL-${bill.id}`}</td>
                    <td className="p-4 text-slate-700">{new Date(bill.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-right font-bold text-slate-900">₹{parseFloat(bill.total_amount).toFixed(2)}</td>
                    <td className="p-4 text-center">
                      <Link 
                        to={`/bill/${bill.id}`}
                        className="text-indigo-600 hover:underline font-semibold text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500">
                    This customer has no purchase history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-slate-600">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, history.length)} of {history.length} records
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// FIX: Export the renamed component
export default AdminCustomerView;