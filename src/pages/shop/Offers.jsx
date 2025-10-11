import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOfferProducts } from "../../api/publicApi";
import { useCart } from "../../context/CartContext";
import { useWishlist, useWishlistActions } from "../../context/WishlistContext";
import toast from 'react-hot-toast';
import Loader from "../../components/Loader";

// Reusable Product Card Component (can be extracted to its own file)
const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { isInWishlist, removeFromWishlist } = useWishlist();
    const { addToWishlist } = useWishlistActions();
    const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : 'https://via.placeholder.com/500';

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <Link to={`/shop/product/${product.id}`} className="block rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white group">
            <div className="relative h-60 w-full overflow-hidden">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{product.name}</h3>
                <p className="text-2xl font-extrabold text-indigo-600 mb-4">₹{parseFloat(product.price).toFixed(2)}</p>
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                    <button onClick={handleWishlistToggle} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                        <svg className={`w-6 h-6 ${isInWishlist(product.id) ? 'text-red-500' : ''}`} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                    </button>
                    <button onClick={handleAddToCart} disabled={product.quantity === 0} className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors disabled:bg-gray-400">
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};


const Offers = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await getOfferProducts();
                setProducts(response.data || []);
            } catch { // FIX: Removed the unused 'error' variable
                toast.error("Could not load special offers.");
            } finally {
                setLoading(false);
            }
        };
        fetchOffers();
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-6 py-4">
                     <h1 className="text-4xl font-bold text-center text-indigo-600">Special Offers</h1>
                     <p className="text-center text-gray-600 mt-2">Don't miss out on these exclusive deals!</p>
                </div>
            </header>
            
            <main className="container mx-auto px-6 py-10">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.length > 0 ? (
                            products.map(product => <ProductCard key={product.id} product={product} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-500 text-xl">No special offers are available at the moment.</p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Offers;