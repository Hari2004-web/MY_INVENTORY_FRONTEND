import { useEffect, useState, useRef } from 'react'; // 👈 1. Import useRef and useEffect
import { getBills, getBillingStats } from '../api/billingApi';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

// --- Icon Components ---
const RupeeIcon = () => <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v1m-6 12h.01M6 12h.01M6 16h.01M10 16h.01M14 16h.01" /></svg>;
const BillIcon = () => <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

const StatCard = ({ title, value, icon, isCurrency = false }) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
    <div className="flex items-center space-x-4">
      {icon}
      <p className="text-sm font-medium text-slate-400">{title}</p>
    </div>
    <p className="text-3xl font-bold text-white mt-2">
      {isCurrency ? `₹${parseFloat(value).toFixed(2)}` : value}
    </p>
  </div>
);

const WeeklyRevenueChart = ({ stats }) => {
  const chartRef = useRef(null); // 👈 2. Fixed
  const [chartData, setChartData] = useState({ datasets: [] }); // 👈 3. Fixed

  useEffect(() => { // 👈 4. Fixed
    const chart = chartRef.current;
    if (!chart) return;

    const data = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
      datasets: [
        {
          label: 'Revenue',
          data: [120, 190, 130, 150, 220, 290, (stats?.revenueToday || 0) / 100],
          borderColor: '#06b6d4', // Cyan
          borderWidth: 2,
          borderRadius: 6,
          pointBackgroundColor: '#fff',
          tension: 0.3,
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, 'rgba(6, 182, 212, 0.5)');
            gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
            return gradient;
          },
        },
      ],
    };
    setChartData(data);
  }, [stats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        ticks: { color: '#94a3b8', font: { weight: '600' } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
      },
      x: {
        ticks: { color: '#94a3b8', font: { weight: '600' } },
        grid: { display: false },
      },
    },
  };

  return <Bar ref={chartRef} options={options} data={chartData} />;
};

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
        setRecentBills(billsRes.data.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="bg-slate-900 flex items-center justify-center h-screen"><Loader /></div>;

  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Financial overview for Thursday, 11 September 2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue Today" value={stats?.revenueToday || 0} icon={<RupeeIcon />} isCurrency />
        <StatCard title="Bills Today" value={stats?.billsToday || 0} icon={<BillIcon />} />
        <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} icon={<RupeeIcon />} isCurrency />
        <StatCard title="Total Bills" value={stats?.totalBills || 0} icon={<BillIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Weekly Revenue (in ₹100s)</h2>
          <div className="h-80">
            <WeeklyRevenueChart stats={stats} />
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {recentBills.map(bill => (
              <div key={bill.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div>
                  <p className="font-semibold text-white">₹{parseFloat(bill.total_amount).toFixed(2)}</p>
                  <p className="text-xs text-slate-400 font-mono">{new Date(bill.created_at).toLocaleTimeString()}</p>
                </div>
                <Link to={`/bill/${bill.id}`} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                  View Bill
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;