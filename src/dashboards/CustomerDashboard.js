// src/dashboards/CustomerDashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Profile from '../pages/Profile';
import { dashboardService } from '../services/services';
import '../styles/dashboard.css';

const CustomerDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'profile'

  useEffect(() => {
    dashboardService.getCustomerMetrics().then(setMetrics);
  }, []);

  return (
    <div className="nf-dashboard-layout">
      <Navbar onProfileClick={() => setActiveView('profile')} />

      <main className="nf-dashboard-main">
        {/* DASHBOARD VIEW */}
        {activeView === 'dashboard' && (
          <>
            <header className="nf-dashboard-header">
              <h2>Customer Dashboard</h2>
              <p>See your bookings, spend and favourite routes.</p>
            </header>

            {!metrics && <div className="nf-loading">Loading metrics...</div>}

            {metrics && (
              <section className="nf-metrics-grid">
                <div className="nf-metric-card">
                  <h3>Active Bookings</h3>
                  <p>{metrics.activeBookings}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Total Trips</h3>
                  <p>{metrics.totalTrips}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Total Spent</h3>
                  <p>₹ {metrics.totalSpent}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Amount Saved</h3>
                  <p>₹ {metrics.amountSaved}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Upcoming Trips</h3>
                  <p>{metrics.upcomingTrips}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Favourite Routes</h3>
                  <p>{metrics.favouriteRoutes}</p>
                </div>
              </section>
            )}
          </>
        )}

        {/* PROFILE VIEW */}
        {activeView === 'profile' && (
          <Profile onBack={() => setActiveView('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default CustomerDashboard;
