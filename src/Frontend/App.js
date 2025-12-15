// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
import Unauthorized from './pages/Unauthorized';

import AdminDashboard from './dashboards/AdminDashboard';
import FleetManagerDashboard from './dashboards/FleetManagerDashboard';
import DriverDashboard from './dashboards/DriverDashboard';
import CustomerDashboard from './dashboards/CustomerDashboard';

import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { ROLES } from './utils/authUtils';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Profile: any logged-in user can access */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Dashboards per role */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/fleet-manager"
          element={
            <ProtectedRoute allowedRoles={[ROLES.FLEET_MANAGER]}>
              <FleetManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
              <DriverDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/customer"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
