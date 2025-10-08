import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  if (loading) {
    return (
      <div className="bg-[#121212] min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#121212] min-h-screen text-white p-8">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>
          <div className="bg-[#1A1A1A] p-12 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-300">Please Log In</h2>
            <p className="text-gray-500 mt-2 mb-6">You need to be logged in to view your wishlist.</p>
            <Link to="/customer/login" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#121212] min-h-screen text-white p-8">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>
          <div className="bg-[#1A1A1A] p-12 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-300">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mt-2 mb-6">Click the heart icon on any product to save it here for later.</p>
            <Link to="/" className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Explore Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
            <h1 className="text-4xl font-bold">My Wishlist</h1>
            <Link to="/" className="text-blue-500 hover:underline mt-2 inline-block">
              &larr; Continue Shopping
            </Link>
        </div>

        <div className="space-y-4">
          {wishlist.map(product => (
            <div key={product.id} className="bg-[#1A1A1A] rounded-lg p-4 flex flex-col sm:flex-row items-center gap-6 shadow-lg">
              <img
                src={`http://localhost:5000${product.image_url}`}
                alt={product.name}
                className="w-32 h-32 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex-grow text-center sm:text-left">
                <h2 className="text-xl font-bold text-white">{product.name}</h2>
                <p className="text-lg text-blue-400 mt-1 font-semibold">₹{parseFloat(product.price).toFixed(2)}</p>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto sm:flex-shrink-0">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="w-full px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="w-full px-6 py-2 bg-gray-700 text-red-400 rounded-md hover:bg-gray-600 transition-colors font-semibold text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;