// src/dashboards/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Profile from '../pages/Profile';
import { dashboardService } from '../services/services';
import '../styles/dashboard.css';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  // activeView = 'dashboard' | 'profile'

  useEffect(() => {
    dashboardService.getAdminMetrics().then(setMetrics);
  }, []);

  return (
    <div className="nf-dashboard-layout">
      <Navbar onProfileClick={() => setActiveView('profile')} />

      <main className="nf-dashboard-main">
        {/* ✅ DASHBOARD VIEW */}
        {activeView === 'dashboard' && (
          <>
            <header className="nf-dashboard-header">
              <h2>Admin Dashboard</h2>
              <p>Platform overview of users, fleets and performance.</p>
            </header>

            {!metrics && (
              <div className="nf-loading">Loading metrics...</div>
            )}

            {metrics && (
              <section className="nf-metrics-grid">
                <div className="nf-metric-card">
                  <h3>Total Users</h3>
                  <p>{metrics.totalUsers}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Total Fleets</h3>
                  <p>{metrics.totalFleets}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Total Bookings</h3>
                  <p>{metrics.totalBookings}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Active Users</h3>
                  <p>{metrics.activeUsers}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Completed Trips</h3>
                  <p>{metrics.completedTrips}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Total Revenue</h3>
                  <p>₹ {metrics.totalRevenue}</p>
                </div>
              </section>
            )}
          </>
        )}

        {/* ✅ PROFILE VIEW */}
        {activeView === 'profile' && (
          <Profile onBack={() => setActiveView('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
