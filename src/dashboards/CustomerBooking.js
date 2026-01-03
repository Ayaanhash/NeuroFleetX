import React, { useState } from "react";

const CustomerBooking = ({ onBookingSuccess }) => {
  const [form, setForm] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    preferredVehicle: "EV Van",
    seats: 4,
    energyType: "EV",
  });

  const [recommended, setRecommended] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [bookedTrip, setBookedTrip] = useState(null);

  /* ================= VEHICLE DATA ================= */
  const vehicles = [
    {
      type: "EV Van",
      seats: 6,
      energy: "EV",
      driver: "Ravi Kumar",
      phone: "91234 56789",
      vehicleNo: "KA-01-EV-4455",
      baseCost: 3000,
    },
    {
      type: "Car",
      seats: 4,
      energy: "Non-EV",
      driver: "Suresh",
      phone: "99876 54321",
      vehicleNo: "MH-12-CR-2211",
      baseCost: 1800,
    },
    {
      type: "Truck",
      seats: 2,
      energy: "Non-EV",
      driver: "Shankar",
      phone: "90123 45678",
      vehicleNo: "DL-04-TR-8899",
      baseCost: 5200,
    },
  ];

  /* ================= AI RECOMMENDATION ================= */
  const recommendVehicle = () => {
    const match = vehicles.find(
      (v) =>
        v.type === form.preferredVehicle ||
        (v.energy === form.energyType &&
          v.seats >= form.seats)
    );
    setRecommended(match || vehicles[0]);
  };

  /* ================= CONFIRM BOOKING ================= */
  const confirmBooking = () => {
    if (!form.source || !form.destination || !form.date || !form.time) {
      alert("Please fill all fields");
      return;
    }

    const vehicle = recommended || vehicles[0];
    const saved = Math.floor(Math.random() * 500);

    const trip = {
      ...form,
      vehicleType: vehicle.type,
      vehicleNo: vehicle.vehicleNo,
      driver: vehicle.driver,
      phone: vehicle.phone,
      cost: vehicle.baseCost,
      savedAmount: saved,
      status: "Confirmed",
    };

    const existing =
      JSON.parse(localStorage.getItem("customer_bookings")) || [];

    localStorage.setItem(
      "customer_bookings",
      JSON.stringify([...existing, trip])
    );

    if (onBookingSuccess) onBookingSuccess(trip);

    setBookedTrip(trip);
    setShowPopup(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚘 Customer Booking</h1>

      {/* ===== BOOKING FORM ===== */}
      <div style={styles.card}>
        <div style={styles.grid}>
          <input
            style={styles.input}
            placeholder="Source"
            onChange={(e) =>
              setForm({ ...form, source: e.target.value })
            }
          />
          <input
            style={styles.input}
            placeholder="Destination"
            onChange={(e) =>
              setForm({ ...form, destination: e.target.value })
            }
          />
          <input
            type="date"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
          <input
            type="time"
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
          />
        </div>

        {/* ===== FILTERS ===== */}
        <div style={styles.grid}>
          <select
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, preferredVehicle: e.target.value })
            }
          >
            <option>EV Van</option>
            <option>Car</option>
            <option>Truck</option>
          </select>

          <select
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, seats: Number(e.target.value) })
            }
          >
            <option value={2}>2 Seats</option>
            <option value={4}>4 Seats</option>
            <option value={6}>6 Seats</option>
          </select>

          <select
            style={styles.input}
            onChange={(e) =>
              setForm({ ...form, energyType: e.target.value })
            }
          >
            <option value="EV">EV</option>
            <option value="Non-EV">Non-EV</option>
          </select>
        </div>

        <button style={styles.secondaryBtn} onClick={recommendVehicle}>
          🤖 Get AI Recommendation
        </button>

        {/* ===== RECOMMENDED CARD ===== */}
        {recommended && (
          <div style={styles.recommendCard}>
            <span style={styles.aiBadge}>AI Recommended</span>
            <p><strong>{recommended.type}</strong></p>
            <p>Seats: {recommended.seats}</p>
            <p>Energy: {recommended.energy}</p>
            <p>Price: ₹{recommended.baseCost}</p>
          </div>
        )}

        <button style={styles.primaryBtn} onClick={confirmBooking}>
          Confirm Booking
        </button>
      </div>

      {/* ===== CONFIRMATION POPUP ===== */}
      {showPopup && bookedTrip && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2>✅ Trip Confirmed</h2>
            <p>{bookedTrip.source} → {bookedTrip.destination}</p>
            <p>{bookedTrip.date} at {bookedTrip.time}</p>
            <hr />
            <p><strong>Vehicle:</strong> {bookedTrip.vehicleType}</p>
            <p><strong>No:</strong> {bookedTrip.vehicleNo}</p>
            <p><strong>Driver:</strong> {bookedTrip.driver}</p>
            <p><strong>Contact:</strong> {bookedTrip.phone}</p>
            <p><strong>Cost:</strong> ₹{bookedTrip.cost}</p>
            <p style={{ color: "#22c55e" }}>
              You saved ₹{bookedTrip.savedAmount}
            </p>

            <button
              style={styles.primaryBtn}
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBooking;

/* ================= STYLES ================= */

const styles = {
  container: { maxWidth: 900 },
  title: { marginBottom: 16 },
  card: {
    background: "#071127",
    padding: 20,
    borderRadius: 14,
    border: "1px solid rgba(55,65,81,0.9)",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 12,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    background: "#020617",
    border: "1px solid #1f2937",
    color: "#e5e7eb",
  },
  secondaryBtn: {
    background: "#1e40af",
    padding: 10,
    borderRadius: 10,
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  primaryBtn: {
    background: "#2563eb",
    padding: 12,
    borderRadius: 10,
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  recommendCard: {
    background: "#020617",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #1f2937",
  },
  aiBadge: {
    background: "#22c55e",
    color: "#022c22",
    padding: "2px 8px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  popup: {
    background: "#071127",
    padding: 22,
    borderRadius: 14,
    width: 420,
    border: "1px solid rgba(55,65,81,0.9)",
  },
};
