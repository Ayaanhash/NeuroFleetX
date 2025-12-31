import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ===== CLICK HANDLER ===== */
const TrafficClickHandler = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
};

/* ===== TRAFFIC LOGIC ===== */
const getTrafficLevel = () => {
  const hour = new Date().getHours();

  if (hour >= 8 && hour <= 10) return "HEAVY";
  if (hour >= 17 && hour <= 20) return "HEAVY";

  const random = Math.random();
  if (random > 0.6) return "MEDIUM";
  return "LOW";
};

const getTrafficStyle = (level) => {
  switch (level) {
    case "HEAVY":
      return { color: "#dc2626", radius: 1200 };
    case "MEDIUM":
      return { color: "#f97316", radius: 900 };
    default:
      return { color: "#22c55e", radius: 600 };
  }
};

const TrafficAnalytics = () => {
  const [location, setLocation] = useState(null);
  const [traffic, setTraffic] = useState(null);

  const handleSelect = (latlng) => {
    const level = getTrafficLevel();
    setLocation(latlng);
    setTraffic(level);
  };

  const style = traffic ? getTrafficStyle(traffic) : null;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚦 Traffic Analytics</h2>
      <p style={styles.sub}>
        Click anywhere on the map to analyze traffic density
      </p>

      <div style={styles.mapBox}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <TrafficClickHandler onSelect={handleSelect} />

          {location && traffic && (
            <>
              <Marker position={location}>
                <Popup>
                  <strong>Traffic Level:</strong>
                  <br />
                  {traffic}
                </Popup>
              </Marker>

              <Circle
                center={location}
                radius={style.radius}
                pathOptions={{
                  color: style.color,
                  fillColor: style.color,
                  fillOpacity: 0.35,
                }}
              />
            </>
          )}
        </MapContainer>
      </div>

      {/* ===== LEGEND ===== */}
      <div style={styles.legend}>
        <span style={{ ...styles.dot, background: "#22c55e" }} /> Low
        <span style={{ ...styles.dot, background: "#f97316" }} /> Medium
        <span style={{ ...styles.dot, background: "#dc2626" }} /> Heavy
      </div>
    </div>
  );
};

export default TrafficAnalytics;

/* ===== BLUE THEME STYLES ===== */
const styles = {
  container: {
    background: "#e0f2fe",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    color: "#1e40af",
    marginBottom: 4,
  },
  sub: {
    color: "#1e3a8a",
    fontSize: 13,
    marginBottom: 10,
  },
  mapBox: {
    height: "420px",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(37,99,235,0.25)",
  },
  legend: {
    display: "flex",
    gap: 16,
    marginTop: 12,
    alignItems: "center",
    color: "#1e3a8a",
    fontWeight: 600,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    display: "inline-block",
    marginRight: 6,
  },
};
