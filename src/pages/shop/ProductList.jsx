import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getRecommendedProducts, getProductsByCategory } from "../../api/publicApi";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist, useWishlistActions } from "../../context/WishlistContext";
import { initiateCheckout } from "../../api/checkoutApi";
import { createCodOrder, createWalletOrder } from "../../api/billingApi";
import { getWalletDetails } from "../../api/walletApi";
import { validateCoupon } from "../../api/couponApi.js";
import PaymentMethodModal from "../../components/PaymentMethodModal";
import toast from 'react-hot-toast';
import Button from "../../components/Button";
import { getBanners } from "../../api/bannerApi"; // Import banner API
import Slider from "react-slick"; // Import Slider
import ChatWidget from "../../components/ChatWidget"; // Import the new component

// --- Icon Components ---
const ArrowRightIcon = () => <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>;
const CartIconSvg = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>;
const HeartIcon = ({ isFilled }) => (
    <svg className={`w-6 h-6 transition-all duration-200 ${isFilled ? 'text-red-500' : 'text-gray-400'}`} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);
const PlusIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>;
const UserIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const SearchIcon = () => <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;


// --- Banner Slider Component ---
const BannerSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getBanners();
        setBanners(response.data || []);
      } catch {
        // Fail silently if banners can't be fetched
      }
    };
    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };
  
  if (banners.length === 0) return null;

  return (
    <div className="mb-16">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <Link to={banner.link || '#'}>
              <div className="relative w-full h-[400px] bg-gray-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-8 text-white">
                <img src={`http://localhost:5000${banner.image_url}`} alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-50"/>
                <div className="relative z-10 text-center max-w-2xl">
                  <h2 className="text-5xl font-extrabold mb-4 drop-shadow-lg">{banner.title}</h2>
                  {banner.subtitle && <p className="text-xl mb-8 font-light">{banner.subtitle}</p>}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};


// --- Product Card Component ---
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
                <p className="text-sm text-gray-600 mb-3 capitalize">{product.category || 'Uncategorized'}</p>
                <p className="text-2xl font-extrabold text-[#0A3816] mb-4">₹{parseFloat(product.price).toFixed(2)}</p>
                
                <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                    <button onClick={handleWishlistToggle} className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200">
                        <HeartIcon isFilled={isInWishlist(product.id)} />
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.quantity === 0}
                        className="flex items-center px-4 py-2 bg-[#0A3816] text-white font-semibold rounded-full shadow-md hover:bg-[#1A5021] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                    >
                        <PlusIcon />
                        <span className="ml-2">Add to Cart</span>
                    </button>
                </div>
            </div>
        </Link>
    );
};

// --- Skeleton Card for Loading State ---
const SkeletonCard = () => (
    <div className="block rounded-xl overflow-hidden shadow-lg bg-white animate-pulse">
        <div className="h-60 w-full bg-gray-200"></div>
        <div className="p-5">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="h-10 bg-gray-200 rounded-full w-32"></div>
            </div>
        </div>
    </div>
);


