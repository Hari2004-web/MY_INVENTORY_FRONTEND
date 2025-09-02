import { useEffect, useState } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
import Modal from "../components/modals";
import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', description: '', sku: '', price: '' });
  const [isEditing, setIsEditing] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    setIsEditing(!!product);
    setCurrentProduct(product ? { ...product } : { name: '', description: '', sku: '', price: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleChange = (e) => setCurrentProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // FIX: Added 'await' to the API call
        await updateProduct(currentProduct.id, { ...currentProduct, updated_by: user.id });
      } else {
        // FIX: Added 'await' to the API call
        await createProduct({ ...currentProduct, created_by: user.id });
      }
      await fetchProducts(); // Refresh the product list
      handleCloseModal(); // Close the modal on success
    } catch (error) {
        // This will now catch and log any errors from the backend
        console.error("Failed to save the product:", error);
        // Optionally, display an error message to the user here
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  // The JSX for rendering the page remains the same
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        {user?.role === 'manager' && (
          <button onClick={() => handleOpenModal()} className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            + Add Product
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* ... Table UI remains the same ... */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              {user?.role === 'manager' && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-sm text-gray-500">{p.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${p.price ? parseFloat(p.price).toFixed(2) : '0.00'}</td>
                {user?.role === 'manager' && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button onClick={() => handleOpenModal(p)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={isEditing ? "Edit Product" : "Add Product"}>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Product Name" value={currentProduct.name} onChange={handleChange} className="w-full p-2 mb-3 border rounded" required />
          <input type="text" name="description" placeholder="Description" value={currentProduct.description} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
          <input type="text" name="sku" placeholder="SKU" value={currentProduct.sku} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
          <input type="number" name="price" placeholder="Price" value={currentProduct.price} onChange={handleChange} className="w-full p-2 mb-4 border rounded" step="0.01" />
          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-md">
            {isEditing ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Products;