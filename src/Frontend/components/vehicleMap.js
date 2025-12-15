// src/components/VehicleMap.js
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const vehicleIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const VehicleMap = ({ vehicles }) => {
  // Center roughly over India
  const center = [20.5937, 78.9629];

  return (
    <div className="fleet-map">
      <MapContainer center={center} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {vehicles.map((v) => (
          <Marker key={v.id} position={[v.lat, v.lng]} icon={vehicleIcon}>
            <Popup>
              <strong>{v.name}</strong>
              <br />
              {v.city}
              <br />
              Status: {v.status}
              <br />
              Fuel: {v.fuelLevel}%
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default VehicleMap;
