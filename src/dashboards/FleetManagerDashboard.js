// src/dashboards/FleetManagerDashboard.js
import React, { useState, useEffect } from "react";
import RouteOptimization from "./RouteDashboard";
import RoutePlanner from "./RoutePlanner";
import LoadOptimization from "./LoadOptimization";
import LiveTracking from "./LiveTracking";
import HistoryReports from "./HistoryReports";

// Charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

// Map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Your existing profile page
import Profile from "../pages/Profile";

// ===== Leaflet Marker Icon Fix =====
const vehicleIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

//===== Dummy Data (includes driver info) =====
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
  {
    id: 3,
    name: "Car 23",
    reg: "MH 03 EF 9101",
    status: "Needs Service",
    city: "Mumbai, IN",
    fuelLevel: 21,
    type: "Car",
    lat: 19.076,
    lng: 72.8777,
    driver: {
      name: "Suresh Patil",
      email: "suresh.patil@example.com",
      phone: "+91 99876 54321",
      license: "MH-12-2020-987654",
    },
  },
  {
    id: 4,
    name: "Truck 05",
    reg: "DL 04 GH 2345",
    status: "Available",
    city: "Delhi, IN",
    fuelLevel: 62,
    type: "Truck",
    lat: 28.6139,
    lng: 77.209,
    driver: {
      name: "Shankar",
      email: "sankar@example.com",
      phone: "+91 90123 45678",
      license: "DL-02-2018-112233",
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

  // Modal state for Add Vehicle (center modal)
  const [showAddModal, setShowAddModal] = useState(false);

  // For settings → add new vehicle (used by modal)
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    reg: "",
    status: "Available",
    city: "",
    fuelLevel: 50,
    type: "Truck",
    lat: 20.5937,
    lng: 78.9629,
    driver: { name: "", email: "", phone: "", license: "" },
  });

  // Modal state for showing driver details
  const [driverModal, setDriverModal] = useState({
    open: false,
    driver: null,
  });

  // Manage vehicles mode toggles inline manage UI on Vehicles page
  const [manageMode, setManageMode] = useState(false);

  // Track which vehicle is being edited in manage mode
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [editingVehicleData, setEditingVehicleData] = useState(null);

  // Simple totals (could be dynamic later)
  const totalRevenue = 35000;
  const totalDistance = 85000;
  const vehiclesDriven = 120;

  // Simulate movement for the map markers (optional safe simulation)
