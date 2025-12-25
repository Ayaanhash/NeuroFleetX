import React, { useState, useEffect } from "react";

/* ===== Charts ===== */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

/* ===== Map ===== */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ===== Pages ===== */
import Profile from "../pages/Profile";

/* ===== Leaflet Marker Fix ===== */
const vehicleIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/* ===== Dummy Data ===== */
const initialVehicles = [
  {
    id: 1,
    name: "Truck 12",
    reg: "AP 01 AB 1234",
    status: "Available",
    city: "Hyderabad, IN",
    fuelLevel: 78,
    type: "Truck",
    lat: 17.385,
    lng: 78.4867,
    driver: {
      name: "Basha",
      email: "basha@example.com",
      phone: "+91 98765 43210",
      license: "DL-05-2021-123456",
    },
  },
  {
    id: 2,
    name: "EV Van 07",
    reg: "KA 02 CD 5678",
    status: "In Use",
    city: "Bengaluru, IN",
    fuelLevel: 45,
    type: "EV Van",
    lat: 12.9716,
    lng: 77.5946,
    driver: {
      name: "Ravi Kumar",
      email: "ravikumar@example.com",
      phone: "+91 91234 56789",
      license: "KA-08-2019-654321",
    },
  },
];

const revenueData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 21000 },
  { month: "Mar", revenue: 28000 },
  { month: "Apr", revenue: 36000 },
];

const distanceData = [
  { month: "Jan", distance: 12000 },
  { month: "Feb", distance: 25000 },
  { month: "Mar", distance: 42000 },
  { month: "Apr", distance: 75000 },
];

const FleetManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [vehicles, setVehicles] = useState(initialVehicles);

  /* ===== Simulate fuel usage ===== */
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => ({
          ...v,
          fuelLevel: Math.max(v.fuelLevel - (Math.random() * 3), 0),
        }))
      );
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  /* ===== RENDER SECTIONS ===== */

  const renderOverview = () => (
    <div className="fd-main-content">
      <h1 className="fd-page-title">Overview</h1>

      <div className="fd-chart-row">
        <div className="fd-chart-card">
          <p className="fd-chart-title">Monthly Revenue</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="fd-chart-card">
          <p className="fd-chart-title">Distance Covered</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={distanceData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="distance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="fd-main-content">
      <h1 className="fd-page-title">Live Vehicle Map</h1>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "420px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {vehicles.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={vehicleIcon}>
            <Popup>
              <strong>{v.name}</strong>
              <br />
              📍 {v.city}
              <br />
              Fuel: {Math.round(v.fuelLevel)}%
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );

  const renderProfile = () => (
    <div className="fd-main-content">
      <Profile />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "map":
        return renderMap();
      case "profile":
        return renderProfile();
      default:
        return renderOverview();
    }
  };

  /* ===== MAIN LAYOUT ===== */
  return (
    <div className="fd-wrapper">
      {/* Sidebar */}
      <aside className="fd-sidebar">
        <div className="fd-logo">
          <span className="fd-logo-icon">🚚</span>
          <div>
            <p className="fd-logo-title">Fleet Manager</p>
            <p className="fd-logo-subtitle">Dashboard</p>
          </div>
        </div>

        <nav className="fd-nav">
          <button
            className={`fd-nav-item ${
              activeTab === "overview" ? "fd-nav-item-active" : ""
            }`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>

          <button
            className={`fd-nav-item ${
              activeTab === "map" ? "fd-nav-item-active" : ""
            }`}
            onClick={() => setActiveTab("map")}
          >
            🗺️ Map
          </button>

          {/* ✅ MODULE 3 – FINAL FIX */}
          <button
            className="fd-nav-item"
            onClick={() => {
              window.location.href = "/#/module3";
            }}
          >
            🧠 Route Optimization
          </button>

          <button
            className={`fd-nav-item ${
              activeTab === "profile" ? "fd-nav-item-active" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="fd-main">{renderContent()}</main>
    </div>
  );
};

export default FleetManagerDashboard;
