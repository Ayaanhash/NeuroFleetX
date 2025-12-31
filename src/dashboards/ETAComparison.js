import React from "react";

const ETAComparison = () => {
  const trips = JSON.parse(localStorage.getItem("trips")) || [];

  if (trips.length === 0) {
    return (
      <div style={styles.container}>
        <h2>⏱ ETA Comparison</h2>
        <p>No trips available for comparison.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2>⏱ ETA Comparison</h2>

      {trips.map((t) => {
        const eta = parseInt(t.eta);
        const cost = parseInt(t.cost?.replace("₹", "") || 0);

        const fastest = eta <= 30;
        const cheapest = cost <= 3000;

        return (
          <div key={t.id} style={styles.card}>
            <h4>
              {t.source} → {t.destination}
            </h4>

            <div style={styles.row}>
              <span>Route Type:</span>
              <strong>{t.routeType.toUpperCase()}</strong>
            </div>

            <div style={styles.row}>
              <span>ETA:</span>
              <strong>{t.eta}</strong>
            </div>

            <div style={styles.row}>
              <span>Distance:</span>
              <strong>{t.distance}</strong>
            </div>

            <div style={styles.row}>
              <span>Cost:</span>
              <strong>{t.cost}</strong>
            </div>

            {/* ===== AI INSIGHTS ===== */}
            <div style={styles.tags}>
              {fastest && (
                <span style={{ ...styles.tag, background: "#dcfce7" }}>
                  🟢 Fastest Route
                </span>
              )}
              {cheapest && (
                <span style={{ ...styles.tag, background: "#fff7ed" }}>
                  💰 Cheapest Route
                </span>
              )}
            </div>
          </div>
        );
      })}

      <div style={styles.insight}>
        🤖 AI Insight: Routes are ranked based on ETA and cost to recommend
        optimal travel options.
      </div>
    </div>
  );
};

export default ETAComparison;

/* ===== STYLES ===== */
const styles = {
  container: {
    background: "#0f172a",
    padding: 24,
    borderRadius: 16,
    color: "#e5e7eb",
  },
  card: {
    background: "#111827cc",
    padding: 18,
    borderRadius: 14,
    marginBottom: 16,
    border: "1px solid #1f2937",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5f5",
    marginBottom: 6,
  },
  tag: {
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: "#020617",
  },
  insight: {
    marginTop: 20,
    padding: 16,
    background: "#020617",
    borderRadius: 14,
    border: "1px solid #1f2937",
  },
};
