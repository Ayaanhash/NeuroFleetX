// src/dashboards/DriverDashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Profile from '../pages/Profile';
import { dashboardService } from '../services/services';
import '../styles/dashboard.css';

const DriverDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    dashboardService.getDriverMetrics().then(setMetrics);
  }, []);

  return (
    <div className="nf-dashboard-layout">
      <Navbar onProfileClick={() => setActiveView('profile')} />

      <main className="nf-dashboard-main">
        {activeView === 'dashboard' && (
          <>
            <header className="nf-dashboard-header">
              <h2>Driver Dashboard</h2>
              <p>Track today&apos;s trips, distance and earnings.</p>
            </header>

            {!metrics && <div className="nf-loading">Loading metrics...</div>}

            {metrics && (
              <section className="nf-metrics-grid">
                <div className="nf-metric-card">
                  <h3>Today&apos;s Trips</h3>
                  <p>{metrics.todaysTrips}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Today&apos;s Earnings</h3>
                  <p>₹ {metrics.todaysEarnings}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Distance Covered (km)</h3>
                  <p>{metrics.distanceCovered}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Rating</h3>
                  <p>{metrics.rating} ★</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Completed Trips</h3>
                  <p>{metrics.completedTrips}</p>
                </div>
                <div className="nf-metric-card">
                  <h3>Acceptance Rate</h3>
                  <p>{metrics.acceptanceRate}%</p>
                </div>
              </section>
            )}
          </>
        )}

        {activeView === 'profile' && (
          <Profile onBack={() => setActiveView('dashboard')} />
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
