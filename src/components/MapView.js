// src/components/MapView.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default Leaflet marker icons so they show correctly in React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapView = ({ lat, lng }) => {
  if (lat == null || lng == null) {
    return (
      <p style={{ marginTop: '8px', fontSize: '0.85rem' }}>
        Waiting for live location...
      </p>
    );
  }

  const position = [lat, lng];

  return (
    <div style={{ height: '300px', width: '100%', marginTop: '8px' }}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            You are here
            <br />
            Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
