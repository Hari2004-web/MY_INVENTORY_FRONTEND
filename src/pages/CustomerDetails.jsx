import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCustomerHistory } from "../api/userApi";
import toast from 'react-hot-toast';

const CustomerDetails = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getCustomerHistory(id);
        setHistory(response.data || []);
      } catch (error) {
        toast.error("Failed to fetch purchase history.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchHistory();
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading Customer History...</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Customer Purchase History</h1>
        <Link to="/customers" className="text-blue-600 hover:underline">&larr; Back to All Customers</Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-semibold">Bill ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.map((bill) => (
                <tr key={bill.id} className="border-b">
                  <td className="p-4 font-mono text-sm text-gray-600">{bill.id}</td>
                  <td className="p-4">{new Date(bill.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right font-semibold">₹{parseFloat(bill.total_amount).toFixed(2)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" className="p-4 text-center text-gray-500">
                    This customer has not made any purchases yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;