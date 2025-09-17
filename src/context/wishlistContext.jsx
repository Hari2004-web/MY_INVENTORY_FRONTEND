import { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist as getWishlistApi, addToWishlist as addToWishlistApi, removeFromWishlist as removeFromWishlistApi } from '../api/wishlistApi';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      // Only fetch if there is a logged-in user.
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
        // If no user, clear the wishlist and stop loading.
        setWishlist([]);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]); // This dependency correctly re-runs the fetch when the user logs in or out.

  const addToWishlist = async (product) => {
    if (!user) {
      toast.error("Please log in to add items to your wishlist.");
      navigate('/customer/login');
      return;
    }
    try {
      await addToWishlistApi(product.id);
      setWishlist(prev => [...prev, product]);
      toast.success(`${product.name} added to wishlist!`);
    } catch (error) {
      toast.error("Failed to add to wishlist.");
    }
  };

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
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};