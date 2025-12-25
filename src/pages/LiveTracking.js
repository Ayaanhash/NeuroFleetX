import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LiveTracking = () => {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(60); // minutes (dummy)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p < 100) {
          setEta((e) => (e > 5 ? e - 5 : e));
          return p + 10;
        }
        return p;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>
     
      <div style={styles.header}>
        <h2>🚗 Live Vehicle Tracking</h2>
        <p>Real-time route progress & load monitoring</p>
      </div>

    
      <div style={styles.stats}>
        <div style={styles.statCard}>
          <p>Status</p>
          <b>{progress < 100 ? "En Route" : "Reached Destination"}</b>
        </div>

        <div style={styles.statCard}>
          <p>Remaining ETA</p>
          <b>{progress < 100 ? `${eta} mins` : "0 mins"}</b>
        </div>

        <div style={styles.statCard}>
          <p>Load Status</p>
          <b style={{ color: "#22c55e" }}>Optimal</b>
        </div>
      </div>

      
      <div style={styles.card}>
        <p>📍 Route Progress</p>

        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </div>

        <p style={{ marginTop: 8 }}>{progress}% completed</p>

     
        <div style={{ marginTop: 15 }}>
          <p>📦 Load Utilization</p>
          <progress value="82" max="100" style={{ width: "100%" }} />
          <p>Status: <b>Optimal</b></p>
        </div>
      </div>


      <button style={styles.btn} onClick={() => navigate("/module3")}>
        ⬅ Back to Route Dashboard
      </button>
    </div>
  );
};

export default LiveTracking;


const styles = {
  page: {
    background: "#0b1220",
    color: "#fff",
    minHeight: "100vh",
    padding: 30,
  },

  header: {
    background: "linear-gradient(135deg,#5f7cff,#6a5acd)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  stats: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },

  statCard: {
    flex: 1,
    background: "#111827",
    padding: 16,
    borderRadius: 12,
    textAlign: "center",
  },

  card: {
    background: "#111827",
    padding: 20,
    borderRadius: 12,
    maxWidth: 600,
  },

  progressBar: {
    height: 20,
    background: "#1e293b",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
    transition: "width 1s",
  },

  btn: {
    marginTop: 20,
    padding: 12,
    background: "#2563eb",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },
};
