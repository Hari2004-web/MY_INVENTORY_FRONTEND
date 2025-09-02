import { useEffect, useState } from "react";
import { getStocks, createStock, updateStock, deleteStock } from "../api/stockApi";
import { getProducts } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";

const Stocks = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState({ product_id: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const stockResponse = await getStocks();
      setStocks(stockResponse.data || []);
      if (user?.role === 'manager') {
        const productResponse = await getProducts();
        setProducts(productResponse.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.role]);

  const handleOpenModal = (stock = null) => {
    setIsEditing(!!stock);
    setCurrentStock(stock ? { ...stock } : { product_id: '', quantity: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setCurrentStock(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateStock(currentStock.id, { quantity: currentStock.quantity, updated_by: user.id });
    } else {
      await createStock({ ...currentStock, created_by: user.id });
    }
    fetchData();
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteStock(id);
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Levels</h1>
        {/* This button ONLY appears for managers */}
        {user?.role === 'manager' && (
          <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Add New Stock
          </button>
        )}
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {stocks.map((s) => (
            <li key={s.id} className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{s.product_name}</p>
                <p className="text-sm text-gray-600">Quantity: {s.quantity}</p>
              </div>
              {/* These controls ONLY appear for managers */}
              {user?.role === 'manager' && (
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(s)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Update Stock" : "Add Stock"}>
        <form onSubmit={handleSubmit}>
          {!isEditing && (
            <select name="product_id" value={currentStock.product_id} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required>
              <option value="">Select a Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
          <input type="number" name="quantity" placeholder="Quantity" value={currentStock.quantity} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md">
            {isEditing ? "Update Quantity" : "Add to Stock"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Stocks;