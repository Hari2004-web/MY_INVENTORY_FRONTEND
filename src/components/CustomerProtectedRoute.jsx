import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CustomerProtectedRoute = () => {
  const { user } = useAuth();

  // If there's a user and their role is 'customer', show the page.
  // Otherwise, redirect them to the customer login page.
  if (user && user.role === 'customer') {
    return <Outlet />;
  }

  return <Navigate to="/customer/login" />;
};

export default CustomerProtectedRoute;