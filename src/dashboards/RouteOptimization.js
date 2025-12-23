import React, { useState } from "react";

const RouteOptimization = () => {
  const [routeType, setRouteType] = useState("SHORTEST");

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Route & Load Optimization</h2>
      <p>Select the optimization strategy for route planning.</p>

      {/* Route Type Selection */}
      <label>Route Type</label>
      <br />
      <select
        value={routeType}
        onChange={(e) => setRouteType(e.target.value)}
      >
        <option value="SHORTEST">Shortest Route</option>
        <option value="FASTEST">Fastest (Traffic Aware)</option>
        <option value="ENERGY">Energy Efficient</option>
      </select>

      <br /><br />

      {/* Optimize Button */}
      <button>Optimize Route</button>

      <hr />

      {/* Output Section (Placeholder) */}
      <h4>Route Summary</h4>
      <p>Distance: -- km</p>
      <p>Duration: -- mins</p>
      <p>Cost: --</p>
      <p>Load Score: --</p>
    </div>
  );
};

export default RouteOptimization;
