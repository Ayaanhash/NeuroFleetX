import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import Profile from "./pages/Profile";

import AdminDashboard from "./dashboards/AdminDashboard";
import FleetManagerDashboard from "./dashboards/FleetManagerDashboard";
import DriverDashboard from "./dashboards/DriverDashboard";
import CustomerDashboard from "./dashboards/CustomerDashboard";


import RouteDashboard from "./pages/RouteDashboard";
import RoutePlanner from "./pages/RoutePlanner";
import LiveTracking from "./pages/LiveTracking";
import Reports from "./pages/Reports";


import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./utils/authUtils";

const App = () => {
  return (
    <Router>
      <Routes>

        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

      
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

       
        <Route
          path="/module3"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FLEET_MANAGER]}>
              <RouteDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/plan"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FLEET_MANAGER]}>
              <RoutePlanner />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/live-tracking"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FLEET_MANAGER]}>
              <LiveTracking />
            </ProtectedRoute>
          }
        />

    
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FLEET_MANAGER]}>
              <Reports />
            </ProtectedRoute>
          }
        />

       
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
