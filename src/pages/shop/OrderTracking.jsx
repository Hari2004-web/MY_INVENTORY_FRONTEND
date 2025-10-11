import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBillById, cancelMyOrder } from '../../api/billingApi';
import { useAuth } from '../../context/AuthContext';
import { generateInvoicePdf } from '../../utils/pdfGenerator';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

// --- THIS IS THE ORDER TRACKER COMPONENT ---
const OrderTracker = ({ status }) => {
  const statuses = ['processing', 'shipped', 'delivered'];
  let currentStepIndex = statuses.indexOf(status);

  // If the status is 'paid' or 'unpaid', it's the first step.
  if (status === 'paid' || status === 'unpaid') {
      currentStepIndex = -1; // Not yet in the 'processing' stage.
  }

  // Define the steps to display
  const displaySteps = ['Order Confirmed', ...statuses];

  return (
    <div className="w-full my-6 px-2">
      <div className="flex items-center">
        {displaySteps.map((step, index) => {
          // A step is active if its index is at or before the current step
          const isActive = index <= currentStepIndex + 1;
          const isLastStep = index === displaySteps.length - 1;

          return (
            <div key={step} className={`flex-1 flex items-center ${isLastStep ? 'justify-center' : ''}`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  &#10003; {/* Checkmark Icon */}
                </div>
                <p className={`mt-2 text-xs font-semibold w-20 capitalize ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {step}
                </p>
              </div>
              {!isLastStep && (
                <div className={`flex-1 h-1 mx-2 transition-colors duration-300 ${isActive ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


const OrderTracking = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReturnable, setIsReturnable] = useState(false);

  // FIX 1: Wrap fetchBill in useCallback
  const fetchBill = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBillById(id);
      const billData = response.data;
      setBill(billData);

      if (billData && billData.status === 'delivered' && billData.delivered_at) {
        const deliveredDate = new Date(billData.delivered_at);
        const currentDate = new Date();
        const daysSinceDelivery = (currentDate - deliveredDate) / (1000 * 60 * 60 * 24);
        if (daysSinceDelivery <= 7) {
            setIsReturnable(true);
        }
      }
    } catch { // FIX 2: Removed unused 'err' variable
      toast.error("Could not load order details.");
    } finally {
      setLoading(false);
    }
  }, [id]); // useCallback depends on 'id'

  // FIX 3: Add fetchBill to the dependency array
  useEffect(() => {
    fetchBill();
  }, [fetchBill]);

  const handleCancelOrder = async () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      const loadingToast = toast.loading("Cancelling order...");
      try {
        const response = await cancelMyOrder(id);
        toast.success(response.message, { id: loadingToast });
        fetchBill();
      } catch (error) {
        toast.error(error.response?.data?.message || "Cancellation failed.", { id: loadingToast });
      }
    }
  };

  const handleDownloadPdf = () => {
    if (bill && user) {
        generateInvoicePdf(bill, user);
    }
  };

  const isCancellable = bill && !['shipped', 'delivered', 'cancelled'].includes(bill.status);

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader /></div>;
  }

  if (!bill) {
    return (
        <div className="flex flex-col h-screen items-center justify-center">
            <h1 className="text-2xl font-bold">Order not found.</h1>
            <Link to="/customer/profile?view=orders" className="mt-4 text-indigo-600 hover:underline font-semibold">
                &larr; Back to All Orders
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/customer/profile?view=orders" className="text-indigo-600 hover:underline font-semibold">
            &larr; Back to All Orders
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <div className="flex justify-between items-start pb-4 border-b">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
              <p className="text-gray-500 font-mono">{bill.bill_no}</p>
            </div>
            <button onClick={handleDownloadPdf} className="px-4 py-2 text-sm rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition">
              Download Invoice
            </button>
          </div>
          
          <OrderTracker status={bill.status} />
          
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mt-8 border-t pt-8">
            {bill.items?.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.quantity} x ₹{parseFloat(item.price).toFixed(2)}</p>
                </div>
                <p className="font-bold">₹{(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t flex justify-end gap-4">
            {isCancellable && (
                <button 
                    onClick={handleCancelOrder}
                    className="px-6 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
                >
                    Cancel Order
                </button>
            )}
            {isReturnable && (
                <Link to={`/return-order/${id}`}>
                    <button className="px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition">
                        Request Return
                    </button>
                </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;