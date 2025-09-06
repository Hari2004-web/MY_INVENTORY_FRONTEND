import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ChangePassword from "./pages/Auth/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Managers from "./pages/Managers";
import Inbox from "./pages/Inbox"; // Ensure Inbox is imported

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const RoleBasedLayout = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/managers" element={<Managers />} />
          {/* FIX: Add the Inbox route for the admin as well */}
          <Route path="/inbox" element={<Inbox />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AdminLayout>
    );
  }

  if (user?.role === 'manager') {
    return (
      <ManagerLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ManagerLayout>
    );
  }
  return <div>Loading...</div>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ... Public Routes ... */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/change-password" 
            element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} 
          />
          {/* Protected Routes */}
          <Route
            path="/*"
            element={<ProtectedRoute><RoleBasedLayout /></ProtectedRoute>}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;