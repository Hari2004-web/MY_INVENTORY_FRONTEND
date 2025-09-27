import { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist as getWishlistApi, addToWishlist as addToWishlistApi, removeFromWishlist as removeFromWishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

// --- Create and EXPORT the custom hook for actions that need navigation ---
export const useWishlistActions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setWishlist } = useContext(WishlistContext); // Get setWishlist from the context

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist.");
      navigate('/customer/login');
      return;
    }
    try {
      await addToWishlistApi(product.id);
      // Update the state using the function from the context
      setWishlist(prev => [...prev, product]);
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      toast.error("Failed to add to wishlist.");
    }
  };

  return { addToWishlist };
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          setLoading(true);
          const response = await getWishlistApi();
          setWishlist(response.data || []);
        } catch (error) {
          console.error("Failed to fetch wishlist", error);
        } finally {
          setLoading(false);
        }
      } else {
        setWishlist([]);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const removeFromWishlist = async (productId) => {
    try {
      await removeFromWishlistApi(productId);
      setWishlist(prev => prev.filter(item => item.id !== productId));
      toast.success("Removed from wishlist.");
    } catch (error) {
      toast.error("Failed to remove from wishlist.");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const value = {
    wishlist,
    setWishlist, // Expose setWishlist to be used by the custom hook
    loading,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};