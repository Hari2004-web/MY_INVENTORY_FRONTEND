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
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back, {user?.username || 'User'}! Here's your graphical overview.
        </p>
      </div>

      {loading ? (
        <p>Loading charts...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {stocks.length > 0 ? (
              <StockBarChart stockData={stocks} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-700">No Stock Data</h3>
                <p className="text-sm text-gray-500">Add stock to see the chart.</p>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {products.length > 0 ? (
              <ProductPieChart productData={products} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-700">No Product Data</h3>
                <p className="text-sm text-gray-500">Add products to see the chart.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;