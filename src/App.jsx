// src/App.jsx

import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { Toaster } from "react-hot-toast";

// --- IMPORT LAYOUTS AND COMPONENTS ---
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import BillingManagerLayout from "./layouts/BillingManagerLayout";
import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Auth/Login.jsx"));
const Register = lazy(() => import("./pages/Auth/register.jsx"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword.jsx"));
const SetPassword = lazy(() => import("./pages/Auth/setPassword.jsx"));
const ChangePassword = lazy(() => import("./pages/Auth/ChangePassword.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const BillingDashboard = lazy(() => import("./pages/BillingDashboard.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));
const AddProduct = lazy(() => import("./pages/AddProduct.jsx"));
const EditProduct = lazy(() => import("./pages/EditProduct.jsx"));
const Stocks = lazy(() => import("./pages/Stocks.jsx"));
const Managers = lazy(() => import("./pages/Managers.jsx"));
const Inbox = lazy(() => import("./pages/inbox.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const ProductList = lazy(() => import("./pages/shop/ProductList.jsx"));
const Billing = lazy(() => import("./pages/Billing.jsx"));
const BillDetails = lazy(() => import("./pages/BillDetails.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const Customers = lazy(() => import("./pages/Customers.jsx"));
const CustomerDetails = lazy(() => import("./components/CustomerDetails.jsx"));
const Wishlist = lazy(() => import("./pages/shop/Wishlist.jsx"));
const ShopProductDetail = lazy(() => import("./pages/shop/ShopProductDetail.jsx"));
const CustomerLogin = lazy(() => import("./pages/shop/CustomerLogin.jsx"));
const CustomerRegister = lazy(() => import("./pages/shop/CustomerRegister.jsx"));
const VerifyOtp = lazy(() => import("./pages/Auth/VerifyOtp.jsx"));
const AboutUs = lazy(() => import("./pages/shop/AboutUs.jsx"));
const Contact = lazy(() => import("./pages/shop/Contact.jsx"));
const Faq = lazy(() => import("./pages/shop/Faq.jsx"));
const ShippingReturns = lazy(() => import("./pages/shop/ShippingReturns.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/shop/PrivacyPolicy.jsx"));
const CustomerProfile = lazy(() => import("./pages/shop/CustomerProfile.jsx"));
const Wallet = lazy(() => import("./pages/shop/Wallet.jsx"));
const OrderSuccess = lazy(() => import("./pages/shop/OrderSuccess.jsx"));
// --- 1. IMPORT THE NEW TRACKING PAGE ---
const OrderTracking = lazy(() => import("./pages/shop/OrderTracking.jsx"));


// --- Role-Based Layout Logic ---
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
  return <div className="flex h-screen w-full items-center justify-center"><Loader /></div>; 
};

const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'manager') {
    return <Dashboard />;
  }
  if (user?.role === 'billing_manager') {
    return <BillingDashboard />;
  }
  return <div className="flex h-screen w-full items-center justify-center"><Loader /></div>;
};


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <WishlistProvider>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader /></div>}>
              <Routes>
                {/* --- PUBLIC SHOP & AUTH ROUTES --- */}
                <Route path="/" element={<ProductList />} />
                <Route path="/order/success" element={<OrderSuccess />} />
                <Route path="/shop/product/:id" element={<ShopProductDetail />} />
                <Route path="/customer/login" element={<CustomerLogin />} />
                <Route path="/customer/register" element={<CustomerRegister />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/customer/profile" element={<CustomerProfile />} />
                <Route path="/wallet" element={<Wallet />} />
                {/* --- 2. ADD THE ROUTE FOR THE TRACKING PAGE --- */}
                <Route path="/track-order/:id" element={<OrderTracking />} />

                {/* --- STATIC PAGES --- */}
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/shipping" element={<ShippingReturns />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />

                {/* --- PUBLIC PORTAL AUTH ROUTES --- */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/set-password/:token" element={<SetPassword />} />

                {/* --- PROTECTED ROUTES --- */}
                <Route element={<ProtectedRoute><RoleBasedLayout /></ProtectedRoute>}>
                  <Route path="dashboard" element={<RoleBasedDashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/add" element={<AddProduct />} />
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
            </Suspense>
          </WishlistProvider>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;