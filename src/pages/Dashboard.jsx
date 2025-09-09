import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProducts } from "../api/productApi";
import { getStocks } from "../api/stockApi";
import StockBarChart from "../components/charts/StockBarChart";
import ProductPieChart from "../components/charts/ProductPieChart";

const Dashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await getProducts();
        setProducts(productRes.data || []);
        const stockRes = await getStocks();
        setStocks(stockRes.data || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Welcome back, {user?.username || 'User'}! Here is your inventory overview.
        </p>
      </div>
      {loading ? (
        <p className="text-center text-slate-500">Loading dashboard data...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">Stock Levels</h3>
            {stocks.length > 0 ? (
              <StockBarChart stockData={stocks} />
            ) : (
              <div className="text-center py-12 text-slate-500">No stock data to display.</div>
            )}
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Product Variety</h3>
            {products.length > 0 ? (
              <ProductPieChart productData={products} />
            ) : (
              <div className="text-center py-12 text-slate-500">No product data to display.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;