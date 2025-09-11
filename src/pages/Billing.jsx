import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBills } from "../api/billingApi";

// A new component for the illustration
const BillingIllustration = () => (
  <div className="text-center p-8">
    <svg className="w-full max-w-sm mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="20" width="120" height="160" rx="8" fill="#F3F4F6"/>
      <rect x="52" y="40" width="96" height="6" rx="3" fill="#D1D5DB"/>
      <rect x="52" y="56" width="60" height="6" rx="3" fill="#D1D5DB"/>
      <rect x="52" y="80" width="96" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="52" y="90" width="96" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="52" y="100" width="70" height="4" rx="2" fill="#E5E7EB"/>
      <rect x="130" y="120" width="18" height="4" rx="2" fill="#9CA3AF"/>
      <rect x="52" y="140" width="96" height="8" rx="4" fill="#60A5FA"/>
      <path d="M85 5H115L110 20H90L85 5Z" fill="#3B82F6"/>
      <circle cx="130" cy="55" r="12" fill="#fff"/>
      <path d="M126 52L130 56L134 52" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M130 56V60" stroke="#34D399" strokeWidth="2" strokeLinecap="round"/>
    </svg>
    <h3 className="text-xl font-semibold text-gray-700 mt-6">View Your Past Invoices</h3>
    <p className="text-gray-500 mt-2">Select any bill from the list to view its details or print a copy.</p>
  </div>
);

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const billResponse = await getBills();
        setBills(billResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Billing History</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Side: Illustration */}
        <div className="bg-white p-6 rounded-xl shadow-lg hidden lg:block">
          <BillingIllustration />
        </div>

        {/* Right Side: Recent Bills List */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-3">Recent Bills</h2>
          {loading ? (
            <p className="text-gray-500 text-center py-8">Loading bills...</p>
          ) : (
            <ul className="space-y-2">
              {bills.map(bill => (
                <li key={bill.id} className="p-3 flex justify-between items-center rounded-lg transition-colors hover:bg-gray-50">
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Bill ID: {bill.id.substring(0, 15)}...</p>
                    <p className="text-xl font-bold text-gray-800">Total: ₹{parseFloat(bill.total_amount).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-gray-500">{new Date(bill.created_at).toLocaleDateString()}</p>
                    <Link to={`/bill/${bill.id}`} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors">
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;