import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";

// Import all your pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import ChangePassword from "./pages/Auth/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Managers from "./pages/Managers";
import Inbox from "./pages/Inbox";
import Profile from "./pages/Profile";
import ProductList from "./pages/shop/ProductList";

// FIX: This component correctly protects routes and redirects to the login page.
// The separate 'ProtectedRoute.jsx' file is no longer needed.
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
  // You might want to add a loader here while the user object is being checked
  return <div>Loading...</div>;
};

function App() {
  return (
    <AuthProvider>
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
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="profile" element={<Profile />} />
            <Route path="change-password" element={<ChangePassword />} />
            {/* Admin-only route */}
            <Route path="managers" element={<Managers />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;