useEffect(() => {
  const interval = setInterval(() => {
    setVehicles(prev =>
      prev.map(v => {
        const fuelDrop = Math.floor(Math.random() * 3) + 1;
        const newFuel = Math.max(v.fuelLevel - fuelDrop, 0);

        let newStatus = v.status;
        if (newFuel <= 20) newStatus = "Needs Service";

        return {
          ...v,
          fuelLevel: newFuel,
          status: newStatus,
        };
      })
    );
  }, 7000); // ✅ 7 seconds

  return () => clearInterval(interval);
}, []);



  // ===== Add / Delete logic =====
  const handleNewVehicleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("driver.")) {
      const key = name.split(".")[1];
      setNewVehicle((prev) => ({
        ...prev,
        driver: { ...prev.driver, [key]: value },
      }));
      return;
    }

    setNewVehicle((prev) => ({
      ...prev,
      [name]:
        name === "fuelLevel" || name === "lat" || name === "lng"
          ? Number(value)
          : value,
    }));
  };

  const handleAddVehicle = (e) => {
    e && e.preventDefault && e.preventDefault();

    if (!newVehicle.name || !newVehicle.reg || !newVehicle.city) {
      // minimal validation
      return;
    }

    const vehicleToAdd = {
      ...newVehicle,
      id: Date.now(),
    };

    setVehicles((prev) => [...prev, vehicleToAdd]);

    setNewVehicle({
      name: "",
      reg: "",
      status: "Available",
      city: "",
      fuelLevel: 50,
      type: "Truck",
      lat: 20.5937,
      lng: 78.9629,
      driver: { name: "", email: "", phone: "", license: "" },
    });

    setShowAddModal(false);
    setActiveTab("vehicles");
  };

  const handleDeleteVehicle = (id) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // Driver modal handlers
  const openDriverModal = (driver) => {
    setDriverModal({ open: true, driver });
  };
  const closeDriverModal = () => {
    setDriverModal({ open: false, driver: null });
  };

  // Manage mode handlers
  const startManageMode = () => {
    setManageMode(true);
    setEditingVehicleId(null);
    setEditingVehicleData(null);
  };
  const stopManageMode = () => {
    setManageMode(false);
    setEditingVehicleId(null);
    setEditingVehicleData(null);
  };

  const startEditVehicle = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setEditingVehicleData({
      name: vehicle.name,
      reg: vehicle.reg,
      city: vehicle.city,
      status: vehicle.status,
      fuelLevel: vehicle.fuelLevel,
      type: vehicle.type,
      driver: { ...(vehicle.driver || {}) },
    });
  };

  const cancelEdit = () => {
    setEditingVehicleId(null);
    setEditingVehicleData(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("driver.")) {
      const key = name.split(".")[1];
      setEditingVehicleData((prev) => ({
        ...prev,
        driver: { ...prev.driver, [key]: value },
      }));
      return;
    }
    setEditingVehicleData((prev) => ({
      ...prev,
      [name]:
        name === "fuelLevel"
          ? Number(value)
          : value,
    }));
  };

  const submitEdit = (id) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...editingVehicleData } : v))
    );
    setEditingVehicleId(null);
    setEditingVehicleData(null);
  };

  // ===== RENDER SECTIONS =====

  const renderOverview = () => (
    <div className="fd-main-content">
      <h1 className="fd-page-title">Overview</h1>

      <div className="fd-summary-row">
        <div className="fd-summary-card">
          <p className="fd-summary-label">Revenue</p>
          <p className="fd-summary-value">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="fd-summary-sub">This month</p>
        </div>

        <div className="fd-summary-card">
          <p className="fd-summary-label">Distance Driven</p>
          <p className="fd-summary-value">
            {totalDistance.toLocaleString("en-IN")} km
          </p>
          <p className="fd-summary-sub">Total coverage</p>
        </div>

        <div className="fd-summary-card">
          <p className="fd-summary-label">Vehicles Driven</p>
          <p className="fd-summary-value">{vehiclesDriven}</p>
          <p className="fd-summary-sub">This month</p>
        </div>
      </div>

      <div className="fd-chart-row">
        <div className="fd-chart-card">
          <p className="fd-chart-title">Monthly Revenue</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="distance" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderVehicles = () => (
    <div className="fd-main-content">
      <h1 className="fd-page-title" style={{ alignItems: "center", display: "flex" }}>
        Vehicles
        {/* small Add button top-right of title (optional) */}
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={() => setShowAddModal(true)}
            className="fd-primary-btn"
            style={{ padding: "6px 10px" }}
          >
            + Add Vehicle
          </button>
        </div>
      </h1>

      <div className="fd-vehicle-grid">
        {vehicles.map((v) => (
          <div key={v.id} className="fd-vehicle-card">
            <div className="fd-vehicle-header">
              <div>
                <p className="fd-vehicle-name">{v.name}</p>
                <p className="fd-vehicle-reg">{v.reg}</p>
              </div>
              <span
                className={`fd-status-chip fd-status-${v.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {v.status}
              </span>
            </div>

            <p className="fd-vehicle-city">📍 {v.city}</p>

            <div className="fd-fuel-row">
              <span className="fd-fuel-label">Fuel / Battery</span>
              <span className="fd-fuel-value">{v.fuelLevel}%</span>
            </div>
            <div className="fd-fuel-bar">
              <div
                className="fd-fuel-bar-fill"
                style={{ width: `${v.fuelLevel}%` }}
              />
            </div>

            <p className="fd-vehicle-type">Type: {v.type}</p>

            {/* DRIVER SUMMARY: clickable name opens modal */}
            <div style={{ marginTop: 8 }}>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>Driver: </span>
              <button
                onClick={() => openDriverModal(v.driver)}
                className="fd-nav-item"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid rgba(55,65,81,0.6)",
                  color: "var(--fd-text)",
                  cursor: "pointer",
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                <span style={{ fontSize: 14 }}>👨‍✈️</span>
                <span style={{ textTransform: "none" }}>{v.driver.name}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom centered action buttons: Add Vehicles | Manage Vehicles */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          marginTop: 18,
        }}
      >
        <button
          onClick={() => setShowAddModal(true)}
          className="fd-primary-btn"
          style={{ padding: "8px 14px" }}
        >
          + Add Vehicles
        </button>

        <button
          onClick={() => (manageMode ? stopManageMode() : startManageMode())}
          className="fd-primary-btn"
          style={{
            padding: "8px 14px",
            background:
              "linear-gradient(circle at top left, #1e40af 0, #3b82f6 60%)", // blue color for manage
          }}
        >
          Manage Vehicles
        </button>
      </div>

      {/* Inline Manage Vehicles UI (shows when manageMode true) */}
      {manageMode && (
        <div style={{ marginTop: 18 }}>
          <div className="fd-settings-card" style={{ padding: 12 }}>
            <h3 style={{ marginTop: 0 }}>Manage Vehicles</h3>

            {vehicles.length === 0 && (
              <p className="fd-placeholder-text">No vehicles to manage.</p>
            )}

            {vehicles.map((v) => (
              <div
                key={`manage-${v.id}`}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{v.name} – {v.reg}</div>
                      <div style={{ fontSize: 12, color: "var(--fd-text-muted)" }}>
                        {v.type} • {v.city} • {v.status} • {v.fuelLevel}%
                      </div>
                    </div>

                    {/* Update / Cancel show per-vehicle when editing, else Manage button */}
                    <div style={{ display: "flex", gap: 8 }}>
                      {editingVehicleId === v.id ? (
                        <>
                          <button
                            onClick={() => submitEdit(v.id)}
                            className="fd-primary-btn"
                            style={{ padding: "6px 10px" }}
                          >
                            Update
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="fd-delete-btn"
                            style={{ padding: "6px 10px" }}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEditVehicle(v)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: "none",
                            background: "linear-gradient(90deg,#3b82f6,#1d4ed8)",
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          Update
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteVehicle(v.id)}
                        className="fd-delete-btn"
                        style={{ padding: "6px 10px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* If this vehicle is being edited, show inline edit fields */}
                  {editingVehicleId === v.id && editingVehicleData && (
                    <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input
                          name="name"
                          value={editingVehicleData.name}
                          onChange={handleEditChange}
                          placeholder="Vehicle name"
                        />
                        <input
                          name="reg"
                          value={editingVehicleData.reg}
                          onChange={handleEditChange}
                          placeholder="Registration"
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input
                          name="city"
                          value={editingVehicleData.city}
                          onChange={handleEditChange}
                          placeholder="City"
                        />
                        <select
                          name="status"
                          value={editingVehicleData.status}
                          onChange={handleEditChange}
                        >
                          <option>Available</option>
                          <option>In Use</option>
                          <option>Needs Service</option>
                        </select>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input
                          name="fuelLevel"
                          type="number"
                          min={0}
                          max={100}
                          value={editingVehicleData.fuelLevel}
                          onChange={handleEditChange}
                          placeholder="Fuel %"
                        />
                        <input
                          name="type"
                          value={editingVehicleData.type}
                          onChange={handleEditChange}
                          placeholder="Type"
                        />
                      </div>

                      {/* driver inline edits */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input
                          name="driver.name"
                          value={editingVehicleData.driver?.name || ""}
                          onChange={handleEditChange}
                          placeholder="Driver name"
                        />
                        <input
                          name="driver.email"
                          value={editingVehicleData.driver?.email || ""}
                          onChange={handleEditChange}
                          placeholder="Driver email"
                        />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <input
                          name="driver.phone"
                          value={editingVehicleData.driver?.phone || ""}
                          onChange={handleEditChange}
                          placeholder="Driver phone"
                        />
                        <input
                          name="driver.license"
                          value={editingVehicleData.driver?.license || ""}
                          onChange={handleEditChange}
                          placeholder="License"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={stopManageMode} className="fd-delete-btn" style={{ padding: "6px 10px" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderMap = () => {
    const center = [20.5937, 78.9629]; // India center

    return (
      <div className="fd-main-content">
        <h1 className="fd-page-title">Live Map</h1>

        <div className="fleet-map">
          <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {vehicles.map((v) => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={vehicleIcon}>
                <Popup>
                  <strong>{v.name}</strong> ({v.type})
                  <br />
                  📍 {v.city}
                  <br />
                  Status: {v.status}
                  <br />
                  Fuel: {v.fuelLevel}%
                  <br />
                  Driver: {v.driver?.name}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    );
  };
// ===== MODULE 3 RENDER FUNCTIONS =====

const renderRoutePlanning = () => (
  <div className="fd-main-content">
    <RoutePlanner />
  </div>
);


const renderLoadOptimization = () => (
  <div className="fd-main-content">
    <LoadOptimization />
  </div>
);

const renderLiveTracking = () => (
  <div className="fd-main-content">
    <LiveTracking vehicles={vehicles} />
  </div>
);


const renderHistoryReports = () => (
  <div className="fd-main-content">
    <HistoryReports />
  </div>
);


  const renderProfile = () => (
    <div className="fd-main-content">
      <Profile />
    </div>
  );

  // Settings no longer contains add form; it can keep other settings (simple placeholder)
  const renderSettings = () => (
    <div className="fd-main-content">
      <h1 className="fd-page-title">Settings</h1>

      <div className="fd-settings-layout">
        <div className="fd-settings-card">
          <h2 className="fd-settings-title">General</h2>
          <p className="fd-placeholder-text">Theme, notifications and account settings go here.</p>
        </div>

        <div className="fd-settings-card">
          <h2 className="fd-settings-title">Vehicle Management</h2>
          <p className="fd-placeholder-text">To add vehicles, use the Vehicles tab "Add Vehicles" button.</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
  switch (activeTab) {
    case "overview":
      return renderOverview();
    case "vehicles":
      return renderVehicles();
    case "map":
      return renderMap();
    case "route-planning":
      return renderRoutePlanning();
    case "load":
      return renderLoadOptimization();
    case "tracking":
      return renderLiveTracking();
    case "history":
      return renderHistoryReports();
    case "profile":
      return renderProfile();
    case "settings":
      return renderSettings();
    default:
      return renderOverview();
  }
};


  // ===== MAIN LAYOUT =====
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
            className={`fd-nav-item ${activeTab === "overview" ? "fd-nav-item-active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <span className="fd-nav-icon">📊</span>
            <span>Overview</span>
          </button>

          <button
            className={`fd-nav-item ${activeTab === "vehicles" ? "fd-nav-item-active" : ""}`}
            onClick={() => setActiveTab("vehicles")}
          >
            <span className="fd-nav-icon">🚗</span>
            <span>Vehicles</span>
          </button>

          <button
            className={`fd-nav-item ${activeTab === "map" ? "fd-nav-item-active" : ""}`}
            onClick={() => setActiveTab("map")}
          >
            <span className="fd-nav-icon">🗺️</span>
            <span>Map</span>
          </button>
          <button
  className={`fd-nav-item ${activeTab === "route-planning" ? "fd-nav-item-active" : ""}`}
  onClick={() => setActiveTab("route-planning")}
>
  <span className="fd-nav-icon">🧭</span>
  <span>Route Planning</span>
</button>
<button
  className={`fd-nav-item ${activeTab === "load" ? "fd-nav-item-active" : ""}`}
  onClick={() => setActiveTab("load")}
>
  <span className="fd-nav-icon">📦</span>
  <span>Load Optimization</span>
</button>

<button
  className={`fd-nav-item ${activeTab === "tracking" ? "fd-nav-item-active" : ""}`}
  onClick={() => setActiveTab("tracking")}
>
  <span className="fd-nav-icon">🚚</span>
  <span>Live Tracking</span>
</button>


<button
  className={`fd-nav-item ${activeTab === "history" ? "fd-nav-item-active" : ""}`}
  onClick={() => setActiveTab("history")}
>
  <span className="fd-nav-icon">📜</span>
  <span>History Reports</span>
</button>


          <button
            className={`fd-nav-item ${activeTab === "profile" ? "fd-nav-item-active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <span className="fd-nav-icon">👤</span>
            <span>Profile</span>
          </button>

          <button
            className={`fd-nav-item ${activeTab === "settings" ? "fd-nav-item-active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <span className="fd-nav-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="fd-main">{renderContent()}</main>

      {/* ===== Add Vehicle Centered Modal ===== */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 760,
              maxWidth: "94%",
              borderRadius: 12,
              padding: 18,
              background: "#071127",
              border: "1px solid rgba(55,65,81,0.9)",
              boxShadow: "0 18px 50px rgba(2,6,23,0.9)",
              color: "var(--fd-text)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>Add Vehicle</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--fd-text-muted)", cursor: "pointer", fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVehicle} style={{ marginTop: 12, display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input name="name" value={newVehicle.name} onChange={handleNewVehicleChange} placeholder="Vehicle name" />
                <input name="reg" value={newVehicle.reg} onChange={handleNewVehicleChange} placeholder="Registration number" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <input name="city" value={newVehicle.city} onChange={handleNewVehicleChange} placeholder="City" />
                <select name="status" value={newVehicle.status} onChange={handleNewVehicleChange}>
                  <option>Available</option>
                  <option>In Use</option>
                  <option>Needs Service</option>
                </select>
                <select name="type" value={newVehicle.type} onChange={handleNewVehicleChange}>
                  <option>Truck</option>
                  <option>EV Van</option>
                  <option>Car</option>
                  <option>Bike</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input name="fuelLevel" type="number" min={0} max={100} value={newVehicle.fuelLevel} onChange={handleNewVehicleChange} placeholder="Fuel / Battery %" />
                <input name="lat" type="number" value={newVehicle.lat} onChange={handleNewVehicleChange} placeholder="Latitude (optional)" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input name="lng" type="number" value={newVehicle.lng} onChange={handleNewVehicleChange} placeholder="Longitude (optional)" />
                <input name="driver.name" value={newVehicle.driver.name} onChange={handleNewVehicleChange} placeholder="Driver name" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <input name="driver.email" value={newVehicle.driver.email} onChange={handleNewVehicleChange} placeholder="Driver email" />
                <input name="driver.phone" value={newVehicle.driver.phone} onChange={handleNewVehicleChange} placeholder="Driver phone" />
                <input name="driver.license" value={newVehicle.driver.license} onChange={handleNewVehicleChange} placeholder="License" />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 6 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="fd-delete-btn" style={{ padding: "8px 12px" }}>
                  Cancel
                </button>
                <button type="submit" className="fd-primary-btn" style={{ padding: "8px 12px" }}>
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== DRIVER MODAL (simple) ===== */}
      {driverModal.open && driverModal.driver && (
        <div
          onClick={closeDriverModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(2,6,23,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 360,
              borderRadius: 12,
              padding: 18,
              background: "#071127",
              border: "1px solid rgba(55,65,81,0.9)",
              boxShadow: "0 18px 50px rgba(2,6,23,0.9)",
              color: "var(--fd-text)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h3 style={{ margin: 0 }}>{driverModal.driver.name}</h3>
              <button
                onClick={closeDriverModal}
                style={{ background: "transparent", border: "none", color: "var(--fd-text-muted)", cursor: "pointer", fontSize: 18 }}
                aria-label="Close driver details"
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop: 12, fontSize: 14, color: "var(--fd-text-muted)" }}>
              <p style={{ margin: "8px 0" }}>
                <strong>Email:</strong> {driverModal.driver.email || "—"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Phone:</strong> {driverModal.driver.phone || "—"}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>License:</strong> {driverModal.driver.license || "—"}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
              <button onClick={closeDriverModal} className="fd-primary-btn" style={{ padding: "6px 12px" }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagerDashboard;