// --- Cart Modal Component ---
const CartModal = ({ isOpen, onClose, onCheckout }) => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);

    if (!isOpen) return null;
    
    let cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discountedTotal = cartTotal - discount;

    const applyCoupon = async () => {
        try {
            const response = await validateCoupon(couponCode);
            
            if (response.success && response.data) {
                const coupon = response.data;
                if (coupon.discount_type === 'percentage') {
                    setDiscount((cartTotal * coupon.discount_value) / 100);
                } else { // fixed_amount
                    setDiscount(coupon.discount_value);
                }
                toast.success("Coupon applied successfully!");
            } else {
                setDiscount(0);
                toast.error(response.message || "Invalid coupon code.");
            }
        } catch (error) {
            setDiscount(0);
            toast.error(error.response?.data?.message || "Invalid or expired coupon.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-md bg-white h-full flex flex-col text-gray-800 shadow-2xl animate-slide-in-right" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-3xl font-bold text-[#0A3816]">Your Cart</h2>
                    <button onClick={onClose} className="text-4xl text-gray-400 hover:text-[#0A3816] transition-colors">&times;</button>
                </div>
                {cartItems.length === 0 ? (
                    <div className="flex-grow flex items-center justify-center text-gray-500 text-lg">Your cart is empty.</div>
                ) : (
                    <div className="flex-grow overflow-y-auto p-6 space-y-5">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex items-center gap-4 border-b border-gray-100 pb-4 last:border-b-0">
                                <img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="w-24 h-24 object-cover rounded-md border border-gray-200 shadow-sm"/>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                                    <p className="text-gray-600 text-base">₹{parseFloat(item.price).toFixed(2)}</p>
                                    <div className="flex items-center mt-3 bg-gray-50 rounded-full w-fit">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-gray-700 hover:text-[#0A3816] transition-colors disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                                        <span className="px-4 font-bold text-base text-[#0A3816]">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-gray-700 hover:text-[#0A3816] transition-colors">+</button>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded-md">Remove</button>
                            </div>
                        ))}
                    </div>
                )}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-2 mb-4">
                        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" className="w-full p-2 border rounded-lg" />
                        <Button onClick={applyCoupon}>Apply</Button>
                    </div>
                    {discount > 0 && <p className="text-green-600 text-center mb-4">Discount Applied: -₹{discount.toFixed(2)}</p>}

                    <div className="flex justify-between font-bold text-2xl mb-5 text-[#0A3816]">
                        <span>Total:</span>
                        <span>₹{discountedTotal.toFixed(2)}</span>
                    </div>
                    <button
                        onClick={() => onCheckout(couponCode)}
                        className="w-full py-4 bg-[#0A3816] text-white font-bold rounded-lg shadow-lg hover:bg-[#1A5021] transition-all duration-300 text-xl disabled:bg-gray-400"
                        disabled={cartItems.length === 0}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const { cartItems } = useCart();
    const { user, logout } = useAuth();
    const [activeCategory, setActiveCategory] = useState('Recommended');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('recommended');
    const [couponCode, setCouponCode] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                const productRes = await getRecommendedProducts();
                setProducts(productRes.data || []);
                
                if (user) {
                    const walletRes = await getWalletDetails();
                    setWalletBalance(parseFloat(walletRes.data.balance) || 0);
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
                toast.error("Could not fetch initial page data.");
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [user]);

    const fetchProducts = async (categoryValue, categoryLabel) => {
        setLoading(true);
        setActiveCategory(categoryLabel);
        setSearchTerm('');
        setSortOption('recommended');
        try {
            const response = categoryValue === 'Recommended'
                ? await getRecommendedProducts()
                : await getProductsByCategory(categoryValue);
            setProducts(response.data || []);
        } catch {
            toast.error("Could not fetch products.");
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };
    
    const createBillData = () => {
        const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const gstAmount = subtotal * 0.18;
        const totalAmount = subtotal + gstAmount;
        return {
            products: cartItems.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })),
            total_amount: totalAmount,
            gst_amount: gstAmount,
            coupon_code: couponCode,
        };
    };

    const startStripePurchase = async () => {
        setIsPaymentModalOpen(false);
        const billData = createBillData();
        const loadingToast = toast.loading("Redirecting to payment...");
        try {
            const response = await initiateCheckout(billData);
            const redirectUrl = response.data.data.url;
            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                toast.error("Could not retrieve payment URL.", { id: loadingToast });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not start checkout.", { id: loadingToast });
        }
    };

    const startCodPurchase = async () => {
        setIsPaymentModalOpen(false);
        const billData = createBillData();
        const loadingToast = toast.loading("Placing Cash on Delivery order...");
        try {
            const response = await createCodOrder(billData);
            if (response.success) {
                toast.success("Order placed successfully!", { id: loadingToast });
                navigate(`/order/success?bill_id=${response.data.id}`);
            } else {
                toast.error(response.message || "Failed to place order.", { id: loadingToast });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Could not complete purchase.", { id: loadingToast });
        }
    };
    
    const startWalletPurchase = async () => {
        setIsPaymentModalOpen(false);
        const billData = createBillData();
        const loadingToast = toast.loading("Processing wallet payment...");
        try {
            const response = await createWalletOrder(billData);
            if (response.success) {
                toast.success(response.message, { id: loadingToast });
                navigate(`/order/success?bill_id=${response.data.id}`);
            } else {
                toast.error(response.message, { id: loadingToast });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Payment failed.", { id: loadingToast });
        }
    };

    const handleCheckout = (coupon) => {
        if (user) {
            setCouponCode(coupon);
            setIsCartOpen(false);
            setIsPaymentModalOpen(true);
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
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const categories = [
        { label: 'Recommended', value: 'Recommended' },
        { label: 'Laptops', value: 'laptops' },
        { label: 'Mobiles', value: 'mobiles' },
        { label: 'Gadgets', value: 'electronic gadgets' },
    ];

    const displayedProducts = useMemo(() => {
        let filtered = products.filter(p => p && p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        let sorted = [...filtered];

        switch (sortOption) {
            case 'price-asc': sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
            case 'price-desc': sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
            case 'latest': sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
            case 'name-asc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
            case 'name-desc': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
            default: break;
        }
        return sorted;
    }, [products, searchTerm, sortOption]);

    return (
        <div className="bg-gradient-to-br from-[#F8F4E3] to-gray-50 text-gray-800 font-sans min-h-screen">
            <ChatWidget />
            <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onCheckout={handleCheckout} />
            
            <PaymentMethodModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onStripeCheckout={startStripePurchase}
                onCodCheckout={startCodPurchase}
                onWalletCheckout={startWalletPurchase}
                walletBalance={walletBalance}
                cartTotal={cartTotal}
            />

            <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-3xl font-black tracking-wider text-[#0A3816]">NEXUS</Link>
                    <nav className="hidden md:flex items-center space-x-8">
                        {categories.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => fetchProducts(cat.value, cat.label)}
                                className={`text-lg font-medium hover:text-[#0A3816] transition-colors ${
                                    activeCategory === cat.label ? 'text-[#0A3816] font-bold border-b-2 border-[#0A3816]' : 'text-gray-700'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center space-x-6">
                        <Link to="/wishlist" className="text-gray-600 hover:text-red-500 transition-colors"><HeartIcon isFilled={false} /></Link>
                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-600 hover:text-[#0A3816] transition-colors">
                            <CartIconSvg />
                            {totalItemsInCart > 0 && <span className="absolute -top-2 -right-3 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{totalItemsInCart}</span>}
                        </button>
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center text-gray-700 hover:text-[#0A3816] transition-colors">
                                    <UserIcon />
                                    <span className="ml-2 text-sm font-semibold hidden md:block">{user.username}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 invisible">
                                    <Link to="/customer/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile & Orders</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Logout</button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/customer/login" className="px-5 py-2 border border-gray-300 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                                <span className="hidden md:inline">Sign In</span> <UserIcon className="md:hidden" />
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10">
                <BannerSlider />

                <h2 id="products" className="text-5xl font-extrabold text-center text-[#0A3816] mb-12">Our Latest Collection</h2>
                
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
                    <div className="flex flex-grow items-center relative w-full md:w-auto">
                        <SearchIcon className="absolute left-3" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0A3816]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-end gap-3 w-full md:w-auto">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A3816]"
                        >
                            <option value="recommended">Sort: Recommended</option>
                            <option value="latest">Sort: Latest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Name: A-Z</option>
                            <option value="name-desc">Name: Z-A</option>
                        </select>
                        <button onClick={() => { setSearchTerm(''); setSortOption('recommended'); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors text-sm">Clear Filters</button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {displayedProducts.length > 0 ? (
                            displayedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-600 text-xl py-10">No products found matching your criteria. Try adjusting your search or filters.</p>
                        )}
                    </div>
                )}
            </main>

            <footer className="bg-[#0A3816] text-white py-12 mt-16">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">NEXUS</h3>
                        <p className="text-gray-300">Your ultimate destination for premium electronics.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
                            <li><a href="#products" className="text-gray-300 hover:text-white transition-colors">Shop All</a></li>
                            <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4">Support</h3>
                        <ul className="space-y-2">
                            <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm mt-10 border-t border-gray-700 pt-8">
                    &copy; {new Date().getFullYear()} NEXUS. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default ProductList;