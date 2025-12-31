import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

/* ===== LEAFLET ICON FIX ===== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== ROUTE DRAWER ===== */
const LeafletRoute = ({ waypoints, color, opacity = 1, onFound }) => {

  const map = useMap();
  const ref = useRef(null);

  useEffect(() => {
    if (!map || !waypoints || waypoints.length < 2) return;

    const control = L.Routing.control({
      waypoints: waypoints.map(p => L.latLng(p[0], p[1])),
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null,
   lineOptions: {
  styles: [{ color, weight: 5, opacity }],
},

      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
    }).on("routesfound", e => {
      const r = e.routes[0];
      onFound(
        r.summary.totalDistance / 1000,
        r.summary.totalTime / 60
      );
    });

    control.addTo(map);
    ref.current = control;

    return () => {
      try {
        map.removeControl(control);
      } catch {}
    };
  }, [map, waypoints, color]);

  return null;
};

/* ================= MAIN ================= */

const RoutePlanner = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState("Car");

  const [stopInput, setStopInput] = useState("");
  const [stops, setStops] = useState([]);

  const [routes, setRoutes] = useState(null);
  const [routeInfo, setRouteInfo] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [finalRoute, setFinalRoute] = useState(null);

  const [message, setMessage] = useState("");

  /* ===== GEOCODING ===== */
  const getCoords = async (place) => {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const d = await r.json();
    if (!d || !d[0]) return null;
    return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
  };

  /* ===== ADD STOP ===== */
  const addStop = () => {
    if (stopInput.trim()) {
      setStops([...stops, stopInput.trim()]);
      setStopInput("");
    }
  };

  /* ===== GENERATE ROUTES ===== */
  const generateRoutes = async () => {
    setMessage("");
    const src = await getCoords(source);
    const dst = await getCoords(destination);
    if (!src || !dst) return;

    const stopCoords = [];
    for (let s of stops) {
      const c = await getCoords(s);
      if (c) stopCoords.push(c);
    }

    const path = [src, ...stopCoords, dst];

    setRoutes({
      shortest: { path, color: "#2563eb" },
      traffic: { path, color: "#f97316" },
      eco: { path, color: "#22c55e" },
    });

    setRouteInfo({});
    setSelectedRoute(null);
    setFinalRoute(null);
  };

  /* ===== COST LOGIC ===== */
  const ratePerKm =
    vehicle === "Truck" ? 12 :
    vehicle === "Bike" ? 5 : 8;

  /* ===== PLAN TRIP ===== */
  const planTrip = () => {
    if (!selectedRoute) return;
    setFinalRoute(routes[selectedRoute]);
    setMessage("✅ Trip planned and assigned to driver Ravi Kumar");
  };

  return (
    <div style={styles.page}>
      {/* ===== SIDEBAR ===== */}
      <div style={styles.sidebar}>
        <h2 style={styles.title}>Route Planner</h2>

        <label>Source</label>
        <input style={styles.input} onChange={e => setSource(e.target.value)} />

        <label>Destination</label>
        <input style={styles.input} onChange={e => setDestination(e.target.value)} />

        <label>Stop (Optional)</label>
        <input
          style={styles.input}
          value={stopInput}
          onChange={e => setStopInput(e.target.value)}
        />
        <button style={styles.secondaryBtn} onClick={addStop}>
          Add Stop
        </button>

        {stops.map((s, i) => (
          <div key={i} style={styles.stop}>🚏 {s}</div>
        ))}

        <label>Vehicle</label>
        <select style={styles.input} onChange={e => setVehicle(e.target.value)}>
          <option>Car</option>
          <option>Bike</option>
          <option>Truck</option>
        </select>

        <button style={styles.primaryBtn} onClick={generateRoutes}>
          Generate Routes
        </button>

        {/* ===== ETA CARDS ===== */}
        {routes && (
          <div style={{ marginTop: 14 }}>
            {Object.keys(routes).map(k => {
              const info = routeInfo[k];
              const distance = info?.distance || 0;
              const time = Math.round(info?.time || 0);
              const cost = Math.round(distance * ratePerKm);

              return (
                <div key={k} style={styles.etaCard}>
                  <input
                    type="radio"
                    name="route"
                    checked={selectedRoute === k}
                    onChange={() => setSelectedRoute(k)}
                  />{" "}
                  <span style={{ fontWeight: 700 }}>
                    {k === "shortest" && "🔵 Shortest"}
                    {k === "traffic" && "🟠 Traffic Aware"}
                    {k === "eco" && "🟢 Eco Friendly"}
                  </span>
                  <div>Distance: {distance.toFixed(1)} km</div>
                  <div>Time: {time} mins</div>
                  <div>Cost: ₹{cost}</div>
                </div>
              );
            })}

            <button style={styles.planBtn} onClick={planTrip}>
              Plan Trip
            </button>
          </div>
        )}

        {message && <div style={styles.success}>{message}</div>}
      </div>

      {/* ===== MAP ===== */}
      <div style={styles.mapBox}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

         {routes && !finalRoute &&
  Object.entries(routes).map(([k, r]) => (
    <LeafletRoute
      key={k}
      waypoints={r.path}
      color={r.color}
      opacity={
        !selectedRoute || selectedRoute === k ? 1 : 0.25
      }
      onFound={(d, t) =>
        setRouteInfo(prev => ({
          ...prev,
          [k]: { distance: d, time: t },
        }))
      }
    />
))}


          {finalRoute && (
            <LeafletRoute
              waypoints={finalRoute.path}
              color={finalRoute.color}
              onFound={() => {}}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RoutePlanner;

/* ===== STYLES ===== */
const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    height: "100vh",
    background: "#f1f5f9",
    fontFamily: "Segoe UI, sans-serif",
  },

  /* ===== SIDEBAR ===== */
  sidebar: {
    padding: 24,
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    overflowY: "auto",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#1e3a8a",
    marginBottom: 16,
  },



input: {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  fontSize: 14,
  color: "#000000",                 // typed text
  backgroundColor: "#ffffff",       // IMPORTANT
  WebkitTextFillColor: "#000000",   // 🔥 MOST IMPORTANT
  outline: "none",
},


  primaryBtn: {
    width: "100%",
    padding: 14,
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },

  secondaryBtn: {
    width: "100%",
    padding: 12,
    background: "#e0e7ff",
    color: "#1e3a8a",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 8,
  },

  stop: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 4,
  },

  /* ===== ETA CARDS ===== */
  etaCard: {
    background: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    cursor: "pointer",
    border: "2px solid transparent",
    color: "#0f172a",
  },

  etaSelected: {
    border: "2px solid #2563eb",
    background: "#eff6ff",
  },

  etaTitle: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 6,
  },

  etaRow: {
    fontSize: 13,
    color: "#0f131aff",
    marginBottom: 2,
  },

  planBtn: {
    width: "100%",
    marginTop: 10,
    padding: 14,
    background: "#16a34a",
    color: "#261d1dff",
    border: "none",
    borderRadius: 14,
    fontWeight: 600,
    cursor: "pointer",
  },

  success: {
    marginTop: 14,
    padding: 12,
    background: "#dcfce7",
    color: "#166534",
    borderRadius: 10,
    fontWeight: 600,
  },

  /* ===== MAP ===== */
  mapBox: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
  },
};
