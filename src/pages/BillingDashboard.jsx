import { useEffect, useState } from 'react';
import { getBills, getBillingStats } from '../api/billingApi';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const StatCard = ({ title, value, isCurrency = false }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-800">
      {isCurrency ? `₹${parseFloat(value).toFixed(2)}` : value}
    </p>
  </div>
);

const BillingDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, billsRes] = await Promise.all([
          getBillingStats(),
          getBills()
        ]);
        setStats(statsRes.data);
        setRecentBills(billsRes.data.slice(0, 5)); // Show latest 5
      } catch (error) {
        console.error("Failed to fetch billing dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Billing Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue Today" value={stats?.revenueToday || 0} isCurrency />
        <StatCard title="Bills Today" value={stats?.billsToday || 0} />
        <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} isCurrency />
        <StatCard title="Total Bills" value={stats?.totalBills || 0} />
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Bills</h2>
        <ul className="space-y-2">
          {recentBills.map(bill => (
            <li key={bill.id} className="p-3 flex justify-between items-center rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-semibold text-sm text-gray-700">Bill ID: {bill.id}</p>
                <p className="text-lg font-bold">Total: ₹{parseFloat(bill.total_amount).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500">{new Date(bill.created_at).toLocaleDateString()}</p>
                <Link to={`/bill/${bill.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-300">
                  View
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BillingDashboard;