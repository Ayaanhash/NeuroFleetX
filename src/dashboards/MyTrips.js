// src/dashboards/MyTrips.js
import React, { useEffect, useState } from "react";

const MyTrips = () => {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState("calendar"); // calendar | list
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("customer_bookings")) || [];
    setBookings(stored);
  }, []);

  /* ===== CANCEL BOOKING ===== */
  const cancelBooking = (index) => {
    const updated = [...bookings];
    updated[index].status = "Cancelled";
    setBookings(updated);
    localStorage.setItem("customer_bookings", JSON.stringify(updated));
  };

  return (
    <div className="fd-main-content">
      <h1 className="fd-page-title">My Trips</h1>

      {/* ===== VIEW TOGGLE ===== */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button
          className="fd-primary-btn"
          style={{
            background: view === "calendar" ? "#2563eb" : "#1f2937",
          }}
          onClick={() => setView("calendar")}
        >
          📅 Calendar View
        </button>

        <button
          className="fd-primary-btn"
          style={{
            background: view === "list" ? "#2563eb" : "#1f2937",
          }}
          onClick={() => setView("list")}
        >
          📜 List View
        </button>
      </div>

      {/* ===== CALENDAR VIEW ===== */}
      {view === "calendar" && (
        <div className="fd-settings-card">
          {bookings.length === 0 && <p>No trips scheduled.</p>}

          {bookings.map((b, i) => (
            <div
              key={i}
              onClick={() => setSelectedTrip({ ...b, index: i })}
              style={{
                padding: 12,
                borderBottom: "1px solid rgba(55,65,81,0.6)",
                cursor: "pointer",
              }}
            >
              <strong>{b.date}</strong>
              <div style={{ color: "var(--fd-text-muted)" }}>
                {b.source} → {b.destination}
              </div>
              <small>Status: {b.status}</small>
            </div>
          ))}
        </div>
      )}

      {/* ===== LIST VIEW ===== */}
      {view === "list" &&
        bookings.map((b, i) => (
          <div key={i} className="fd-settings-card" style={{ marginBottom: 12 }}>
            <p><strong>Route:</strong> {b.source} → {b.destination}</p>
            <p><strong>Date & Time:</strong> {b.date} {b.time}</p>
            <p><strong>Vehicle:</strong> {b.vehicleType} ({b.vehicleNo})</p>
            <p><strong>Driver:</strong> {b.driver} • {b.phone}</p>
            <p><strong>Cost:</strong> ₹{b.cost}</p>

            <span
              style={{
                padding: "4px 8px",
                borderRadius: 6,
                fontSize: 12,
                background:
                  b.status === "Cancelled"
                    ? "#7f1d1d"
                    : b.status === "Confirmed"
                    ? "#064e3b"
                    : "#1e3a8a",
              }}
            >
              {b.status}
            </span>

            {b.status !== "Cancelled" && (
              <button
                className="fd-delete-btn"
                style={{ marginTop: 8 }}
                onClick={() => cancelBooking(i)}
              >
                Cancel Booking
              </button>
            )}

            <button
              className="fd-primary-btn"
              style={{ marginTop: 8, marginLeft: 8 }}
              onClick={() => setSelectedTrip({ ...b, index: i })}
            >
              View Details
            </button>
          </div>
        ))}

      {/* ===== TRIP DETAILS POPUP ===== */}
      {selectedTrip && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3000,
          }}
          onClick={() => setSelectedTrip(null)}
        >
          <div
            className="fd-settings-card"
            style={{ width: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>🚚 Trip Details</h3>
            <p><strong>Route:</strong> {selectedTrip.source} → {selectedTrip.destination}</p>
            <p><strong>Date:</strong> {selectedTrip.date} {selectedTrip.time}</p>
            <p><strong>Vehicle:</strong> {selectedTrip.vehicleType} ({selectedTrip.vehicleNo})</p>
            <p><strong>Driver:</strong> {selectedTrip.driver}</p>
            <p><strong>Contact:</strong> {selectedTrip.phone}</p>
            <p><strong>Cost:</strong> ₹{selectedTrip.cost}</p>

            {selectedTrip.savedAmount > 0 && (
              <p style={{ color: "#22c55e" }}>
                🎉 Saved ₹{selectedTrip.savedAmount}
              </p>
            )}

            <button
              className="fd-primary-btn"
              style={{ marginTop: 12 }}
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

export default MyTrips;
