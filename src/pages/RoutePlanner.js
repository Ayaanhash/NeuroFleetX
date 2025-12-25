import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const RoutePlanner = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [stops, setStops] = useState([]); // 🔹 NEW
  const [routeReady, setRouteReady] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const locations = {
    vzg: [17.6868, 83.2185],
    hyd: [17.385, 78.4867],
    chn: [13.0827, 80.2707],
    blr: [12.9716, 77.5946],
  };

  const addStop = () => {
    setStops([...stops, ""]);
  };

  
  const updateStop = (index, value) => {
    const updated = [...stops];
    updated[index] = value.toLowerCase();
    setStops(updated);
  };

 
  const sendRequest = () => {
    if (!locations[source] || !locations[destination]) {
      setError("Use only: vzg, hyd, chn, blr");
      return;
    }

    // validate stops if entered
    for (let s of stops) {
      if (s && !locations[s]) {
        setError("Stops must be: vzg, hyd, chn, blr");
        return;
      }
    }

    setError("");
    setRouteReady(true);

    /* ===== CREATE TRIP ===== */
    const newTrip = {
      id: "TRIP_" + Date.now(),
      source: source.toUpperCase(),
      stops: stops.filter(Boolean).map(s => s.toUpperCase()),
      destination: destination.toUpperCase(),
      status: "Assigned",
      driver: "Ravi Kumar",
      vehicle: "KA-01-AB-1234",
      eta: "6 hrs",
      optimization: "Shortest Time",
      createdAt: new Date().toISOString(),
    };

    const existingTrips =
      JSON.parse(localStorage.getItem("trips")) || [];

    localStorage.setItem(
      "trips",
      JSON.stringify([...existingTrips, newTrip])
    );

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const routePoints = [
    locations[source],
    ...stops.filter(s => locations[s]).map(s => locations[s]),
    locations[destination],
  ].filter(Boolean);

  return (
    <div style={styles.page}>
      {/* LEFT PANEL */}
      <div style={styles.sidebar}>
        <h2>🧭 Route Input / Trip Planning</h2>
        <p style={styles.sub}>Collect trip details</p>

        <label>Start Location (Source)</label>
        <input
          style={styles.input}
          placeholder="vzg / hyd / chn / blr"
          value={source}
          onChange={(e) => setSource(e.target.value.toLowerCase())}
        />

        {/* ===== STOPS ===== */}
        <label>Stops</label>
        {stops.map((stop, idx) => (
          <input
            key={idx}
            style={styles.input}
            placeholder={`Stop ${idx + 1}`}
            value={stop}
            onChange={(e) => updateStop(idx, e.target.value)}
          />
        ))}

        <button style={styles.stopBtn} onClick={addStop}>
          + Add Stop
        </button>

        <label>Destination</label>
        <input
          style={styles.input}
          placeholder="vzg / hyd / chn / blr"
          value={destination}
          onChange={(e) => setDestination(e.target.value.toLowerCase())}
        />

        <label>Optimization Preference</label>
        <select style={styles.input}>
          <option>Shortest Time</option>
          <option>Least Traffic</option>
          <option>Energy Efficient</option>
        </select>

        <label>Vehicle Type</label>
        <select style={styles.input}>
          <option>Car</option>
          <option>Bike</option>
          <option>Truck</option>
        </select>

        <button style={styles.sendBtn} onClick={sendRequest}>
          🚀 Send Request to AI Route Engine
        </button>

        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <p style={styles.success}>
            ✔ Trip created & assigned successfully
          </p>
        )}
      </div>

      <div style={styles.mapBox}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {routeReady && (
            <>
              {routePoints.map((p, i) => (
                <Marker key={i} position={p} />
              ))}
              <Polyline
                positions={routePoints}
                pathOptions={{ color: "#2563eb", weight: 5 }}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RoutePlanner;


const styles = {
  page: {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(180deg, #f8fafc, #eef2ff)",
  },
  sidebar: {
    width: 360,
    background: "#ffffff",
    padding: 24,
    boxShadow: "8px 0 24px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  sub: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 12,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    marginBottom: 10,
    outline: "none",
  },
  stopBtn: {
    background: "#eef2ff",
    color: "#1e3a8a",
    padding: 8,
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    marginBottom: 10,
  },
  sendBtn: {
    background: "#2563eb",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    border: "none",
    cursor: "pointer",
    marginTop: 10,
  },
  success: {
    color: "#22c55e",
    fontSize: 13,
    marginTop: 8,
  },
  error: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 8,
  },
  mapBox: {
    flex: 1,
    borderLeft: "1px solid #e5e7eb",
  },
};
