// src/components/LocationField.js
import React from 'react';

const LocationField = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    const address = e.target.value;

    // For now we just update address; later you can plug geocoding here
    onChange({
      ...value,
      address,
      // lat & lng can be updated after geocoding
    });
  };

  return (
    <div>
      <label>Location</label>
      <input
        type="text"
        value={value.address || ''}
        onChange={handleInputChange}
        placeholder="Enter your location"
      />
    </div>
  );
};

export default LocationField;
