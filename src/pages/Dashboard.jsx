import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../api/productApi";
import { getStocks } from "../api/stockApi";
import StockBarChart from "../components/charts/StockBarChart";
import ProductPieChart from "../components/charts/ProductPieChart";
import Loader from "../components/Loader";

// --- Icon Components for Stat Cards ---
const ProductsIcon = () => <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const StockIcon = () => <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7a8 8 0 014 6v4c0 .773.34 1.467.88 1.9 M12 21a8 8 0 004-6v-4c0-.773-.34-1.467-.88-1.9" /></svg>;
const AlertIcon = () => <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;


const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex items-center">
            <div className={`rounded-full p-3 bg-opacity-20 bg-${color}-500`}>
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-gray-500 font-medium">{title}</p>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    </div>
);


const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Calculated Stats ---
  const totalStockQuantity = stocks.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = stocks.filter(item => item.quantity < 10).length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, stockRes] = await Promise.all([getProducts(), getStocks()]);
        setProducts(productRes.data || []);
        setStocks(stockRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome, {user?.username || 'User'}!</h1>
        <p className="text-gray-500 mt-1">Here’s a snapshot of your inventory performance.</p>
      </div>

      {/* --- Stat Cards Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Products" value={products.length} icon={<ProductsIcon />} color="blue" />
        <StatCard title="Total Stock Quantity" value={totalStockQuantity} icon={<StockIcon />} color="green" />
        <StatCard title="Low Stock Alerts" value={lowStockItems} icon={<AlertIcon />} color="red" />
      </div>
      
      {/* --- Charts Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-lg">
             <h3 className="text-xl font-semibold text-gray-800 mb-4">Stock Levels Overview</h3>
            {stocks.length > 0 ? (
              <StockBarChart stockData={stocks} />
            ) : (
              <div className="text-center py-12 text-gray-500">No stock data to display.</div>
            )}
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Category Distribution</h3>
            {products.length > 0 ? (
              <ProductPieChart productData={products} />
            ) : (
              <div className="text-center py-12 text-gray-500">No product data to display.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;