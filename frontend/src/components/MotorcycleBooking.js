import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';

const MotorcycleBooking = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const mapRef = useRef(null);
  
  // CMU coordinates
  const defaultLocation = {
    lat: 7.8535,
    lng: 125.0504
  };

  useEffect(() => {
    // Initialize map
    const mapInstance = L.map(mapRef.current).setView([defaultLocation.lat, defaultLocation.lng], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance);

    // Add default marker for CMU
    const defaultMarker = L.marker([defaultLocation.lat, defaultLocation.lng], {
      draggable: true // Allow marker to be dragged
    }).addTo(mapInstance);
    defaultMarker.bindPopup('Central Mindanao University');

    // Add search control
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false
    })
      .on('markgeocode', function(e) {
        const { center, name } = e.geocode;
        
        // Update marker position
        defaultMarker.setLatLng(center);
        defaultMarker.bindPopup(name).openPopup();
        
        // Center map on search result
        mapInstance.setView(center, 16);
        
        setSelectedLocation({
          lat: center.lat,
          lng: center.lng,
          address: name
        });
      })
      .addTo(mapInstance);

    // Handle marker drag events
    defaultMarker.on('dragend', function(e) {
      const position = defaultMarker.getLatLng();
      
      // Reverse geocode the coordinates to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name;
          defaultMarker.bindPopup(address).openPopup();
          
          setSelectedLocation({
            lat: position.lat,
            lng: position.lng,
            address: address
          });
        });
    });

    setMap(mapInstance);
    setMarker(defaultMarker);

    // Cleanup
    return () => {
      mapInstance.remove();
    };
  }, []);

  return (
    <div className="motorcycle-booking">
      <div className="location-info">
        <h3>Pickup Location</h3>
        {selectedLocation && (
          <div className="selected-location">
            <p><strong>Address:</strong> {selectedLocation.address}</p>
            <p><strong>Coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</p>
          </div>
        )}
      </div>
      
      <div 
        ref={mapRef} 
        className="map-container"
      ></div>

      {selectedLocation && (
        <div className="booking-actions">
          <button className="btn btn-primary">
            Confirm Location
          </button>
        </div>
      )}
    </div>
  );
};

export default MotorcycleBooking;
