import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRecommendedProducts, getProductsByCategory } from "../../api/publicApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import { initiateCheckout, confirmPayment } from "../../api/checkoutApi";
import toast from 'react-hot-toast';
import QRCodeModal from "../../components/QRCodeModal";
import Loader from "../../components/Loader";

// --- Icon components ---
const ArrowRightIcon = () => <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>;
const CartIconSvg = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const HeartIcon = ({ isFilled }) => (
    <svg className={`w-5 h-5 transition-all duration-200 ${isFilled ? 'text-cyan-400' : 'text-slate-400'}`} fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
    </svg>
);
const PlusIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>;


// --- Cart Modal Component (Re-using a similar dark theme modal) ---
const CartModal = ({ isOpen, onClose, onCheckout }) => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    if (!isOpen) return null;
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-md bg-slate-900 h-full flex flex-col text-white shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-slate-700">
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <button onClick={onClose} className="text-3xl text-slate-400 hover:text-white">&times;</button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center"><p className="text-slate-500">Your cart is empty.</p></div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-5 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-24 h-24 object-cover rounded-lg"/>
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-slate-400">₹{item.price}</p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-slate-700 rounded-md">-</button>
                                        <span className="px-4 font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-slate-700 rounded-md">+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:text-red-400">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="p-5 border-t border-slate-700">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span>Total:</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="w-full py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-slate-600"
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
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : 'https://via.placeholder.com/500';

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        if (isInWishlist(product.id)) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    return (
        <Link to={`/shop/product/${product.id}`} className="group relative block bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-slate-600">
            <div className="relative h-64 w-full overflow-hidden">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            <div className="p-5">
                <h3 className="text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                <p className="text-2xl font-black text-white mt-1">₹{parseFloat(product.price).toFixed(2)}</p>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                    <button onClick={handleWishlistToggle} className="p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                        <HeartIcon isFilled={isInWishlist(product.id)} />
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.quantity === 0}
                        className="flex items-center justify-center py-3 px-5 bg-cyan-500 text-black font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:bg-cyan-400 hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        <PlusIcon /> <span className="ml-2">Add to Cart</span>
                    </button>
                </div>
            </div>
        </Link>
    );
};

const SkeletonCard = () => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 animate-pulse">
        <div className="w-full h-64 bg-slate-700 rounded-xl mb-4"></div>
        <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-slate-700 rounded w-1/3"></div>
    </div>
);


const ProductList = ({/*...all your existing logic...*/}) => {
    // ... (All your existing state and functions like fetchProducts, startPurchaseFlow, etc. remain here unchanged) ...
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const { cartItems, clearCart } = useCart();
    const { user, logout } = useAuth();
    const [activeCategory, setActiveCategory] = useState('Recommended');
    const navigate = useNavigate();

    const fetchProducts = async (categoryValue, categoryLabel) => {
        setLoading(true);
        setActiveCategory(categoryLabel);
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

    return (
        <div className="bg-slate-900 text-white font-sans">
            <QRCodeModal isOpen={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} qrCodeImage={checkoutData?.qrCodeImage} onConfirm={handleConfirmPayment} />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />

            <header className="bg-slate-900/70 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-800">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white">NEXUS</Link>
                    <div className="flex items-center space-x-6">
                        {user && <Link to="/wishlist" className="text-slate-300 hover:text-cyan-400 transition-colors"><HeartIcon isFilled={false} /></Link>}
                        <button onClick={() => setIsCartOpen(true)} className="relative text-slate-300 hover:text-white transition-colors">
                            <CartIconSvg />
                            {totalItemsInCart > 0 && <span className="absolute -top-2 -right-3 w-5 h-5 bg-cyan-500 text-black text-xs font-bold rounded-full flex items-center justify-center">{totalItemsInCart}</span>}
                        </button>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-semibold text-slate-300">Welcome, {user.username}</span>
                                <button onClick={handleLogout} className="px-4 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm">Logout</button>
                            </div>
                        ) : (
                            <a href="/login" className="px-5 py-2 border border-slate-700 font-bold rounded-lg hover:bg-white hover:text-black transition-colors">
                                Portal
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <div className="relative pt-32 pb-24 text-center overflow-hidden bg-grid-pattern">
                 <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-transparent z-10"></div>
                <div className="relative z-20 px-6 animate-fadeIn">
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight animate-fadeInUp">
                        Define Your Digital World.
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-300 animate-fadeInUp delay-200">
                        Handpicked electronics for those who demand performance and style.
                    </p>
                    <a href="#products" className="group inline-flex items-center justify-center mt-8 px-8 py-4 bg-cyan-500 text-black font-bold rounded-lg shadow-lg shadow-cyan-500/30 transition-transform duration-300 hover:scale-105 animate-fadeInUp delay-400">
                        Explore Products
                        <ArrowRightIcon />
                    </a>
                </div>
            </div>

            <main id="products" className="container mx-auto px-6 py-16">
                 <h2 className="text-4xl font-black text-center text-white mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                        Featured Categories
                    </span>
                </h2>

                <div className="flex justify-center mb-12">
                    <div className="flex flex-wrap justify-center gap-2 bg-slate-800/50 p-2 rounded-full border border-slate-700">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => fetchProducts(cat.value, cat.label)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    activeCategory === cat.label
                                        ? 'bg-cyan-500 text-black'
                                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-slate-900 border-t border-slate-800 mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} NEXUS. The future is now.</p>
                </div>
            </footer>
        </div>
    );
};

export default ProductList;