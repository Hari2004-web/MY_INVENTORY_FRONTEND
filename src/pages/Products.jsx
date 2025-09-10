//it is the product.jsx in the card style 



import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

// --- Product Card Component (No changes needed here) ---
const ProductCard = ({ product, onSelect, onEdit, onDelete, userRole }) => {
  const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : '/placeholder.png';

  return (
    <div className="group relative bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-2 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
      
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
        <div className="flex justify-center space-x-3">
          <button onClick={() => onSelect(product)} className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30">View Details</button>
          {userRole === 'manager' && (
            <>
              <button onClick={() => onEdit(product)} className="bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30">Edit</button>
              <button onClick={() => onDelete(product.id)} className="bg-red-500/50 backdrop-blur-lg px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-500/70">Delete</button>
            </>
          )}
        </div>
      </div>

      <img src={imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{product.description}</p>
        <p className="text-xl font-bold text-indigo-600 mt-2">${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}</p>
      </div>
    </div>
  );
};


const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // For detail view
  const [currentProduct, setCurrentProduct] = useState(null); // For the form
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const fetchProducts = async () => {
    try {
        const response = await getProducts();
        setProducts(response.data || []);
    } catch(error) {
        console.error("Failed to fetch products", error)
    }
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleOpenFormModal = (product = null) => {
    setIsEditing(!!product);
    setCurrentProduct(product || { name: '', description: '', sku: '', price: '' });
    setSelectedProduct(null); // Close detail modal if open
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteProduct(id);
      setSelectedProduct(null); // Close detail modal
      fetchProducts();
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

    if (isEditing) {
      await updateProduct(currentProduct.id, productData);
    } else {
      await createProduct(productData);
    }
    fetchProducts();
    setIsFormModalOpen(false);
    setImageFile(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products</h1>
        {user?.role === 'manager' && (
          <Button onClick={() => handleOpenFormModal()}>
            + Add Product
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard 
            key={p.id} 
            product={p} 
            onSelect={setSelectedProduct}
            onEdit={handleOpenFormModal}
            onDelete={handleDelete}
            userRole={user?.role}
          />
        ))}
      </div>

      {/* --- FIX: Updated the Product Details Modal --- */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title="Product Details">
          {selectedProduct && (
            <div className="space-y-4">
                <img 
                    src={selectedProduct.image_url ? `http://localhost:5000${selectedProduct.image_url}` : '/placeholder.png'} 
                    alt={selectedProduct.name} 
                    className="w-full h-64 object-cover rounded-lg"
                />
                <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                
                <p className="text-gray-600">{selectedProduct.description}</p>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Price</p>
                        <p className="text-lg font-semibold text-indigo-600">${parseFloat(selectedProduct.price).toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">SKU</p>
                        <p className="text-lg font-semibold text-gray-800">{selectedProduct.sku}</p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={() => setSelectedProduct(null)} variant="primary">
                        Close
                    </Button>
                </div>
            </div>
          )}
      </Modal>

      {/* --- Add/Edit Product Modal (No changes needed here) --- */}
      <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={currentProduct?.name || ''} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full p-2 border rounded-lg" required />
          <input type="text" name="description" placeholder="Description" value={currentProduct?.description || ''} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="text" name="sku" placeholder="SKU" value={currentProduct?.sku || ''} onChange={(e) => setCurrentProduct({...currentProduct, sku: e.target.value})} className="w-full p-2 border rounded-lg" />
          <input type="number" name="price" placeholder="Price" value={currentProduct?.price || ''} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full p-2 border rounded-lg" step="0.01"/>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
             <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          </div>
          <Button type="submit" variant="success" className="w-full">
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Products;