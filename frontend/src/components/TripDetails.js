import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const TripDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup } = location.state || { pickup: null };
  const [dropLocation, setDropLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'StudentServices/1.0'
          }
        }
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
    
    setDropLocation(newLocation);
    setSearchQuery(location.display_name);
    setSearchResults([]);
  };

  useEffect(() => {
    if (!pickup) {
      navigate('/services/transportation/motorcycle');
      return;
    }

    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const pickupMarker = L.marker([pickup.lat, pickup.lng])
      .bindPopup('Pickup: ' + pickup.address)
      .addTo(map);

    if (dropLocation) {
      const dropMarker = L.marker([dropLocation.lat, dropLocation.lng])
        .bindPopup('Drop: ' + dropLocation.address)
        .addTo(map);

      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropLocation.lat, dropLocation.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([pickup.lat, pickup.lng], 15);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [pickup, dropLocation, navigate]);

  if (!pickup) {
    return null;
  }

  return (
    <div className="trip-details-page">
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span><Link to="/services/transportation">Transportation</Link></span>
        <span><Link to="/services/transportation/motorcycle">Motorcycle</Link></span>
        <span>Trip Details</span>
      </div>

      <div className="trip-container">
        <div className="trip-info">
          <h2>Trip Details</h2>
          <div className="location-details">
            <div className="pickup">
              <h3>Pickup Location</h3>
              <p>{pickup.address}</p>
            </div>
            {dropLocation ? (
              <div className="drop">
                <h3>Drop Location</h3>
                <p>{dropLocation.address}</p>
              </div>
            ) : (
              <div className="search-box">
                <h3>Enter Drop Location</h3>
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
            )}
          </div>

          {dropLocation && (
            <>
              {selectedDriver ? (
                <div className="driver-details">
                  <h3>Selected Driver</h3>
                  <div className="driver-card selected">
                    <img src={selectedDriver.photo} alt={selectedDriver.name} />
                    <div className="driver-info">
                      <h4>{selectedDriver.name}</h4>
                      <p>Contact: {selectedDriver.contact}</p>
                      <p>Vehicle: {selectedDriver.vehicle.model}</p>
                      <p>Plate: {selectedDriver.vehicle.plate}</p>
                      <p>Rating: {selectedDriver.rating} ⭐</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowDrivers(true)}
                >
                  Show Drivers
                </button>
              )}
            </>
          )}
        </div>

        <div ref={mapRef} className="map-container"></div>
      </div>

      {showDrivers && (
        <div className="modal">
          <div className="modal-content">
            <h3>Available Drivers</h3>
            <div className="drivers-list">
              {/* We'll add mock drivers for now */}
              {mockDrivers.map((driver) => (
                <div 
                  key={driver.id} 
                  className="driver-card"
                  onClick={() => {
                    setSelectedDriver(driver);
                    setShowDrivers(false);
                  }}
                >
                  <img src={driver.photo} alt={driver.name} />
                  <div className="driver-info">
                    <h4>{driver.name}</h4>
                    <p>Rating: {driver.rating} ⭐</p>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowDrivers(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Mock drivers data
const mockDrivers = [
  {
    id: 1,
    name: "John Doe",
    photo: "https://via.placeholder.com/150",
    contact: "+63 912 345 6789",
    rating: 4.8,
    vehicle: {
      model: "Honda Click 150i",
      plate: "ABC 123"
    }
  },
  {
    id: 2,
    name: "Jane Smith",
    photo: "https://via.placeholder.com/150",
    contact: "+63 923 456 7890",
    rating: 4.9,
    vehicle: {
      model: "Yamaha Nmax",
      plate: "XYZ 789"
    }
  }
];

export default TripDetails;
