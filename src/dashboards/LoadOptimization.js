import React from "react";

const LoadOptimization = () => {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];

  /* ===== VEHICLE LOAD CALCULATION ===== */
  const vehicleLoad = {
    V01: trips.filter((t) => t.driver === "Ravi Kumar").length,
    V02: Math.floor(trips.length / 2),
    V03: trips.length,
  };

  const getStatus = (count) => {
    if (count <= 3)
      return { text: "Low Load", color: "#22c55e", percent: 30 };
    if (count <= 6)
      return { text: "Medium Load", color: "#f97316", percent: 65 };
    return { text: "High Load", color: "#dc2626", percent: 90 };
  };

  /* ===== AI RECOMMENDATION ===== */
  const leastLoadedVehicle = Object.keys(vehicleLoad).reduce((a, b) =>
    vehicleLoad[a] < vehicleLoad[b] ? a : b
  );

  const totalTrips = trips.length;
  const avgLoad =
    totalTrips === 0
      ? 0
      : Math.round(
          Object.values(vehicleLoad).reduce((a, b) => a + b, 0) /
            Object.keys(vehicleLoad).length
        );

  const overloadedCount = Object.values(vehicleLoad).filter(
    (v) => v > 6
  ).length;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Load Optimization</h2>

      {/* ===== SUMMARY ===== */}
      <div style={styles.summary}>
        <div style={styles.summaryCard}>Total Trips: {totalTrips}</div>
        <div style={styles.summaryCard}>Avg Load: {avgLoad}</div>
        <div style={styles.summaryCard}>
          Overloaded Vehicles: {overloadedCount}
        </div>
      </div>

      {/* ===== VEHICLE LOAD CARDS ===== */}
      {Object.entries(vehicleLoad).map(([v, count]) => {
        const status = getStatus(count);
        return (
          <div key={v} style={styles.card}>
            <div style={styles.cardHeader}>
              <h4 style={styles.vehicle}>{v}</h4>
              <span style={{ color: status.color, fontWeight: 700 }}>
                {status.text}
              </span>
            </div>

            <p style={styles.text}>Active Trips: {count}</p>

            {/* LOAD BAR */}
            <div style={styles.progressBg}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${status.percent}%`,
                  background: status.color,
                }}
              />
            </div>
          </div>
        );
      })}

      {/* ===== AI SUGGESTION ===== */}
      <div style={styles.tip}>
        🤖 AI Suggestion: Assign next trip to{" "}
        <strong>{leastLoadedVehicle}</strong> to balance fleet load.
      </div>
    </div>
  );
};

export default LoadOptimization;

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
  summary: {
    display: "flex",
    gap: 16,
    marginBottom: 18,
  },
  summaryCard: {
    flex: 1,
    background: "#dbeafe",
    padding: 14,
    borderRadius: 14,
    textAlign: "center",
    fontWeight: 600,
    color: "#1e3a8a",
    border: "1px solid #bfdbfe",
  },
  card: {
    background: "#eff6ff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    border: "1px solid #bfdbfe",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicle: {
    color: "#1e40af",
    margin: 0,
  },
  text: {
    color: "#1e3a8a",
    fontWeight: 600,
    marginTop: 6,
  },
  progressBg: {
    height: 10,
    background: "#bfdbfe",
    borderRadius: 999,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  tip: {
    marginTop: 18,
    padding: 16,
    background: "#dbeafe",
    borderRadius: 14,
    color: "#1e3a8a",
    fontWeight: 600,
    border: "1px solid #bfdbfe",
  },
};
