import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function PrivateRoute() {
  const email = window.emailRegistration;

  return email ? <Outlet /> : <Navigate to='/register'></Navigate>;
}
//we wanna redirect to the first registration page
//if we wanna access any other registration page before
//completing the first one
