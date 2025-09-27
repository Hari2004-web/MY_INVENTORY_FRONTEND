// src/pages/Stocks.jsx

import { useEffect, useState } from "react";
import { getStocks, createStock, updateStock, deleteStock } from "../api/stockApi";
import { getProducts } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { exportToExcel } from "../utils/exportUtils";

const Stocks = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState({ product_id: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedStocks, setSelectedStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stockResponse = await getStocks();
        setStocks(stockResponse.data || []);
        if (user && user.role === 'manager') {
          const productResponse = await getProducts();
          setProducts(productResponse.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      }
    };

    fetchData();
  }, [user]);

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
    const stockResponse = await getStocks();
    setStocks(stockResponse.data || []);
    
    handleCloseModal();
  };

  const handleDeleteRequest = (id) => {
    setStockToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (stockToDelete) {
      await deleteStock(stockToDelete);
      const stockResponse = await getStocks();
      setStocks(stockResponse.data || []);
      setIsDeleteModalOpen(false);
      setStockToDelete(null);
    }
  };
  
  const handleExport = () => {
    const dataToExport = selectedStocks.map(stockId => {
      const stock = stocks.find(s => s.id === stockId);
      return {
        'Product Name': stock.product_name,
        'Quantity': stock.quantity,
        'Last Updated': new Date(stock.updated_at).toLocaleString(),
      };
    });
    exportToExcel(dataToExport, 'Selected_Stock_Report');
  };

  const handleSelectStock = (stockId) => {
    setSelectedStocks(prev => 
      prev.includes(stockId) 
        ? prev.filter(id => id !== stockId) 
        : [...prev, stockId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStocks(currentRows.map(stock => stock.id));
    } else {
      setSelectedStocks([]);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredStocks.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredStocks.length / rowsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Levels</h1>
        <div className="flex gap-2">
            <Button onClick={handleExport} variant="success" disabled={selectedStocks.length === 0}>
              Export Selected to Excel
            </Button>
            {user?.role === 'manager' && (
              <Button onClick={() => handleOpenModal()}>
                + Add New Stock
              </Button>
            )}
        </div>
      </div>
      
      <div className="mb-4">
        <input
            type="text"
            placeholder="Search by product name..."
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedStocks.length === currentRows.length && currentRows.length > 0} />
                </th>
                <th className="p-4 font-semibold text-gray-600">Product Name</th>
                <th className="p-4 font-semibold text-gray-600">Quantity</th>
                <th className="p-4 font-semibold text-gray-600">Last Updated</th>
                {user?.role === 'manager' && <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? currentRows.map((stock) => (
                <tr key={stock.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <input type="checkbox" checked={selectedStocks.includes(stock.id)} onChange={() => handleSelectStock(stock.id)} />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{stock.product_name}</td>
                  <td className="p-4 text-gray-600">{stock.quantity}</td>
                  <td className="p-4 text-gray-600">{new Date(stock.updated_at).toLocaleDateString()}</td>
                  {user?.role === 'manager' && (
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                          <button onClick={() => handleOpenModal(stock)} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                          <button onClick={() => handleDeleteRequest(stock.id)} className="text-sm bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={user?.role === 'manager' ? 5 : 4} className="p-8 text-center text-gray-500">
                    No stock entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredStocks.length)} of {filteredStocks.length} entries
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Update Stock" : "Add Stock"}>
        <form onSubmit={handleSubmit}>
          {!isEditing && (
            <select name="product_id" value={currentStock.product_id} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required>
              <option value="">Select a Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
          <input type="number" name="quantity" placeholder="Quantity" value={currentStock.quantity} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
          <Button type="submit" variant="success" className="w-full">
            {isEditing ? "Update Quantity" : "Add to Stock"}
          </Button>
        </form>
      </Modal>

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