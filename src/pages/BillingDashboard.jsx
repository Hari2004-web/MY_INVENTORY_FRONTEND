import { useEffect, useState, useRef } from 'react';
import { getBills, getBillingStats } from '../api/billingApi';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// --- Icon Components ---
const RupeeIcon = () => <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 4h4m5 4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v1m-6 12h.01M6 12h.01M6 16h.01M10 16h.01M14 16h.01" /></svg>;
const BillIcon = () => <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const PrintIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>;


const StatCard = ({ title, value, icon, isCurrency = false }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:bg-slate-700/50 transition-colors duration-300">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      {icon}
    </div>
    <p className="text-4xl font-bold text-white mt-2">
      {isCurrency ? `₹${parseFloat(value).toLocaleString('en-IN')}` : value}
    </p>
  </div>
);

const WeeklyRevenueChart = ({ stats }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const data = {
      labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'],
      datasets: [{
          label: 'Revenue',
          data: [12000, 19000, 13000, 15000, 22000, 29000, stats?.revenueToday || 0],
          borderColor: '#22d3ee',
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#22d3ee',
          pointHoverRadius: 7,
          pointRadius: 5,
          tension: 0.4,
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(34, 211, 238, 0.3)');
            gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
            return gradient;
          },
      }],
    };
    setChartData(data);
  }, [stats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
    },
  };

  return <Line ref={chartRef} options={options} data={chartData} />;
};

const BillingDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, billsRes] = await Promise.all([getBillingStats(), getBills()]);
        setStats(statsRes.data);
        setRecentBills(billsRes.data.slice(0, 5));
      } catch (error) { console.error("Failed to fetch data:", error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="bg-slate-900 flex items-center justify-center h-screen"><Loader /></div>;

  return (
    <div className="bg-slate-900 text-slate-300 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Billing Dashboard</h1>
        <p className="text-slate-400 mt-1">Live financial overview for {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue Today" value={stats?.revenueToday || 0} icon={<RupeeIcon />} isCurrency />
        <StatCard title="Bills Today" value={stats?.billsToday || 0} icon={<BillIcon />} />
        <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} icon={<RupeeIcon />} isCurrency />
        <StatCard title="Total Bills" value={stats?.totalBills || 0} icon={<BillIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Weekly Revenue Trend</h2>
          <div className="h-80"><WeeklyRevenueChart stats={stats} /></div>
        </div>
        
        <div className="space-y-8">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {recentBills.map(bill => (
                <div key={bill.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                  <div>
                    <p className="font-semibold text-white">₹{parseFloat(bill.total_amount).toFixed(2)}</p>
                    <p className="text-xs text-slate-400 font-mono">{bill.invoice_id}</p>
                  </div>
                  <Link to={`/bill/${bill.id}`} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">View</Link>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
             <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
             <div className="flex flex-col gap-3">
                <Link to="/billing" className="w-full text-center px-4 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 transition-colors">View All Bills</Link>
                <button className="w-full px-4 py-3 flex items-center justify-center gap-2 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 transition-colors">
                  <PrintIcon /> Generate Report
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingDashboard;