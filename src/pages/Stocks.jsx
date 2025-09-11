// src/pages/Stocks.jsx

import { useEffect, useState } from "react";
import { getStocks, createStock, updateStock, deleteStock } from "../api/stockApi";
import { getProducts } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button"; // Import the Button component

const Stocks = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState({ product_id: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);

  // --- NEW STATE FOR DELETE CONFIRMATION ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);

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

  // --- MODIFIED DELETE PROCESS ---

  // 1. Opens the confirmation modal
  const handleDeleteRequest = (id) => {
    setStockToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // 2. Executes deletion after confirmation
  const confirmDelete = async () => {
    if (stockToDelete) {
      await deleteStock(stockToDelete);
      fetchData();
      setIsDeleteModalOpen(false);
      setStockToDelete(null);
    }
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Levels</h1>
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
              {user?.role === 'manager' && (
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(s)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm">Edit</button>
                  {/* 👇 Calls the new confirmation function */}
                  <button onClick={() => handleDeleteRequest(s.id)} className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Add/Update Stock Modal */}
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

      {/* --- NEW DELETE CONFIRMATION MODAL --- */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Are you sure you want to delete this stock entry?
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} variant="danger">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Stocks;