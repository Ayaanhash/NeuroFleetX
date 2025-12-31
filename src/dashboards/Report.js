import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

export default function RouteDashboard() {
  const navigate = useNavigate();

  return (
    <>
      
      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
          background: radial-gradient(circle at top, #1e3a8a, #020617);
        }

        .rd-page {
          min-height: 100vh;
          padding: 40px 20px;
          color: white;
        }

        /* HERO */
        .rd-hero {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.35);
        }

        .rd-hero h1 {
          margin: 0 0 8px;
          font-size: 28px;
        }

        .rd-hero p {
          margin: 0;
          opacity: 0.9;
        }

        .rd-hero-actions {
          margin-top: 18px;
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        /* BUTTONS */
        .btn-primary {
          background: #22c55e;
          border: none;
          padding: 12px 26px;
          border-radius: 999px;
          color: #022c22;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .btn-primary:hover {
          transform: scale(1.05);
        }

        .btn-secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.6);
          padding: 12px 26px;
          border-radius: 999px;
          color: white;
          cursor: pointer;
        }

        /* STATS */
        .rd-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 30px;
        }

        .rd-stat-card {
          background: rgba(255,255,255,0.08);
          padding: 24px;
          border-radius: 18px;
          text-align: center;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,0.12),
            0 15px 30px rgba(0,0,0,0.3);
        }

        .rd-stat-card h2 {
          margin-top: 10px;
          font-size: 26px;
        }

        .heavy {
          color: #ef4444;
        }

        /* MAP */
        .rd-map-section {
          margin-top: 36px;
        }

        .rd-map-box {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0,0,0,0.45);
        }

        .leaflet-container {
          width: 100%;
          height: 300px;
          border-radius: 20px;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .rd-stats {
            grid-template-columns: 1fr;
          }

          .rd-hero h1 {
            font-size: 22px;
          }
        }
      `}</style>

      <div className="rd-page">

      
        <div className="rd-hero">
          <h1>🚦 Route Optimization Dashboard</h1>
          <p>
            AI-powered route planning, traffic awareness, and performance insights
          </p>

          <div className="rd-hero-actions">
           
            <button
              className="btn-primary"
              onClick={() => navigate("/plan")}
            >
              Plan New Route
            </button>

            
            <button
              className="btn-secondary"
              onClick={() => navigate("/reports")}
            >
              View Reports
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="rd-stats">
          <div className="rd-stat-card">
            🚚 Active Vehicles
            <h2>12</h2>
          </div>

          <div className="rd-stat-card">
            ⏱ Avg ETA
            <h2>38 min</h2>
          </div>

          <div className="rd-stat-card">
            🚦 Traffic Status
            <h2 className="heavy">Heavy</h2>
          </div>
        </div>

       
        <div className="rd-map-section">
          <h3>🗺 Live Route Preview</h3>

          <div className="rd-map-box">
            <MapContainer center={[20.5937, 78.9629]} zoom={5}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
            </MapContainer>
          </div>
        </div>

      </div>
    </>
  );
}