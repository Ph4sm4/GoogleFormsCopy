import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoggedInRoute() {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to='/' /> : <Outlet />;
}
//if we have already logged in we wanna get redirected to
//dashboard page as we cant let user log in if the user
//is already logged in
