import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Profile from '../pages/Profile';
import { dashboardService } from '../services/services';

const CustomerDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [activeTrip, setActiveTrip] = useState(null);

  useEffect(() => {
    dashboardService.getCustomerMetrics().then(setMetrics);

    // ✅ Load active trip created via Route Optimization
    const trip = localStorage.getItem('activeTrip');
    if (trip) {
      setActiveTrip(JSON.parse(trip));
    }
  }, []);

  return (
    <div style={styles.layout}>
      <Navbar onProfileClick={() => setActiveView('profile')} />

      <main style={styles.main}>
        {activeView === 'dashboard' && (
          <>
            <header style={styles.header}>
              <h2>Customer Dashboard</h2>
              <p>View your current trip and booking details</p>
            </header>

            {/* ===== ROUTE OPTIMIZATION VISIBILITY (MODULE 3) ===== */}
            {activeTrip && (
              <section style={styles.tripCard}>
                <h3>📍 Current Trip</h3>

                <p><b>From:</b> {activeTrip.source.toUpperCase()}</p>
                <p><b>To:</b> {activeTrip.destination.toUpperCase()}</p>
                <p><b>Vehicle:</b> {activeTrip.vehicleType}</p>
                <p><b>Optimized By:</b> {activeTrip.optimization}</p>
                <p><b>ETA:</b> {activeTrip.time}</p>
                <p><b>Distance:</b> {activeTrip.distance}</p>

                <p>
                  <b>Status:</b>{' '}
                  <span style={styles.statusActive}>
                    {activeTrip.status}
                  </span>
                </p>
              </section>
            )}

            {!metrics && <div style={styles.loading}>Loading metrics...</div>}

            {metrics && (
              <section style={styles.grid}>
                <div style={styles.card}>
                  <h4>Active Bookings</h4>
                  <p>{metrics.activeBookings}</p>
                </div>

                <div style={styles.card}>
                  <h4>Total Trips</h4>
                  <p>{metrics.totalTrips}</p>
                </div>

                <div style={styles.card}>
                  <h4>Total Spent</h4>
                  <p>₹ {metrics.totalSpent}</p>
                </div>

                <div style={styles.card}>
                  <h4>Amount Saved</h4>
                  <p>₹ {metrics.amountSaved}</p>
                </div>

                <div style={styles.card}>
                  <h4>Upcoming Trips</h4>
                  <p>{metrics.upcomingTrips}</p>
                </div>

                <div style={styles.card}>
                  <h4>Favourite Routes</h4>
                  <p>{metrics.favouriteRoutes}</p>
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

export default CustomerDashboard;

/* ===== INLINE STYLES ===== */
const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f8fafc',
  },
  main: {
    flex: 1,
    padding: '24px',
  },
  header: {
    marginBottom: '20px',
  },
  loading: {
    padding: '20px',
    fontSize: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  card: {
    background: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
  },
  tripCard: {
    background: '#f0fdf4',
    borderLeft: '6px solid #22c55e',
    padding: '18px',
    borderRadius: '14px',
    marginBottom: '22px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  statusActive: {
    color: '#16a34a',
    fontWeight: '700',
  },
};
