// src/pages/Billing.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBills, updateBillStatus } from "../api/billingApi";
import Button from "../components/Button";
import Loader from "../components/Loader";
import toast from 'react-hot-toast';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const billResponse = await getBills();
      setBills(billResponse.data || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Failed to fetch bills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (billId, newStatus) => {
    const originalBills = [...bills];
    // Optimistically update the UI for a responsive feel
    setBills(bills.map(b => b.id === billId ? { ...b, status: newStatus } : b));

    try {
      // The API call now returns a specific message
      const response = await updateBillStatus(billId, newStatus);
      toast.success(response.message || "Status updated!"); // Use the response message
    } catch (error) {
      // Also use the specific error message from the backend
      toast.error(error.response?.data?.message || "Failed to update status.");
      setBills(originalBills); // Revert the UI change on error
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.bill_no?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredBills.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredBills.length / rowsPerPage) || 1;

  const paginate = (pageNumber) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setPageLoading(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Billing History</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by Invoice ID..."
            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto relative">
        {pageLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <Loader />
            </div>
          )}
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Invoice ID</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Total Amount</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? currentRows.map((bill) => (
                <tr key={bill.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-sm text-gray-800">{bill.bill_no}</td>
                  <td className="p-4 text-gray-600">{new Date(bill.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right font-semibold text-gray-800">₹{parseFloat(bill.total_amount).toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <select
                      value={bill.status}
                      onChange={(e) => handleStatusChange(bill.id, e.target.value)}
                      className="text-sm font-semibold rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 capitalize"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <Link
                      to={`/bill/${bill.id}`}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No bills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBills.length > rowsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredBills.length)} of {filteredBills.length} records
          </span>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;