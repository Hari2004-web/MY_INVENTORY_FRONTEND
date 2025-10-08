// src/components/modals/OrderDetailsModal.jsx

import { useEffect, useState } from 'react';
import { getBillById } from '../../api/billingApi';
import { useAuth } from '../../context/AuthContext';
import { generateInvoicePdf } from '../../utils/pdfGenerator';
import Loader from '../Loader';

// --- Order Tracker Component ---
const OrderTracker = ({ status }) => {
  const statuses = ['processing', 'shipped', 'delivered'];
  let currentStepIndex = statuses.indexOf(status);

  // If the status is 'paid' or 'unpaid', it's considered the first step.
  if (status === 'paid' || status === 'unpaid') {
      currentStepIndex = -1; // Not yet in the 'processing' stage, so the first step is active.
  }

  const displaySteps = ['Order Confirmed', ...statuses];

  return (
    <div className="w-full my-6 px-2">
      <div className="flex items-center">
        {displaySteps.map((step, index) => {
          // A step is active if its index is less than or equal to the current step's index + 1
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


const OrderDetailsModal = ({ isOpen, onClose, billId }) => {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && billId) {
      const fetchBillDetails = async () => {
        setLoading(true);
        try {
          const response = await getBillById(billId);
          setBill(response.data);
        } catch (error) {
          console.error("Failed to fetch bill details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBillDetails();
    }
  }, [isOpen, billId]);

  const handleDownloadPdf = () => {
    if (bill && user) {
      generateInvoicePdf(bill, user);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white text-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 text-left" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-800 transition-colors">&times;</button>
        </div>
        
        {loading ? (
          <div className="h-64 flex items-center justify-center"><Loader /></div>
        ) : bill ? (
          <div>
            {/* --- TRACKER COMPONENT IS NOW INCLUDED --- */}
            <OrderTracker status={bill.status} />

            <div className="mb-6 border-t pt-6">
              <p><strong>Invoice ID:</strong> <span className="font-mono">{bill.bill_no}</span></p>
              <p><strong>Date:</strong> {new Date(bill.created_at).toLocaleDateString()}</p>
              <p className="text-xl font-bold mt-2">Total Amount: ₹{parseFloat(bill.total_amount).toFixed(2)}</p>
            </div>
            <h3 className="font-semibold mb-4 border-t pt-4">Items in this order:</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {bill.items && bill.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={`http://localhost:5000${item.image_url}`} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x ₹{parseFloat(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-lg">₹{(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t flex justify-end">
              <button 
                onClick={handleDownloadPdf}
                className="px-6 py-2.5 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition"
              >
                Download PDF
              </button>
            </div>

          </div>
        ) : (
          <p>Could not load order details.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsModal;