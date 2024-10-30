import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ProtectedRoute from './ProtectedRoute';

const DestinationBooking = () => {
  const location = useLocation();
  const { pickup } = location.state || {};
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pickup) {
      navigate('/services/transportation/motorcycle');
      return;
    }

    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([pickup.lat, pickup.lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add pickup marker
    L.marker([pickup.lat, pickup.lng])
      .bindPopup('Pickup: ' + pickup.address)
      .addTo(map);

    // Add destination marker
    const marker = L.marker([pickup.lat, pickup.lng]).addTo(map);
    
    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [pickup, navigate]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleLocationSelect = (location) => {
    const newLocation = {
      lat: parseFloat(location.lat),
      lng: parseFloat(location.lon),
      address: location.display_name
    };
    
    setSelectedLocation(newLocation);
    setSearchQuery(location.display_name);
    setSearchResults([]);

    mapInstanceRef.current.setView([newLocation.lat, newLocation.lng], 15);
    markerRef.current.setLatLng([newLocation.lat, newLocation.lng])
      .bindPopup(location.display_name)
      .openPopup();
  };

  const handleNext = () => {
    navigate('/services/transportation/motorcycle/trip-details', {
      state: { 
        pickup: pickup,
        destination: selectedLocation 
      }
    });
  };

  return (
    <div className="motorcycle-booking-page">
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span><Link to="/services/transportation">Transportation</Link></span>
        <span><Link to="/services/transportation/motorcycle">Pickup</Link></span>
        <span>Destination</span>
      </div>

      <div className="booking-container">
        <div className="location-search">
          <h2>Enter Drop-off Location</h2>
          <div className="search-box">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search for a location..."
              className="location-input"
            />
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((result) => (
                  <li 
                    key={result.place_id}
                    onClick={() => handleLocationSelect(result)}
                  >
                    {result.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedLocation && (
            <div className="selected-location-info">
              <h3>Selected Location:</h3>
              <p>{selectedLocation.address}</p>
              <button 
                className="btn btn-primary"
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div ref={mapRef} className="map-container"></div>
      </div>
    </div>
  );
};

export default function WrappedDestinationBooking() {
  return (
    <ProtectedRoute>
      <DestinationBooking />
    </ProtectedRoute>
  );
} 