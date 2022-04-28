import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function LoggedInRoute() {
  const email = localStorage.getItem('login__email');

  return email ? <Outlet /> : <Navigate to='/identifier' />;
}
//we wanna get redirected to enter our email if we havent done it
//yet, cause otherwise we could be entering a password without
//giving the email
