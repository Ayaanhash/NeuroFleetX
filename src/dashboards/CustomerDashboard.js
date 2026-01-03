// src/dashboards/CustomerDashboard.js
import React, { useState } from "react";
import CustomerBooking from "./CustomerBooking";
import Profile from "../pages/Profile";
import MyTrips from "./MyTrips";


/* ================= CUSTOMER OVERVIEW ================= */
const CustomerOverview = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);

  const trips = [
    {
      date: "22 Dec",
      route: "Hyderabad → Bengaluru",
      vehicle: "EV Van",
      cost: 3200,
      saved: 300,
      driver: "Ravi Kumar",
      phone: "91234 56789",
      vehicleNo: "KA-01-EV-4455",
    },
    {
      date: "18 Dec",
      route: "Delhi → Jaipur",
      vehicle: "Car",
      cost: 1800,
      saved: 0,
      driver: "Suresh",
      phone: "99876 54321",
      vehicleNo: "MH-12-CR-2211",
    },
    {
      date: "12 Dec",
      route: "Chennai → Vellore",
      vehicle: "Truck",
      cost: 5200,
      saved: 450,
      driver: "Shankar",
      phone: "90123 45678",
      vehicleNo: "DL-04-TR-8899",
    },
  ];

  const totalTrips = trips.length;
  const totalSpent = trips.reduce((s, t) => s + t.cost, 0);
  const totalSaved = trips.reduce((s, t) => s + t.saved, 0);

  return (
    <div className="fd-main-content">
      <h1 className="fd-page-title">Customer Overview</h1>

      {/* ===== METRICS ===== */}
      <div className="fd-summary-row">
        <div className="fd-summary-card">
          <p className="fd-summary-label">Total Trips</p>
          <p className="fd-summary-value">{totalTrips}</p>
        </div>

        <div className="fd-summary-card">
          <p className="fd-summary-label">Total Spent</p>
          <p className="fd-summary-value">₹{totalSpent}</p>
        </div>

        <div className="fd-summary-card">
          <p className="fd-summary-label">Total Saved</p>
          <p className="fd-summary-value" style={{ color: "#22c55e" }}>
            ₹{totalSaved}
          </p>
        </div>
      </div>

      {/* ===== GRID ===== */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* ===== CALENDAR ===== */}
        <div className="fd-settings-card">
          <h3>📅 Personal Trip Calendar</h3>

          {trips.map((t, i) => (
            <div
              key={i}
              onClick={() => setSelectedTrip(t)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid rgba(55,65,81,0.6)",
                cursor: "pointer",
              }}
            >
              <div>
                <strong>{t.date}</strong>
                <div style={{ color: "var(--fd-text-muted)" }}>{t.route}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div>{t.vehicle}</div>
                <small style={{ color: "#22c55e" }}>
                  Saved ₹{t.saved}
                </small>
              </div>
            </div>
          ))}
        </div>

        {/* ===== RIGHT SIDE ===== */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="fd-settings-card">
            <h4>📍 Suggested Routes</h4>
            <p>Bengaluru → Mysuru</p>
            <p>Hyderabad → Vijayawada</p>
          </div>

          <div className="fd-settings-card">
            <h4>🎁 Offers</h4>
            <p>₹300 off on EV Vans</p>
            <p>10% off long trips</p>
          </div>
        </div>
      </div>

      {/* ===== POPUP ===== */}
      {selectedTrip && (
        <div
          onClick={() => setSelectedTrip(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="fd-settings-card"
            style={{ width: 420 }}
          >
            <h3>🚗 Trip Details</h3>
            <p><strong>Route:</strong> {selectedTrip.route}</p>
            <p><strong>Date:</strong> {selectedTrip.date}</p>
            <p><strong>Vehicle:</strong> {selectedTrip.vehicle}</p>
            <p><strong>Vehicle No:</strong> {selectedTrip.vehicleNo}</p>
            <p><strong>Driver:</strong> {selectedTrip.driver}</p>
            <p><strong>Contact:</strong> {selectedTrip.phone}</p>
            <p><strong>Cost:</strong> ₹{selectedTrip.cost}</p>
            <p style={{ color: "#22c55e" }}>
              Saved ₹{selectedTrip.saved}
            </p>

            <button
              className="fd-primary-btn"
              style={{ marginTop: 10 }}
              onClick={() => setSelectedTrip(null)}
            >
              Close
            </button>
        
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= MAIN DASHBOARD ================= */
const CustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <CustomerOverview />;
      case "booking":
        return <CustomerBooking />;
        case "trips":
  return <MyTrips />;

      case "history":
        return <CustomerOverview />; // reuse overview for now
      case "profile":
        return <Profile />;
      default:
        return <CustomerOverview />;
    }
  };

  return (
    <div className="fd-wrapper">
      <aside className="fd-sidebar">
        <div className="fd-logo">
          <span className="fd-logo-icon">🧑‍💼</span>
          <div>
            <p className="fd-logo-title">Customer</p>
            <p className="fd-logo-subtitle">Dashboard</p>
          </div>
        </div>

        <nav className="fd-nav">
          {[
            ["overview", "📊", "Overview"],
            ["booking", "🧾", "Book Vehicle"],
             ["trips", "🗺️", "My Trips"],
            ["profile", "👤", "Profile"],
          ].map(([key, icon, label]) => (
            <button
              key={key}
              className={`fd-nav-item ${
                activeTab === key ? "fd-nav-item-active" : ""
              }`}
              onClick={() => setActiveTab(key)}
            >
              <span className="fd-nav-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="fd-main">{renderContent()}</main>
    </div>
  );
};

export default CustomerDashboard;
