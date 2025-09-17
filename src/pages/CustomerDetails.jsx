import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomerHistory } from "../api/userApi";
import toast from 'react-hot-toast';

const CustomerDetails = () => {
  // --- STATE MANAGEMENT ---
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Set to 10 rows per page

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchHistory = async () => {
      if (id) {
        try {
          const response = await getCustomerHistory(id);
          setHistory(response.data || []);
        } catch (error) {
          toast.error("Failed to fetch purchase history.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchHistory();
  }, [id]);

  // --- PAGINATION LOGIC ---
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = history.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(history.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // --- RENDER LOGIC ---
  if (loading) {
    return <div className="p-8 text-center">Loading Customer History...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Purchase History</h1>
        <Link to="/customers" className="text-blue-600 hover:underline">&larr; Back to All Customers</Link>
      </div>
      
      {/* --- DATA TABLE --- */}
      <div className="bg-white shadow-lg rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold text-gray-600">Invoice ID</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Total Amount</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? currentRows.map((bill) => (
                <tr key={bill.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-sm text-gray-800">{bill.invoice_id || `BILL-${bill.bill_no}`}</td>
                  <td className="p-4 text-gray-600">{new Date(bill.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right font-semibold text-gray-800">₹{parseFloat(bill.total_amount).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <Link 
                      to={`/bill/${bill.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    This customer has not made any purchases yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION CONTROLS --- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, history.length)} of {history.length} records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;