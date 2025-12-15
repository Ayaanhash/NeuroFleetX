// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasAnyRole } from '../utils/authUtils';

const ProtectedRoute = ({ allowedRoles, children }) => {
  // Not logged in → send to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → send to unauthorized
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed → show the protected page
  return children;
};

export default ProtectedRoute;
