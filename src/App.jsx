// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";

// --- IMPORT ALL NECESSARY LAYOUTS AND COMPONENTS ---
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import BillingManagerLayout from "./layouts/BillingManagerLayout";
import Loader from "./components/Loader";

// --- IMPORT ALL PAGES ---
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import SetPassword from "./pages/Auth/setPassword"; // The component for the new password page
import ChangePassword from "./pages/Auth/ChangePassword";
import Dashboard from "./pages/Dashboard";
import BillingDashboard from "./pages/BillingDashboard";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Managers from "./pages/Managers";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import ProductList from "./pages/shop/ProductList";
import Billing from "./pages/Billing";
import BillDetails from "./pages/BillDetails";
import ProductDetails from "./pages/ProductDetails";
import EditProduct from "./pages/EditProduct";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Wishlist from "./pages/shop/Wishlist";
import ShopProductDetail from "./pages/shop/ShopProductDetail";
import CustomerLogin from "./pages/shop/CustomerLogin";
import CustomerRegister from "./pages/shop/CustomerRegister";
import VerifyOtp from "./pages/Auth/VerifyOtp"; 


// --- PROTECTED ROUTE AND LAYOUT LOGIC ---
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const RoleBasedLayout = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminLayout><Outlet /></AdminLayout>;
  }
  if (user?.role === 'manager') {
    return <ManagerLayout><Outlet /></ManagerLayout>;
  }
  if (user?.role === 'billing_manager') {
    return <BillingManagerLayout><Outlet /></BillingManagerLayout>;
  }
  return <Loader />;
};

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'manager') {
    return <Dashboard />;
  }
  if (user?.role === 'billing_manager') {
    return <BillingDashboard />;
  }
  return <Loader />;
};


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Router now wraps all components that need routing context */}
        <Router>
          <WishlistProvider>
            <Toaster
              position="bottom-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#2D3748',
                  color: '#F7FAFC',
                  borderRadius: '8px',
                  border: '1px solid #4A5568',
                },
              }}
            />
            <Routes>
              {/* --- PUBLIC SHOP & AUTH ROUTES --- */}
              <Route path="/" element={<ProductList />} />
              <Route path="/shop/product/:id" element={<ShopProductDetail />} />
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/register" element={<CustomerRegister />} />
              <Route path="/wishlist" element={<Wishlist />} />

              {/* --- PUBLIC PORTAL AUTH ROUTES --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              {/* This is the new route for managers to set their password */}
              <Route path="/set-password/:token" element={<SetPassword />} />


              {/* --- PROTECTED ROUTES --- */}
              <Route element={<ProtectedRoute><RoleBasedLayout /></ProtectedRoute>}>
                <Route path="dashboard" element={<RoleBasedDashboard />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetails />} />
                <Route path="products/edit/:id" element={<EditProduct />} />
                <Route path="stocks" element={<Stocks />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="profile" element={<Profile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="managers" element={<Managers />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customers/:id" element={<CustomerDetails />} />
                <Route path="billing" element={<Billing />} />
                <Route path="bill/:id" element={<BillDetails />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;