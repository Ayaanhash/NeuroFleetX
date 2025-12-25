// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, hasAnyRole } from '../utils/authUtils';

const ProtectedRoute = ({ allowedRoles, children }) => {
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

 
  return children;
};

export default ProtectedRoute;
