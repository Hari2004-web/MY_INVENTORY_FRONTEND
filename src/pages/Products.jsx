  import { useEffect, useState } from "react";
  import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
  import Modal from "../components/modals";
  import { useAuth } from "../context/AuthContext";

  const ProductDetailModal = ({ product, onClose, onEdit, onDelete, userRole }) => {
    if (!product) return null;
    
    // FIX: Use the local placeholder image if no product image exists
    const imageUrl = product.image_url 
      ? `http://localhost:5000${product.image_url}` 
      : '/placeholder.png'; // Path to your local image in the 'public' folder

    return (
      <Modal isOpen={!!product} onClose={onClose} title={product.name}>
        <div>
          <img src={imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-lg mb-4" />
          <p className="text-gray-600 mb-2">{product.description}</p>
          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">${parseFloat(product.price).toFixed(2)}</div>
          {userRole === 'manager' && (
              <div className="flex justify-end space-x-2 mt-6 border-t pt-4">
                  <button onClick={() => onEdit(product)} className="px-4 py-2 text-white bg-yellow-500 rounded-lg">Edit</button>
                  <button onClick={() => onDelete(product.id)} className="px-4 py-2 text-white bg-red-600 rounded-lg">Delete</button>
              </div>
          )}
        </div>
      </Modal>
    );
  };

  const Products = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentProduct, setCurrentProduct] = useState(null);
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
      setSelectedProduct(null);
      setIsFormModalOpen(true);
    };

    const handleDelete = async (id) => {
      if (window.confirm("Are you sure?")) {
        await deleteProduct(id);
        setSelectedProduct(null);
        fetchProducts();
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const productData = { ...currentProduct, image: imageFile };
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
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Products</h1>
          {user?.role === 'manager' && (
            <button onClick={() => handleOpenFormModal()} className="bg-blue-600 text-white px-4 py-2 rounded">
              Add Product
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {products.map((p) => (
            <li key={p.id} onClick={() => setSelectedProduct(p)} className="bg-white shadow p-3 rounded flex justify-between items-center cursor-pointer hover:bg-gray-50">
              <span>{p.name} - ${p.price ? parseFloat(p.price).toFixed(2) : '0.00'}</span>
            </li>
          ))}
        </ul>

        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onEdit={handleOpenFormModal}
          onDelete={handleDelete}
          userRole={user?.role}
        />

        <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={isEditing ? "Edit Product" : "Add Product"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Product Name" value={currentProduct?.name} onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full p-2 border rounded-lg" required />
            <input type="text" name="description" placeholder="Description" value={currentProduct?.description} onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})} className="w-full p-2 border rounded-lg" />
            <input type="text" name="sku" placeholder="SKU" value={currentProduct?.sku} onChange={(e) => setCurrentProduct({...currentProduct, sku: e.target.value})} className="w-full p-2 border rounded-lg" />
            <input type="number" name="price" placeholder="Price" value={currentProduct?.price} onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})} className="w-full p-2 border rounded-lg" step="0.01"/>
            <input type="file" name="image" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-2 border rounded-lg" />
            <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md">
              {isEditing ? "Save Changes" : "Create Product"}
            </button>
          </form>
        </Modal>
      </div>
    );
  };

  export default Products;