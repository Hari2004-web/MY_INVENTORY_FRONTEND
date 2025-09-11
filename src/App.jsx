import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
import ChangePassword from "./pages/Auth/ChangePassword";
import Dashboard from "./pages/Dashboard";
import BillingDashboard from "./pages/BillingDashboard"; // The new dashboard for billers
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Managers from "./pages/Managers";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import ProductList from "./pages/shop/ProductList";
import Billing from "./pages/Billing";
import BillDetails from "./pages/BillDetails";
import ProductDetails from "./pages/ProductDetails"; // 👈 Import the new component
import EditProduct from "./pages/EditProduct"; // 👈 Import the new component


// --- PROTECTED ROUTE AND LAYOUT LOGIC (Unchanged) ---
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const RoleBasedLayout = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  if (user?.role === 'manager') {
    return (
      <ManagerLayout>
        <Outlet />
      </ManagerLayout>
    );
  }

  if (user?.role === 'billing_manager') {
    return (
      <BillingManagerLayout>
        <Outlet />
      </BillingManagerLayout>
    );
  }
  return <Loader />; // Display a loader while user data is being checked
};

// --- NEW COMPONENT TO HANDLE DASHBOARD ROUTING ---
const RoleBasedDashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'admin' || user?.role === 'manager') {
    return <Dashboard />;
  }
  if (user?.role === 'billing_manager') {
    return <BillingDashboard />;
  }
  return <Loader />; // Fallback while user is loading
};


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            // Define default options
            duration: 3000,
            style: {
              background: '#2D3748', // A dark gray background
              color: '#F7FAFC',      // A light gray text color
              borderRadius: '8px',
              border: '1px solid #4A5568',
            },

            // Define specific options for different toast types
            success: {
              duration: 2000,
              iconTheme: {
                primary: '#34D399', // Emerald green
                secondary: '#F7FAFC',
              },
            },
            error: {
              iconTheme: {
                primary: '#F87171', // Red
                secondary: '#F7FAFC',
              },
            },
          }}
        />
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* --- PROTECTED PORTAL ROUTES --- */}
          <Route path="" element={<ProtectedRoute><RoleBasedLayout /></ProtectedRoute>}>
            
            {/* THIS IS THE KEY CHANGE */}
            <Route path="dashboard" element={<RoleBasedDashboard />} />
            
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<ProductDetails />} /> {/* 👈 Add this new route */}
            <Route path="products/edit/:id" element={<EditProduct />} />

            <Route path="stocks" element={<Stocks />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="managers" element={<Managers />} />
            {/* <Route path="billing" element={<Billing />} />
            <Route path="bill/:id" element={<BillDetails />} /> */}
          </Route>
    {/* --- MOVED BILLING ROUTES --- */}
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bill/:id"
              element={
                <ProtectedRoute>
                  <BillDetails />
                </ProtectedRoute>
              }
            />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;