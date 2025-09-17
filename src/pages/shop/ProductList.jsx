import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRecommendedProducts, getProductsByCategory } from "../../api/publicApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext"; // Import useWishlist
import { initiateCheckout, confirmPayment } from "../../api/checkoutApi";
import toast from 'react-hot-toast';
import QRCodeModal from "../../components/QRCodeModal";

// --- Icon components ---
const ArrowRightIcon = () => <svg className="w-6 h-6 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>;
const CartIconSvg = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const HeartIcon = ({ isFilled }) => (
    <svg className={`w-6 h-6 ${isFilled ? 'text-red-500' : 'text-white'}`} fill={isFilled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z"></path>
    </svg>
);


const CartModal = ({ isOpen, onClose, onCheckout }) => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    if (!isOpen) return null;
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-md bg-[#1A1A1A] h-full flex flex-col text-white shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-5 border-b border-gray-700">
                    <h2 className="text-2xl font-bold">Your Cart</h2>
                    <button onClick={onClose} className="text-3xl text-gray-400 hover:text-white">&times;</button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center"><p className="text-gray-500">Your cart is empty.</p></div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-5 space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-24 h-24 object-cover rounded-lg"/>
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-gray-400">₹{item.price}</p>
                                    <div className="flex items-center mt-2">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-700 rounded-md">-</button>
                                        <span className="px-4 font-bold">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-700 rounded-md">+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500 hover:text-red-400">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="p-5 border-t border-gray-700">
                    <div className="flex justify-between font-bold text-xl mb-4">
                        <span>Total:</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={onCheckout}
                        className="w-full py-3 bg-[#007CF0] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-600"
                        disabled={cartItems.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-[#1A1A1A] rounded-xl p-4 animate-pulse">
        <div className="w-full h-64 bg-gray-800 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-800 rounded w-1/3"></div>
    </div>
);

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const imageUrl = product.image_url ? `http://localhost:5000${product.image_url}` : 'https://via.placeholder.com/500';

    const handleAddToCart = (e) => {
        e.preventDefault(); // This is crucial to stop the Link navigation
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
        <Link to={`/shop/product/${product.id}`} className="group relative block bg-[#1A1A1A] rounded-2xl overflow-hidden transition-all duration-300 ease-in-out hover:shadow-[0_0_35px_rgba(0,124,240,0.5)] hover:ring-2 hover:ring-[#007CF0]">
            <div className="w-full h-72 overflow-hidden">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>

            {/* Wishlist Button */}
            <button onClick={handleWishlistToggle} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full">
                <HeartIcon isFilled={isInWishlist(product.id)} />
            </button>

            <div className="p-5">
                <h3 className="text-lg font-bold text-white truncate">{product.name}</h3>
                <p className="text-2xl font-black text-white mt-2">₹{parseFloat(product.price).toFixed(2)}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full group-hover:translate-y-[-20px] w-10/12 py-3 px-4 bg-[#007CF0] text-white font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed z-10"
            >
                {product.quantity > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>
        </Link>
    );
};


const ProductList = () => {
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
        { label: 'Electronic Gadgets', value: 'electronic gadgets' }
    ];

    return (
        <div className="bg-[#121212] text-gray-200 font-sans">
            <QRCodeModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                qrCodeImage={checkoutData?.qrCodeImage}
                onConfirm={handleConfirmPayment}
            />
            <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onCheckout={handleCheckout}
            />

            <header className="bg-black/50 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-800">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-black tracking-widest text-white">NEXUS</div>
                    <div className="flex items-center space-x-6">

                        {user && (
                            <Link to="/wishlist" className="text-white hover:text-[#007CF0] transition-colors">
                                <HeartIcon isFilled={false} />
                            </Link>
                        )}

                        <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-[#007CF0] transition-colors">
                            <CartIconSvg />
                            {totalItemsInCart > 0 && (
                                <span className="absolute -top-2 -right-3 w-5 h-5 bg-[#007CF0] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {totalItemsInCart}
                                </span>
                            )}
                        </button>
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-semibold text-gray-300">Welcome, {user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-2 border border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <a href="/login" className="px-5 py-2 border border-gray-700 text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors">
                                Portal
                            </a>
                        )}
                    </div>
                </div>
            </header>

            <div className="relative h-screen flex items-center justify-center text-center -mt-20">
                <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover"/>
                <div className="relative z-20 px-6">
                    <h1 className="text-5xl md:text-8xl font-black text-white leading-tight animate-fade-in-down">
                        Experience the Future.
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300 animate-fade-in-up">
                        Discover next-generation products that redefine the boundaries of innovation and design.
                    </p>
                    <a href="#products" className="group inline-flex items-center justify-center mt-8 px-8 py-4 bg-[#007CF0] text-white font-bold rounded-lg shadow-lg shadow-[#007CF0]/30 transition-transform duration-300 hover:scale-105">
                        Explore Products
                        <ArrowRightIcon />
                    </a>
                </div>
            </div>

            <main id="products" className="container mx-auto px-6 py-16">
                <h2 className="text-4xl font-black text-center text-white mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                        Our Collection
                    </span>
                </h2>

                <div className="flex justify-center mb-12">
                    <div className="flex flex-wrap justify-center gap-2 bg-[#1A1A1A] p-2 rounded-full">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => fetchProducts(cat.value, cat.label)}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                                    activeCategory === cat.label
                                        ? 'bg-[#007CF0] text-white'
                                        : 'text-gray-400 hover:bg-gray-700'
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

            <footer className="bg-black/50 border-t border-gray-800 mt-16">
                <div className="container mx-auto px-6 py-8 text-center">
                    <h3 className="text-3xl font-extrabold text-white">NEXUS</h3>
                    <div className="mt-8 border-t border-gray-800 pt-8 text-sm text-gray-500">
                        <p>&copy; {new Date().getFullYear()} NEXUS. The future is now.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
export default ProductList;