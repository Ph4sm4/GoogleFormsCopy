import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute() {
  const { currentUser } = useAuth();

  return currentUser ? <Outlet /> : <Navigate to='/identifier'></Navigate>;
}
//we cant let the user access pages like dashboard if
//the user is not logged in
