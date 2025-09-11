import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import Loader from '../components/Loader';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center p-10">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <Link to="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : '/placeholder.png';

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
            <p className="text-gray-600 mt-4 text-base">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div>
                <p className="text-sm font-medium text-gray-500">Price</p>
                <p className="text-2xl font-semibold text-indigo-600">₹{parseFloat(product.price).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">SKU</p>
                <p className="text-lg font-semibold text-gray-800">{product.sku}</p>
              </div>
            </div>
            
            <div className="mt-auto pt-6">
              <Link to="/products" className="inline-block bg-gray-200 text-gray-800 px-6 py-2 rounded-md font-semibold hover:bg-gray-300">
                ← Back to All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;