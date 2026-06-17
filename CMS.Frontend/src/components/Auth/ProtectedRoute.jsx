import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute - Bảo vệ các route yêu cầu đăng nhập.
 * Nếu chưa đăng nhập, redirect về /login.
 */
function ProtectedRoute() {
  const customerInfo = (() => {
    try { return JSON.parse(localStorage.getItem('customerInfo')); }
    catch { return null; }
  })();

  if (!customerInfo) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
