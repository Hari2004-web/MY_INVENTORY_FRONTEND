// src/pages/AddProduct.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/productApi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const AddProduct = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    category: 'laptops' // Default category
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
        toast.error("Please upload a product image.");
        return;
    }

    const formData = new FormData();
    
    // Append all product data to the form
    Object.keys(product).forEach(key => {
      formData.append(key, product[key]);
    });
    
    // Append the user ID and image file
    formData.append('manager_id', user.id);
    formData.append('image', imageFile);

    const loadingToast = toast.loading("Adding product...");
    try {
      await createProduct(formData);
      toast.success("Product added successfully!", { id: loadingToast });
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product.", { id: loadingToast });
      setError('Failed to add product.');
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Add New Product</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" name="name" placeholder="e.g., MacBook Pro 14" value={product.name} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" placeholder="Product details..." value={product.description} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" name="sku" placeholder="e.g., SKU12345" value={product.sku} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                <input type="number" name="price" placeholder="e.g., 150000" value={product.price} onChange={handleChange} className="w-full p-2 border rounded-lg" step="0.01" required />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={product.category} onChange={handleChange} className="w-full p-2 border rounded-lg">
              <option value="laptops">Laptops</option>
              <option value="mobiles">Mobiles</option>
              <option value="electronic gadgets">Electronic Gadgets</option>
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
             <input type="file" name="image" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
          </div>

          <div className="pt-4">
            <Button type="submit" variant="success" className="w-full">
              Save Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;