import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../api/productApi";
import { getStocks } from "../api/stockApi";
import { getUsers } from "../api/userApi";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const ProductIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>;
const StockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H9a4 4 0 01-4-4V5a4 4 0 014-4h6a4 4 0 014 4v12a4 4 0 01-4 4z" /></svg>;

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ productCount: 0, stockCount: 0, managerCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productRes = await getProducts();
        const stockRes = await getStocks();
        
        let managerCount = 0;
        if (user.role === 'admin') {
          const userRes = await getUsers();
          managerCount = userRes.data.filter(u => u.role === 'manager').length;
        }

        setStats({
          productCount: productRes.data?.length || 0,
          stockCount: stockRes.data?.length || 0,
          managerCount: managerCount,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    };

    fetchStats();
  }, [user.role]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.username || 'User'}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Products" value={stats.productCount} icon={<ProductIcon />} color="bg-blue-500" />
        <StatCard title="Items in Stock" value={stats.stockCount} icon={<StockIcon />} color="bg-green-500" />
        {user.role === 'admin' && (
          <StatCard title="Active Managers" value={stats.managerCount} icon={<UserIcon />} color="bg-indigo-500" />
        )}
      </div>
    </div>
  );
};

export default Dashboard;