import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProductById } from '../../api/publicApi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const ShopProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getPublicProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center text-gray-800">
        <h1 className="text-4xl font-bold">Product Not Found</h1>
        <Link to="/" className="mt-4 text-blue-600 hover:underline">
          &larr; Back to Shop
        </Link>
      </div>
    );
  }

  const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : 'https://via.placeholder.com/800';

  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans">
      <div className="container mx-auto max-w-5xl p-4 sm:p-8">
        <div className="mb-8">
          <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">
            &larr; Back to Shop
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Image Column */}
          <div className="bg-gray-100 rounded-lg">
            <img src={imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tighter">{product.name}</h1>
            <p className="text-4xl font-bold text-gray-900 my-4">
              ₹{parseFloat(product.price).toFixed(2)}
            </p>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="w-full py-4 px-6 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {product.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProductDetail;