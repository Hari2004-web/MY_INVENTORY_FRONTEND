import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRecommendedProducts, getProductsByCategory } from "../../api/publicApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist, useWishlistActions } from "../../context/WishlistContext";
import { initiateCheckout, confirmPayment } from "../../api/checkoutApi";
import toast from 'react-hot-toast';
import QRCodeModal from "../../components/QRCodeModal";
import Loader from "../../components/Loader";

// --- Icon components ---
const ArrowRightIcon = () => <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>;
const CartIconSvg = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const HeartIcon = ({ isFilled }) => (
    <svg className={`w-6 h-6 transition-all duration-200 ${isFilled ? 'text-red-500' : 'text-gray-400'}`} fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
    </svg>
);

// --- Cart Modal Component ---
const CartModal = ({ isOpen, onClose, onCheckout }) => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    if (!isOpen) return null;
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-md bg-white h-full flex flex-col text-gray-800 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-800">&times;</button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center"><p className="text-gray-500">Your cart is empty.</p></div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-5 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-24 h-24 object-cover rounded-lg border"/>
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">₹{item.price}</p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">-</button>
                                        <span className="px-4 font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300">+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:underline">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="p-5 border-t bg-gray-50">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span>Total:</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                        disabled={cartItems.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};


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
        <div className="group relative">
            <Link to={`/shop/product/${product.id}`} className="block">
                <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
                    <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-md font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                        <p className="text-lg font-bold text-gray-900 mt-1">₹{parseFloat(product.price).toFixed(2)}</p>
                    </div>
                </div>
            </Link>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={handleWishlistToggle} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <HeartIcon isFilled={isInWishlist(product.id)} />
                </button>
            </div>
             <div className="mt-4">
                <button
                    onClick={handleAddToCart}
                    disabled={product.quantity === 0}
                    className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-black transition-colors disabled:bg-gray-300"
                >
                    {product.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
                </button>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="animate-pulse">
        <div className="w-full aspect-square bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
    </div>
);


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const { cartItems, clearCart } = useCart();
    const { user, logout } = useAuth();
    const [activeCategory, setActiveCategory] = useState('Recommended');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('recommended');
    const navigate = useNavigate();

    const fetchProducts = async (categoryValue, categoryLabel) => {
        setLoading(true);
        setActiveCategory(categoryLabel);
        setSortOption('recommended'); 
        try {
            let response;
            if (categoryValue === 'Recommended') {
                response = await getRecommendedProducts();
            } else {
                response = await getProductsByCategory(categoryValue);
            }
            setProducts(response.data || []);
        } catch (error) {
            console.error(`Failed to fetch products for category: ${categoryValue}`, error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => {
        fetchProducts('Recommended', 'Recommended');
    }, []);

    const startPurchaseFlow = async () => {
        const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const gstAmount = subtotal * 0.18;
        const totalAmount = subtotal + gstAmount;

        const billData = {
            products: cartItems.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })),
            total_amount: totalAmount,
            gst_amount: gstAmount,
        };

        try {
            const response = await initiateCheckout(billData);
            setCheckoutData(response.data);
            setIsCartOpen(false);
            setIsQrModalOpen(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not start checkout.");
        }
    };

    const handleConfirmPayment = async () => {
        if (!checkoutData) return;
        try {
            const productData = { products: cartItems };
            await confirmPayment(checkoutData.billId, productData);

            toast.success('Your order has been placed successfully!');
            clearCart();
            setIsQrModalOpen(false);
            setCheckoutData(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment confirmation failed.");
            setIsQrModalOpen(false);
        }
    };

    const handleCheckout = () => {
        if (user) {
            startPurchaseFlow();
        } else {
            setIsCartOpen(false);
            navigate('/customer/login');
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("You've been logged out.");
    };

    const totalItemsInCart = cartItems.reduce((count, item) => count + item.quantity, 0);
    const categories = [
        { label: 'Recommended', value: 'Recommended' },
        { label: 'Laptops', value: 'laptops' },
        { label: 'Mobiles', value: 'mobiles' },
        { label: 'Gadgets', value: 'electronic gadgets' }
    ];

    const displayedProducts = useMemo(() => {
        let filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        let sorted = [...filtered];

        switch (sortOption) {
            case 'price-asc':
                sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'price-desc':
                sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'latest':
                sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            default:
                break;
        }
        return sorted;
    }, [products, searchTerm, sortOption]);

    return (
        <div className="bg-gray-50 font-sans">
            <QRCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} qrCodeImage={checkoutData?.qrCodeImage} onConfirm={handleConfirmPayment} />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />

            <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">NEXUS</Link>
                    <div className="flex items-center space-x-6">
                        {user && <Link to="/wishlist" className="text-gray-500 hover:text-gray-900 transition-colors"><HeartIcon isFilled={false} /></Link>}
                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-500 hover:text-gray-900 transition-colors">
                            <CartIconSvg />
                            {totalItemsInCart > 0 && <span className="absolute -top-2 -right-3 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">{totalItemsInCart}</span>}
                        </button>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-semibold text-gray-700">Welcome, {user.username}</span>
                                <button onClick={handleLogout} className="px-4 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm">Logout</button>
                            </div>
                        ) : (
                            <a href="/login" className="px-5 py-2 border border-gray-300 font-bold rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                                Portal
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <div className="bg-white">
                <div className="container mx-auto px-6 py-24 text-center">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tighter">
                        Technology for Tomorrow.
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                        Discover a curated selection of high-performance electronics designed to elevate your digital life.
                    </p>
                    <a href="#products" className="group inline-flex items-center justify-center mt-8 px-8 py-4 bg-gray-900 text-white font-bold rounded-lg transition-transform duration-300 hover:scale-105">
                        Shop Now
                        <ArrowRightIcon />
                    </a>
                </div>
            </div>

            <main id="products" className="container mx-auto px-6 py-16">
                 <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => fetchProducts(cat.value, cat.label)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    activeCategory === cat.label
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full md:w-auto px-4 py-2 text-gray-800 bg-white border border-gray-300 rounded-full placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="recommended">Sort by</option>
                            <option value="latest">Latest</option>
                            <option value="price-asc">Price: Low-High</option>
                            <option value="price-desc">Price: High-Low</option>
                        </select>
                    </div>
                </div>


                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-white border-t mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} NEXUS. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ProductList;