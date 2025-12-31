import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

/* ===== ARROW ICON ===== */
const arrowIcon = (angle) =>
  L.divIcon({
    className: "",
    html: `<div style="
      transform: rotate(${angle}deg);
      font-size: 22px;
      color: #22c55e;
    ">➤</div>`,
  });

/* ===== ROUTES ===== */
const routes = {
  hyd_blr: [
    [17.385, 78.486],
    [16.5, 77.5],
    [15.8, 76.9],
    [15.3, 75.8],
    [12.9716, 77.5946],
  ],
  vja_chn: [
    [16.506, 80.648],
    [15.8, 80.1],
    [14.8, 79.9],
    [13.0827, 80.2707],
  ],
  gnt_blr: [
    [16.306, 80.436],
    [15.9, 79.8],
    [15.2, 78.9],
    [12.9716, 77.5946],
  ],
  hyd_pune: [
    [17.385, 78.486],
    [17.0, 76.8],
    [16.2, 75.3],
    [18.5204, 73.8567],
  ],
  blr_chennai: [
    [12.9716, 77.5946],
    [12.6, 78.0],
    [12.2, 79.4],
    [13.0827, 80.2707],
  ],
  hyd_nagpur: [
    [17.385, 78.486],
    [18.2, 79.1],
    [19.0, 79.3],
    [21.1458, 79.0882],
  ],
};

/* ===== VEHICLES ===== */
const initialVehicles = [
  {
    id: 1,
    name: "Truck-01",
    routeKey: "hyd_blr",
    source: "Hyderabad",
    sourceLat: 17.385,
    sourceLng: 78.486,
    destination: "Bangalore",
    destLat: 12.9716,
    destLng: 77.5946,
    segment: 0,
    progress: 0,
  },
  {
    id: 2,
    name: "Van-02",
    routeKey: "vja_chn",
    source: "Vijayawada",
    sourceLat: 16.506,
    sourceLng: 80.648,
    destination: "Chennai",
    destLat: 13.0827,
    destLng: 80.2707,
    segment: 0,
    progress: 0,
  },
  {
    id: 3,
    name: "Car-03",
    routeKey: "gnt_blr",
    source: "Guntur",
    sourceLat: 16.306,
    sourceLng: 80.436,
    destination: "Bangalore",
    destLat: 12.9716,
    destLng: 77.5946,
    segment: 0,
    progress: 0,
  },
  {
    id: 4,
    name: "Truck-04",
    routeKey: "hyd_pune",
    source: "Hyderabad",
    sourceLat: 17.385,
    sourceLng: 78.486,
    destination: "Pune",
    destLat: 18.5204,
    destLng: 73.8567,
    segment: 0,
    progress: 0,
  },
  {
    id: 5,
    name: "Van-05",
    routeKey: "blr_chennai",
    source: "Bangalore",
    sourceLat: 12.9716,
    sourceLng: 77.5946,
    destination: "Chennai",
    destLat: 13.0827,
    destLng: 80.2707,
    segment: 0,
    progress: 0,
  },
  {
    id: 6,
    name: "Car-06",
    routeKey: "hyd_nagpur",
    source: "Hyderabad",
    sourceLat: 17.385,
    sourceLng: 78.486,
    destination: "Nagpur",
    destLat: 21.1458,
    destLng: 79.0882,
    segment: 0,
    progress: 0,
  },
];


/* ===== TRAFFIC ===== */
const getTrafficLevel = () => {
  const h = new Date().getHours();
  if ((h >= 8 && h <= 10) || (h >= 17 && h <= 20)) return "HEAVY";
  if (Math.random() > 0.6) return "MEDIUM";
  return "LOW";
};

const trafficStyle = {
  LOW: { color: "#22c55e", radius: 600 },
  MEDIUM: { color: "#f97316", radius: 900 },
  HEAVY: { color: "#dc2626", radius: 1200 },
};

/* ===== AUTO ZOOM ===== */
const FollowVehicle = ({ pos }) => {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 7, { duration: 1.2 });
  }, [pos]);
  return null;
};

const LiveTracking = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [activeVehicle, setActiveVehicle] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const markerRef = useRef({});

  /* ===== MOVEMENT ===== */
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          const path = routes[v.routeKey];
          if (!path || v.segment >= path.length - 1) return v;

          let progress = v.progress + 0.02;
          let segment = v.segment;
          if (progress >= 1) {
            progress = 0;
            segment += 1;
          }

          const [lat1, lng1] = path[segment];
          const [lat2, lng2] = path[segment + 1];

          return {
            ...v,
            segment,
            progress,
            currentPos: [
              lat1 + (lat2 - lat1) * progress,
              lng1 + (lng2 - lng1) * progress,
            ],
            angle: 45,
          };
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  /* ===== AUTO POPUP ===== */
  useEffect(() => {
    if (activeVehicle && markerRef.current[activeVehicle.id]) {
      markerRef.current[activeVehicle.id].openPopup();
    }
  }, [activeVehicle]);

  return (
    <div style={styles.page}>
      {/* ===== SIDEBAR ===== */}
      <div style={styles.sidebar}>
        <h3>🚚 Live Vehicles</h3>

        <button
          style={{
            ...styles.trafficBtn,
            background: showTraffic ? "#dc2626" : "#2563eb",
          }}
          onClick={() => setShowTraffic((p) => !p)}
        >
          🚦 Traffic Analytics
        </button>

        {vehicles.map((v) => (
          <div
            key={v.id}
            style={{
              ...styles.vehicleItem,
              background: activeVehicle?.id === v.id ? "#2563eb" : "#111827",
            }}
            onClick={() => setActiveVehicle(v)}
          >
            <b>{v.name}</b>
            <p>{v.source} ➜ {v.destination}</p>
          </div>
        ))}
      </div>

      {/* ===== MAP ===== */}
      <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ROUTE FOR ACTIVE VEHICLE */}
        {activeVehicle && (
          <Polyline
            positions={routes[activeVehicle.routeKey]}
            color="#38bdf8"
            weight={5}
          />
        )}

        {/* VEHICLES + TRAFFIC */}
        {vehicles.map((v) => {
          const path = routes[v.routeKey];
          if (!path) return null;
          const pos = v.currentPos || path[0];
          const level = getTrafficLevel();
          const style = trafficStyle[level];

          return (
            <React.Fragment key={v.id}>
              {showTraffic && (
                <Circle
                  center={pos}
                  radius={style.radius}
                  pathOptions={{
                    color: style.color,
                    fillColor: style.color,
                    fillOpacity:
                      activeVehicle?.id === v.id ? 0.45 : 0.25,
                  }}
                />
              )}

              <Marker
                position={pos}
                icon={arrowIcon(v.angle)}
                ref={(ref) => (markerRef.current[v.id] = ref)}
              >
                <Popup>
                  <b>{v.name}</b><br />
                  {v.source} ➜ {v.destination}<br />
                  {showTraffic && <>Traffic: {level}</>}
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {activeVehicle?.currentPos && (
          <FollowVehicle pos={activeVehicle.currentPos} />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveTracking;

/* ===== STYLES ===== */
const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    height: "100vh",
    background: "#020617",
    color: "#fff",
  },
  sidebar: {
    padding: 20,
    borderRight: "1px solid #1e293b",
  },
  trafficBtn: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    border: "none",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 14,
  },
  vehicleItem: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    cursor: "pointer",
  },
};
