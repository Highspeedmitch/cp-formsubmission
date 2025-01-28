// src/PropertySelection.js
import React from 'react';
import { Link } from 'react-router-dom';
import './PropertySelection.css'; // optional for styling

function PropertySelection() {
  return (
    <div className="property-selection">
      <h1>Select a Property</h1>
      <div className="property-box-container">
        {/* Box 1 */}
        <Link to="/property/property1" className="property-box">
          Property 1
        </Link>

        {/* Box 2 */}
        <Link to="/property/property2" className="property-box">
          Property 2
        </Link>

        {/* Box 3 */}
        <Link to="/property/property3" className="property-box">
          Property 3
        </Link>
      </div>
    </div>
  );
}

export default PropertySelection;
