import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Debugger from "./components/Debugger";
// Layouts
import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";

// Pages
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Managers from "./pages/Managers";

// Checks if a user is logged in
const ProtectedRoute = ({ children }) => {  
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

// This component renders the correct UI based on the user's role
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
          <Route path="/products" element={<Products />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ManagerLayout>
    );
  }

  // A fallback while the user object is loading
  return <div>Loading user role...</div>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <RoleBasedLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;