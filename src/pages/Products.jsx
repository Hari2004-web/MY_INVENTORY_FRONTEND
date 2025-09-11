import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, createProduct, deleteProduct } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

// --- Product Card Component (No changes needed here) ---
const ProductCard = ({ product, onDelete, userRole }) => {
  const navigate = useNavigate();
  const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : '/placeholder.png';

  const handleViewDetails = () => navigate(`/products/${product.id}`);
  const handleEdit = () => navigate(`/products/edit/${product.id}`);

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="flex justify-center space-x-3">
          <button onClick={handleViewDetails} className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30">View Details</button>
          {userRole === 'manager' && (
            <>
              <button onClick={handleEdit} className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30">Edit</button>
              <button onClick={() => onDelete(product.id)} className="bg-red-500/50 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-500/70">Delete</button>
            </>
          )}
        </div>
      </div>

      <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{product.description}</p>
        <p className="text-xl font-bold text-indigo-600 mt-2">₹{product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</p>
      </div>
    </div>
  );
};


const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', description: '', sku: '', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
        const response = await getProducts();
        setProducts(response.data || []);
    } catch(error) {
        console.error("Failed to fetch products", error)
    }
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleOpenAddModal = () => {
    setCurrentProduct({ name: '', description: '', sku: '', price: '' });
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
        fetchProducts();
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

    fetchProducts();
    setIsFormModalOpen(false);
  };

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

      {/* --- ADD PRODUCT MODAL WITH FORM --- */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title="Add Product">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={currentProduct?.name || ''} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full p-2 border rounded-lg" required />
          <textarea name="description" placeholder="Description" value={currentProduct?.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" name="sku" placeholder="SKU" value={currentProduct?.sku || ''} onChange={(e) => setCurrentProduct({...currentProduct, sku: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="number" name="price" placeholder="Price" value={currentProduct?.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full p-2 border rounded-lg" step="0.01"/>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
             <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          </div>
          <Button type="submit" variant="success" className="w-full">
            Create Product
          </Button>
        </form>
      </Modal>

      {/* --- DELETE CONFIRMATION MODAL --- */}
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