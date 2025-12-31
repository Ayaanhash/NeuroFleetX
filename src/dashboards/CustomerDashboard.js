// src/dashboards/CustomerDashboard.js
import React, { useState } from "react";
import Profile from "../pages/Profile";

import LiveTracking from "./LiveTracking";
import RoutePlanner from "./RoutePlanner";
import RouteDashboard from "./RouteDashboard";
import Report from "./Report";

import "../styles/dashboard.css";

const CustomerDashboard = () => {
  const [activeView, setActiveView] = useState("liveTracking");

  const renderContent = () => {
    switch (activeView) {
      case "liveTracking":
        return <LiveTracking />;
      case "routePlanner":
        return <RoutePlanner />;
      case "routeDashboard":
        return <RouteDashboard />;
      case "report":
        return <Report />;
      case "profile":
        return <Profile onBack={() => setActiveView("liveTracking")} />;
      default:
        return <LiveTracking />;
    }
  };

  return (
    <div className="nf-dashboard-layout">
      {/* LEFT SIDEBAR */}
      <aside className="nf-dashboard-sidebar">
        <div className="nf-sidebar-header">
          <h3>Customer</h3>
          <span>DASHBOARD</span>
        </div>

        <nav className="nf-sidebar-menu">
          <button
            className={`nf-sidebar-item ${activeView === "liveTracking" ? "active" : ""}`}
            onClick={() => setActiveView("liveTracking")}
          >
            🗺️ Live Tracking
          </button>

          <button
            className={`nf-sidebar-item ${activeView === "routePlanner" ? "active" : ""}`}
            onClick={() => setActiveView("routePlanner")}
          >
            🛣️ Route Planner
          </button>

          <button
            className={`nf-sidebar-item ${activeView === "routeDashboard" ? "active" : ""}`}
            onClick={() => setActiveView("routeDashboard")}
          >
            📊 Route Dashboard
          </button>

          <button
            className={`nf-sidebar-item ${activeView === "report" ? "active" : ""}`}
            onClick={() => setActiveView("report")}
          >
            📄 Reports
          </button>

          <button
            className={`nf-sidebar-item ${activeView === "profile" ? "active" : ""}`}
            onClick={() => setActiveView("profile")}
          >
            👤 Profile
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="nf-dashboard-main">{renderContent()}</main>
    </div>
  );
};

export default CustomerDashboard;
