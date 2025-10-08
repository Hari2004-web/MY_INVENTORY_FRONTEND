// src/pages/Stocks.jsx

import { useEffect, useState } from "react";
import { getStocks, createStock, updateStock, deleteStock } from "../api/stockApi";
import { getProducts } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { exportToExcel } from "../utils/exportUtils";
import toast from 'react-hot-toast';
import Loader from "../components/Loader"; // Import Loader

// --- Icon Components for a better UI ---
const EditIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const StockStatus = ({ quantity }) => {
  let bgColor, textColor, text;

  if (quantity > 10) {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
    text = 'In Stock';
  } else if (quantity > 0) {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
    text = 'Low Stock';
  } else {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    text = 'Out of Stock';
  }

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};

const Stocks = () => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStock, setCurrentStock] = useState({ product_id: '', quantity: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedStocks, setSelectedStocks] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stockResponse, productResponse] = await Promise.all([getStocks(), getProducts()]);
      setStocks(stockResponse.data || []);
      setAllProducts(productResponse.data || []);
    } catch (error) {
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);
  
  // Combine stock and product data to include image_url
  const enrichedStocks = stocks.map(stock => {
      const product = allProducts.find(p => p.id === stock.product_id);
      return {
          ...stock,
          image_url: product ? product.image_url : null
      };
  });

  const filteredStocks = enrichedStocks.filter(stock => {
    const matchesSearch = stock.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') {
      return matchesSearch;
    }
    let matchesStatus = false;
    if (statusFilter === 'in_stock') {
      matchesStatus = stock.quantity > 10;
    } else if (statusFilter === 'low_stock') {
      matchesStatus = stock.quantity > 0 && stock.quantity <= 10;
    } else if (statusFilter === 'out_of_stock') {
      matchesStatus = stock.quantity === 0;
    }
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredStocks.length / rowsPerPage);
    if (newTotalPages > 0 && currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredStocks.length, currentPage, rowsPerPage]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredStocks.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredStocks.length / rowsPerPage) || 1;

    const paginate = (pageNumber) => {
        setPageLoading(true);
        setTimeout(() => {
            setCurrentPage(pageNumber);
            setPageLoading(false);
        }, 300);
    };
  
  const handleOpenModal = (e, stock = null) => {
    e.stopPropagation();
    setIsEditing(!!stock);
    setCurrentStock(stock ? { ...stock } : { product_id: '', quantity: '' });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setCurrentStock(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(isEditing ? 'Updating stock...' : 'Adding stock...');
    try {
      if (isEditing) {
        await updateStock(currentStock.id, { quantity: currentStock.quantity, updated_by: user.id });
        toast.success("Stock updated successfully!", { id: loadingToast });
      } else {
        await createStock({ ...currentStock, created_by: user.id });
        toast.success("Stock added successfully!", { id: loadingToast });
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to update stock.", { id: loadingToast });
    }
  };

  const handleDeleteRequest = (e, id) => {
    e.stopPropagation();
    setStockToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (stockToDelete) {
      await deleteStock(stockToDelete);
      fetchData();
      toast.success("Stock entry deleted.");
      setIsDeleteModalOpen(false);
      setStockToDelete(null);
    }
  };
  
  const handleExport = () => {
    const dataToExport = selectedStocks.map(stockId => {
      const stock = enrichedStocks.find(s => s.id === stockId);
      return {
        'Product Name': stock.product_name,
        'Quantity': stock.quantity,
        'Status': stock.quantity > 10 ? 'In Stock' : (stock.quantity > 0 ? 'Low Stock' : 'Out of Stock'),
        'Last Updated': new Date(stock.updated_at).toLocaleString(),
      };
    });
    exportToExcel(dataToExport, `Stock_Report_${new Date().toLocaleDateString()}`);
    setSelectedStocks([]);
  };

  const handleSelectStock = (e, stockId) => {
    e.stopPropagation();
    setSelectedStocks(prev => 
      prev.includes(stockId) 
        ? prev.filter(id => id !== stockId) 
        : [...prev, stockId]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStocks(currentRows.map(s => s.id));
    } else {
      setSelectedStocks([]);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Levels</h1>
        <div className="flex gap-2">
            <Button onClick={handleExport} variant="success" disabled={selectedStocks.length === 0}>
              Export Selected ({selectedStocks.length})
            </Button>
            {user?.role === 'manager' && (
              <Button onClick={(e) => handleOpenModal(e)}>
                + Add New Stock
              </Button>
            )}
        </div>
      </div>
      
      <div className="mb-4 bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
        <input
            type="text"
            placeholder="Search by product name..."
            className="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}}
        >
          <option value="all">All Statuses</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto relative">
          {pageLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <Loader />
            </div>
          )}
          <table className="w-full text-left">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onChange={handleSelectAll}
                    checked={currentRows.length > 0 && selectedStocks.length === currentRows.length}
                  />
                </th>
                <th className="p-4 font-semibold text-slate-600">Product</th>
                <th className="p-4 font-semibold text-slate-600">Quantity</th>
                <th className="p-4 font-semibold text-slate-600">Status</th>
                <th className="p-4 font-semibold text-slate-600">Last Updated</th>
                {user?.role === 'manager' && <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentRows.map((stock) => (
                <tr key={stock.id} className={`border-b border-slate-200 transition-colors ${selectedStocks.includes(stock.id) ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                  <td className="p-4 text-center">
                     <input 
                       type="checkbox"
                       className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                       checked={selectedStocks.includes(stock.id)}
                       onChange={(e) => handleSelectStock(e, stock.id)}
                     />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                        <img 
                            src={stock.image_url ? `http://localhost:5000${stock.image_url}` : 'https://via.placeholder.com/150'}
                            alt={stock.product_name}
                            className="w-12 h-12 object-cover rounded-lg bg-slate-100"
                        />
                        <span className="font-medium text-slate-800">{stock.product_name}</span>
                    </div>
                  </td>
                  <td className={`p-4 font-bold ${stock.quantity > 10 ? 'text-green-600' : stock.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {stock.quantity}
                  </td>
                  <td className="p-4"><StockStatus quantity={stock.quantity} /></td>
                  <td className="p-4 text-slate-600">{new Date(stock.updated_at).toLocaleDateString()}</td>
                  {user?.role === 'manager' && (
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                          <button onClick={(e) => handleOpenModal(e, stock)} className="text-slate-500 hover:text-yellow-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><EditIcon /></button>
                          <button onClick={(e) => handleDeleteRequest(e, stock.id)} className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><DeleteIcon /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredStocks.length > rowsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-slate-600">
            Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, filteredStocks.length)} of {filteredStocks.length} entries
          </span>
          <div className="flex items-center gap-2">
            <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
            <span className="font-semibold">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= totalPages}>Next</Button>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Update Stock" : "Add Stock"}>
        <form onSubmit={handleSubmit}>
          {!isEditing && (
            <select name="product_id" value={currentStock.product_id} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required>
              <option value="">Select a Product</option>
              {allProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
          <p className="text-lg text-slate-600 mb-6">Are you sure you want to delete this stock entry?</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} variant="danger">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Stocks;