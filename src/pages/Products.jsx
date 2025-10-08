// src/pages/Products.jsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import toast from 'react-hot-toast';
import Loader from "../components/Loader"; // Import Loader

const EditIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ViewIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.022 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>;

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // State for category filter
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const fetchProducts = async () => {
    setLoading(true);
    try {
        const response = await getProducts();
        setProducts(response.data || []);
    } catch(error) {
        toast.error("Failed to fetch products.");
    } finally {
        setLoading(false);
    }
  };
  
  useEffect(() => { fetchProducts(); }, []);

  const handleDeleteRequest = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        toast.success("Product deleted successfully.");
        fetchProducts();
      } catch (error) {
        toast.error("Failed to delete product.");
      } finally {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' ? true : product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages > 0 ? newTotalPages : 1);
    }
  }, [filteredProducts.length, productsPerPage, currentPage]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;

  const paginate = (pageNumber) => {
    setPageLoading(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setPageLoading(false);
    }, 300);
  };
  
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
          />
          {/* --- CATEGORY FILTER DROPDOWN --- */}
          <select 
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => {setCategoryFilter(e.target.value); setCurrentPage(1);}}
          >
            <option value="all">All Categories</option>
            <option value="laptops">Laptops</option>
            <option value="mobiles">Mobiles</option>
            <option value="electronic gadgets">Electronic Gadgets</option>
          </select>
          {user?.role === 'manager' && (
            <Button onClick={() => navigate('/products/add')}>
              + Add Product
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto relative">
          {pageLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <Loader />
            </div>
          )}
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 font-semibold text-slate-600">Product</th>
                <th className="p-4 font-semibold text-slate-600">SKU</th>
                <th className="p-4 font-semibold text-slate-600">Category</th>
                <th className="p-4 font-semibold text-slate-600">Price</th>
                <th className="p-4 font-semibold text-slate-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => (
                <tr key={product.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-4">
                      <img src={`http://localhost:5000${product.image_url}`} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-slate-100"/>
                      <div><p className="font-medium text-slate-800">{product.name || 'No Name'}</p></div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{product.sku || 'N/A'}</td>
                  <td className="p-4 text-slate-600 capitalize">{product.category || 'Uncategorized'}</td>
                  <td className="p-4 font-semibold text-slate-800">{product.price && !isNaN(product.price) ? `₹${parseFloat(product.price).toFixed(2)}` : 'N/A'}</td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => navigate(`/products/${product.id}`)} className="text-slate-500 hover:text-blue-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><ViewIcon /></button>
                      {user?.role === 'manager' && (
                        <>
                          <button onClick={() => navigate(`/products/edit/${product.id}`)} className="text-slate-500 hover:text-yellow-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><EditIcon /></button>
                          <button onClick={() => handleDeleteRequest(product.id)} className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-slate-100 transition-colors"><DeleteIcon /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredProducts.length > productsPerPage && (
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-slate-600">Showing {indexOfFirstProduct + 1} to {Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products</span>
          <div className="flex items-center gap-2">
            <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</Button>
            <span className="font-semibold">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage >= totalPages}>Next</Button>
          </div>
        </div>
      )}

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-center">
          <p className="text-lg text-slate-600 mb-6">Are you sure you want to permanently delete this product?</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} variant="danger">Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Products;