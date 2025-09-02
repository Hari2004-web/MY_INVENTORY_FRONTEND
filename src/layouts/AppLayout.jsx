import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';

const AppLayout = () => {
  const { user } = useAuth();

  if (!user) {
    // This should not happen if PrivateRoute is working, but it's a good safeguard.
    return <Navigate to="/login" />;
  }

  // You can add more logic here for different layouts based on role
  // For now, all logged-in users get the AdminLayout.
  return (
    <AdminLayout>
      <Outlet /> {/* This is where the child routes like Dashboard will be rendered */}
    </AdminLayout>
  );
};

export default AppLayout;