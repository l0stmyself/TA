import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MotorcycleBooking = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // CMU coordinates
  const defaultLocation = {
    lat: 7.8535,
    lng: 125.0504
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([defaultLocation.lat, defaultLocation.lng], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add default marker for CMU
    const marker = L.marker([defaultLocation.lat, defaultLocation.lng]).addTo(map);
    marker.bindPopup('Central Mindanao University').openPopup();

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [defaultLocation.lat, defaultLocation.lng]);

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

    // Update map and marker
    mapInstanceRef.current.setView([newLocation.lat, newLocation.lng], 15);
    markerRef.current.setLatLng([newLocation.lat, newLocation.lng])
      .bindPopup(location.display_name)
      .openPopup();
  };

  return (
    <div className="motorcycle-booking-page">
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span><Link to="/services/transportation">Transportation</Link></span>
        <span>Motorcycle Booking</span>
      </div>

      <div className="booking-container">
        <div className="location-search">
          <h2>Enter Pickup Location</h2>
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
            </div>
          )}
        </div>

        <div ref={mapRef} className="map-container"></div>
      </div>
    </div>
  );
};

export default MotorcycleBooking;
