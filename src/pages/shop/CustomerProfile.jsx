// src/pages/shop/CustomerProfile.jsx

import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getMyOrders } from "../../api/userApi";
import Loader from "../../components/Loader";
import toast from 'react-hot-toast';
import CustomerDetails from "../../components/CustomerDetails";
import Button from "../../components/Button";

// --- Status Badge Helper Component ---
const StatusBadge = ({ status }) => {
  const statusStyles = {
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const style = statusStyles[status] || statusStyles.default;
  const statusText = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${style}`}>
      {statusText}
    </span>
  );
};


const CustomerProfile = () => {
  const [orderData, setOrderData] = useState({ orders: [], totalPages: 1 });
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view');
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;

  useEffect(() => {
    if (currentView === 'orders') {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const response = await getMyOrders(currentPage);
          setOrderData(response.data || { orders: [], totalPages: 1 });
        } catch (error) {
          toast.error("Failed to fetch order history.");
          console.error("Error fetching orders:", error);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [currentView, currentPage]);

  const handleOrderClick = (billId) => {
    navigate(`/track-order/${billId}`);
  };

  const setPage = (page) => {
    setSearchParams({ view: 'orders', page: page });
  };

  const toggleOrdersView = () => {
    if (currentView === 'orders') {
      setSearchParams({});
    } else {
      setSearchParams({ view: 'orders', page: 1 });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal details and view your orders.</p>
        </div>
        
        <CustomerDetails />
        
        {/* --- NEW LINK TO WALLET PAGE --- */}
        <div className="text-center">
            <Link to="/wallet" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 transition-colors">
                View My Wallet
            </Link>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Orders</h2>
            <button 
              onClick={toggleOrdersView}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
            >
              {currentView === 'orders' ? "Hide Orders" : "View Orders"}
            </button>
          </div>

          {currentView === 'orders' && (
            loadingOrders ? (
                <div className="p-8 flex justify-center items-center h-64"><Loader /></div>
            ) : (
                <div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="p-4 font-semibold text-slate-600">Invoice ID</th>
                            <th className="p-4 font-semibold text-slate-600">Date</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">Total Amount</th>
                            <th className="p-4 font-semibold text-slate-600 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                            {orderData.orders.length > 0 ? (
                            orderData.orders.map((order) => (
                                <tr key={order.id} className="border-t border-slate-200 hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => handleOrderClick(order.id)}>
                                  <td className="p-4 font-semibold text-sm text-blue-600 font-mono">{order.bill_no}</td>
                                  <td className="p-4 text-slate-700">{new Date(order.created_at).toLocaleDateString()}</td>
                                  <td className="p-4 text-right font-bold text-slate-900">₹{parseFloat(order.total_amount).toFixed(2)}</td>
                                  <td className="p-4 text-center">
                                    <StatusBadge status={order.status} />
                                  </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-500">You have not placed any orders yet.</td>
                            </tr>
                            )}
                        </tbody>
                      </table>
                  </div>
                  {orderData.totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <Button onClick={() => setPage(currentPage - 1)} disabled={currentPage <= 1}>
                        &larr; Previous
                      </Button>
                      <span className="font-semibold text-gray-700">
                        Page {currentPage} of {orderData.totalPages}
                      </span>
                      <Button onClick={() => setPage(currentPage + 1)} disabled={currentPage >= orderData.totalPages}>
                        Next &rarr;
                      </Button>
                    </div>
                  )}
                </div>
            )
          )}
        </div>
        <div className="text-center mt-8">
            <Link to="/" className="text-indigo-600 hover:underline font-semibold">
                &larr; Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;