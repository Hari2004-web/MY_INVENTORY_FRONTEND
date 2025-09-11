import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/productApi';
import Loader from '../components/Loader';
import Button from '../components/Button';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append all product fields from the state
    Object.keys(product).forEach(key => {
      if (product[key] !== null) {
        formData.append(key, product[key]);
      }
    });
    
    // If a new image was selected, append it
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await updateProduct(id, formData);
      navigate('/products'); // Redirect to the product list on success
    } catch (err) {
      setError('Failed to update product.');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader /></div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product) return <p className="text-center">Product not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={product.name || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          <textarea name="description" placeholder="Description" value={product.description || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          <input type="text" name="sku" placeholder="SKU" value={product.sku || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          <input type="number" name="price" placeholder="Price" value={product.price || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" step="0.01" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Product Image (Optional)</label>
            <input type="file" name="image" onChange={handleFileChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>
          <Button type="submit" variant="success" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;