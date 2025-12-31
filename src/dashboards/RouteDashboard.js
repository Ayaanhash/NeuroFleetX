import React, { useState } from "react";

/*
  TripModule.js
  Covers:
  1. Trip Planning
  2. Route Display
  3. Trip History
*/

const TripModule = () => {
  // ---------------- STATES ----------------
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [trips, setTrips] = useState([]);

  // ---------------- HANDLERS ----------------
  const planTrip = () => {
    if (!source || !destination || !distance) {
      alert("Please fill all fields");
      return;
    }

    const newTrip = {
      id: Date.now(),
      source,
      destination,
      distance,
      date: new Date().toLocaleDateString("en-IN"),
      time: new Date().toLocaleTimeString(),
    };

    setTrips((prev) => [newTrip, ...prev]);

    // Clear inputs
    setSource("");
    setDestination("");
    setDistance("");
  };

  // ---------------- UI ----------------
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Trip Planning & History</h2>

      {/* -------- TRIP PLANNING -------- */}
      <div style={styles.card}>
        <h3>Trip Planning</h3>

        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          style={styles.input}
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Distance (km)"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          style={styles.input}
        />

        <button onClick={planTrip} style={styles.button}>
          Plan Trip
        </button>
      </div>

      {/* -------- ROUTE DETAILS -------- */}
      {trips.length > 0 && (
        <div style={styles.card}>
          <h3>Latest Route</h3>
          <p><b>From:</b> {trips[0].source}</p>
          <p><b>To:</b> {trips[0].destination}</p>
          <p><b>Distance:</b> {trips[0].distance} km</p>
        </div>
      )}

      {/* -------- TRIP HISTORY -------- */}
      <div style={styles.card}>
        <h3>Trip History</h3>

        {trips.length === 0 ? (
          <p>No trips planned yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Source</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => (
                <tr key={trip.id}>
                  <td>{trip.source}</td>
                  <td>{trip.destination}</td>
                  <td>{trip.distance} km</td>
                  <td>{trip.date}</td>
                  <td>{trip.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ---------------- STYLES ----------------
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "20px",
  },
  card: {
    background: "#f9f9f9",
    padding: "15px",
    marginBottom: "20px",
    borderRadius: "6px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  button: {
    padding: "8px 16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default TripModule;
