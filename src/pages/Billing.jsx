import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { createBill, getBills } from "../api/billingApi";
import Modal from "../components/modals";

// --- Helper Icons for the UI ---
const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>;
const MinusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>;


const Billing = () => {
  const [products, setProducts] = useState([]);
  const [bills, setBills] = useState([]);
  const [cart, setCart] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gstRate, setGstRate] = useState(18);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProducts();
        setProducts(productResponse.data || []);
        const billResponse = await getBills();
        setBills(billResponse.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  // --- Cart Management Functions ---
  const addToCart = (product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // --- Calculation Functions ---
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateGst = (amount) => {
    return amount * (gstRate / 100);
  };

  // --- Bill Creation ---
  // src/pages/Billing.jsx

const handleCreateBill = async () => {
  if (cart.length === 0) return;
  const subtotal = calculateSubtotal();
  const gstAmount = calculateGst(subtotal);
  const totalAmount = subtotal + gstAmount;

  const billData = {
    products: cart.map(({ id, name, quantity, price }) => ({ id, name, quantity, price })), // Pass name for error message
    total_amount: totalAmount,
    gst_amount: gstAmount,
  };

  try {
    await createBill(billData);
    alert('Bill created successfully!'); // Provide feedback
    setCart([]);
    setIsModalOpen(false);
    const billResponse = await getBills(); // Refresh bills list
    setBills(billResponse.data || []);
  } catch (error) {
    console.error("Failed to create bill:", error);
    // Display the specific error message from the backend (e.g., "Insufficient stock for product: Laptop")
    alert(error.response?.data?.error || "An unexpected error occurred.");
    // We don't close the modal on failure, so the user can adjust the cart.
  }
};

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Billing</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Products Section --- */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredProducts.map(product => (
              <div key={product.id} className="border p-4 rounded-lg cursor-pointer hover:shadow-md hover:border-blue-500 transition-all" onClick={() => addToCart(product)}>
                <p className="font-semibold text-gray-800 truncate">{product.name}</p>
                <p className="text-gray-600">₹{parseFloat(product.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* --- Cart Section --- */}
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Cart</h2>
          <div className="flex-grow space-y-3 overflow-y-auto max-h-[45vh] pr-2">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center pt-10">Your cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 border rounded-full hover:bg-gray-100"><MinusIcon /></button>
                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 border rounded-full hover:bg-gray-100"><PlusIcon /></button>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 ml-2"><TrashIcon /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          {cart.length > 0 && (
            <div className="mt-auto pt-4 border-t">
              <div className="flex justify-between font-semibold mb-4">
                <p>Subtotal</p>
                <p>₹{calculateSubtotal().toFixed(2)}</p>
              </div>
              <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
                Generate Bill
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- Recent Bills Section --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Bills</h2>
        <ul className="space-y-2">
          {bills.map(bill => (
            <li key={bill.id} className="p-3 flex justify-between items-center rounded-lg hover:bg-gray-50">
              <div>
                <p className="font-semibold text-sm text-gray-700">Bill ID: {bill.id}</p>
                <p className="text-lg font-bold">Total: ₹{parseFloat(bill.total_amount).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-500">{new Date(bill.created_at).toLocaleDateString()}</p>
                <Link to={`/bill/${bill.id}`} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-300 transition-colors">
                  View / Print
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* --- Confirmation Modal --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm Bill">
        <div className="space-y-2">
          <h3 className="text-lg font-bold mb-2">Bill Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="my-2"/>
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            <span>₹{calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>GST ({gstRate}%)</span>
            <span>₹{calculateGst(calculateSubtotal()).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-xl mt-4 pt-2 border-t">
            <span>Total</span>
            <span>₹{(calculateSubtotal() + calculateGst(calculateSubtotal())).toFixed(2)}</span>
          </div>
          <button className="w-full bg-green-600 text-white p-2 rounded-md mt-6 font-bold" onClick={handleCreateBill}>
            Confirm and Create Bill
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Billing;