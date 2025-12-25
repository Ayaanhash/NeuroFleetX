import React, { useState } from "react";

const Reports = () => {
  const [expanded, setExpanded] = useState(null);

 
  const routes = [
    {
      id: 1,
      route: "Vizag → Hyderabad",
      timeSaved: "22%",
      fuelSaved: "18%",
      loadEfficiency: "91%",
    },
    {
      id: 2,
      route: "Hyderabad → Chennai",
      timeSaved: "19%",
      fuelSaved: "15%",
      loadEfficiency: "88%",
    },
    {
      id: 3,
      route: "Bangalore → Vizag",
      timeSaved: "25%",
      fuelSaved: "21%",
      loadEfficiency: "93%",
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2>📊 History & Reports</h2>
          <p>AI-Based Performance Evaluation</p>
        </div>

       
        <div style={styles.metrics}>
          <MetricCard
            title="Time Saved"
            value="22%"
            color="#22c55e"
          />
          <MetricCard
            title="Fuel Saved"
            value="18%"
            color="#3b82f6"
          />
          <MetricCard
            title="Load Efficiency"
            value="91%"
            color="#a855f7"
          />
        </div>

        <div style={styles.routesBox}>
          <h3>🚚 Previous Routes</h3>

          {routes.map((r) => (
            <div
              key={r.id}
              style={styles.routeItem}
              onClick={() =>
                setExpanded(expanded === r.id ? null : r.id)
              }
            >
              <div style={styles.routeHeader}>
                <span>{r.route}</span>
                <span>{expanded === r.id ? "▲" : "▼"}</span>
              </div>

              {expanded === r.id && (
                <div style={styles.routeDetails}>
                  <p>⏱ Time Saved: <b>{r.timeSaved}</b></p>
                  <p>⛽ Fuel Saved: <b>{r.fuelSaved}</b></p>
                  <p>📦 Load Efficiency: <b>{r.loadEfficiency}</b></p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;


const MetricCard = ({ title, value, color }) => (
  <div style={styles.metricCard}>
    <p>{title}</p>
    <h2>{value}</h2>
    <div style={styles.progressBar}>
      <div
        style={{
          ...styles.progressFill,
          width: value,
          background: color,
        }}
      />
    </div>
  </div>
);

/* ===== STYLES ===== */
const styles = {
  page: {
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
    minHeight: "100vh",
    padding: 30,
  },

  container: {
    maxWidth: 900,
    margin: "auto",
    color: "#0f172a",
  },

  header: {
    background: "linear-gradient(135deg,#5f7cff,#6a5acd)",
    color: "#fff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 30,
  },

  metrics: {
    display: "flex",
    gap: 20,
    marginBottom: 30,
  },

  metricCard: {
    flex: 1,
    background: "#ffffff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },

  progressBar: {
    height: 8,
    background: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    borderRadius: 6,
  },

  routesBox: {
    background: "#ffffff",
    padding: 24,
    borderRadius: 16,
    boxShadow: "0 10px 24px rgba(0,0,0,0.08)",
  },

  routeItem: {
    background: "#eef2ff",
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
    cursor: "pointer",
  },

  routeHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: 600,
  },

  routeDetails: {
    marginTop: 10,
    fontSize: 14,
  },
};
