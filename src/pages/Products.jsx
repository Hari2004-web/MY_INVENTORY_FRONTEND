// src/pages/Products.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, deleteProduct } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

// ... (Icon components remain the same)
const EditIcon = () => <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"></path></svg>;
const DeleteIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;


const ProductCard = ({ product, onDelete, userRole }) => {
  const navigate = useNavigate();
  const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : '/placeholder.png';

  const handleViewDetails = () => navigate(`/products/${product.id}`);
  const handleEdit = () => navigate(`/products/edit/${product.id}`);

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
      <div className="absolute top-0 right-0 z-10 m-2">
        {userRole === 'manager' && (
          <div className="flex space-x-2">
            <button onClick={handleEdit} className="bg-white/80 backdrop-blur-lg p-2 rounded-full text-sm font-semibold hover:bg-white/90">
              <EditIcon />
            </button>
            <button onClick={() => onDelete(product.id)} className="bg-red-500/80 backdrop-blur-lg p-2 rounded-full text-sm font-semibold hover:bg-red-500/90 text-white">
              <DeleteIcon />
            </button>
          </div>
        )}
      </div>

      <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg text-dark">{product.name}</h3>
        <p className="text-sm text-secondary mt-1 truncate">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
            <p className="text-xl font-bold text-primary">₹{product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</p>
            <button onClick={handleViewDetails} className="text-primary font-semibold hover:underline">
                View Details
            </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', description: '', sku: '', price: '', category: 'laptops' });
  const [imageFile, setImageFile] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [activeCategory, setActiveCategory] = useState(''); // State for active category

  const fetchProducts = async (category = '') => {
    try {
        const response = await getProducts(category);
        setProducts(response.data || []);
        setActiveCategory(category);
    } catch(error) {
        console.error("Failed to fetch products", error)
    }
  };
  
  useEffect(() => { fetchProducts(); }, []);

  const handleOpenAddModal = () => {
    setCurrentProduct({ name: '', description: '', sku: '', price: '', category: 'laptops' });
    setImageFile(null);
    setIsFormModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete);
        fetchProducts(activeCategory); // Refetch with the current category
      } catch (error) {
        console.error("Failed to delete product:", error);
      } finally {
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = new FormData();
    Object.keys(currentProduct).forEach(key => {
        if(currentProduct[key] !== null) productData.append(key, currentProduct[key]);
    });
    if (imageFile) {
        productData.append('image', imageFile);
    }
    
    await createProduct(productData);

    fetchProducts(activeCategory);
    setIsFormModalOpen(false);
  };
  
  const categories = [
    { label: 'All', value: '' },
    { label: 'Laptops', value: 'laptops' },
    { label: 'Mobiles', value: 'mobiles' },
    { label: 'Gadgets', value: 'electronic gadgets' }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        {user?.role === 'manager' && (
          <Button onClick={handleOpenAddModal}>
            + Add Product
          </Button>
        )}
      </div>

      {/* --- Category Filter Buttons --- */}
      <div className="flex justify-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 bg-slate-200 p-2 rounded-full">
              {categories.map(cat => (
                  <button
                      key={cat.value}
                      onClick={() => fetchProducts(cat.value)}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                          activeCategory === cat.value
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 hover:bg-slate-300'
                          }`}
                  >
                      {cat.label}
                  </button>
              ))}
          </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onDelete={handleDeleteRequest}
            userRole={user?.role}
          />
        ))}
      </div>

      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Add Product">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={currentProduct?.name || ''} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full p-2 border rounded-lg" required />
          <textarea name="description" placeholder="Description" value={currentProduct?.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" name="sku" placeholder="SKU" value={currentProduct?.sku || ''} onChange={(e) => setCurrentProduct({...currentProduct, sku: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="number" name="price" placeholder="Price" value={currentProduct?.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full p-2 border rounded-lg" step="0.01"/>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={currentProduct.category} onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full p-2 border rounded-lg">
              <option value="laptops">Laptops</option>
              <option value="mobiles">Mobiles</option>
              <option value="electronic gadgets">Electronic Gadgets</option>
            </select>
          </div>
          
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
             <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          </div>
          <Button type="submit" variant="success" className="w-full">
            Create Product
          </Button>
        </form>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Are you sure you want to permanently delete this product?
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

export default Products;