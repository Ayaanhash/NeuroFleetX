import React, { useState } from "react";

const HistoryReports = () => {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];

  const [routeFilter, setRouteFilter] = useState("ALL");
  const [vehicleFilter, setVehicleFilter] = useState("ALL");

  /* ===== FILTER LOGIC ===== */
  const filteredTrips = trips.filter((t) => {
    return (
      (routeFilter === "ALL" || t.routeType === routeFilter) &&
      (vehicleFilter === "ALL" || t.vehicleType === vehicleFilter)
    );
  });

  /* ===== INSIGHTS ===== */
  const totalTrips = trips.length;

  const avgCost =
    trips.length === 0
      ? 0
      : Math.round(
          trips.reduce(
            (sum, t) => sum + parseInt(t.cost?.replace("₹", "") || 0),
            0
          ) / trips.length
        );

  const routeCount = trips.reduce((acc, t) => {
    acc[t.routeType] = (acc[t.routeType] || 0) + 1;
    return acc;
  }, {});

  const mostUsedRoute =
    Object.keys(routeCount).length === 0
      ? "N/A"
      : Object.keys(routeCount).reduce((a, b) =>
          routeCount[a] > routeCount[b] ? a : b
        );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Trip History Reports</h2>

      {/* ===== INSIGHTS ===== */}
      <div style={styles.insights}>
        <div style={styles.insightCard}>Total Trips: {totalTrips}</div>
        <div style={styles.insightCard}>Avg Cost: ₹{avgCost}</div>
        <div style={styles.insightCard}>
          Most Used Route: {mostUsedRoute.toUpperCase()}
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div style={styles.filters}>
        <select
          style={styles.select}
          onChange={(e) => setRouteFilter(e.target.value)}
        >
          <option value="ALL">All Routes</option>
          <option value="shortest">Shortest</option>
          <option value="traffic">Traffic</option>
          <option value="eco">Eco</option>
        </select>

        <select
          style={styles.select}
          onChange={(e) => setVehicleFilter(e.target.value)}
        >
          <option value="ALL">All Vehicles</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
        </select>
      </div>

      {/* ===== TABLE ===== */}
      {filteredTrips.length === 0 ? (
        <p style={styles.empty}>No trip history available.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Trip ID</th>
              <th style={styles.th}>Route</th>
              <th style={styles.th}>Vehicle</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Distance</th>
              <th style={styles.th}>ETA</th>
              <th style={styles.th}>Cost</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrips.map((t) => (
              <tr key={t.id} style={styles.tr}>
                <td style={styles.td}>{t.id}</td>
                <td style={styles.td}>
                  {t.source} → {t.destination}
                </td>
                <td style={styles.td}>{t.vehicleType}</td>
                <td style={styles.td}>{t.routeType}</td>
                <td style={styles.td}>{t.distance}</td>
                <td style={styles.td}>{t.eta}</td>
                <td style={styles.td}>{t.cost}</td>
                <td style={styles.td}>
                  {new Date(t.createdAt).toLocaleDateString()}{" "}
                  {new Date(t.createdAt).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryReports;

/* ===== BLUE THEME STYLES ===== */
const styles = {
  container: {
    background: "#e0f2fe",
    padding: 24,
    borderRadius: 16,
    border: "1px solid #bae6fd",
  },
  title: {
    color: "#1e40af",
    marginBottom: 16,
  },
  insights: {
    display: "flex",
    gap: 16,
    marginBottom: 18,
  },
  insightCard: {
    flex: 1,
    background: "#dbeafe",
    padding: 14,
    borderRadius: 14,
    fontWeight: 600,
    textAlign: "center",
    color: "#1e3a8a",
    border: "1px solid #bfdbfe",
  },
  filters: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
  },
  select: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #93c5fd",
    background: "#eff6ff",
    color: "#1e3a8a",
    fontWeight: 600,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#eff6ff",
    borderRadius: 12,
    overflow: "hidden",
  },
  th: {
    padding: 12,
    textAlign: "left",
    background: "#bfdbfe",
    color: "#1e3a8a",
    borderBottom: "1px solid #93c5fd",
  },
  td: {
    padding: 10,
    color: "#1e40af",
    borderBottom: "1px solid #dbeafe",
  },
  tr: {
    background: "#eff6ff",
  },
  empty: {
    color: "#1e3a8a",
    fontWeight: 600,
  },
};
