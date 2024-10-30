import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import driver1Image from '../images/drivers/driver1.jpeg';
import driver2Image from '../images/drivers/driver2.jpeg';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mockDrivers = [
  {
    id: 1,
    name: "John Doe",
    photo: driver1Image,
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
    photo: driver2Image,
    contact: "+63 923 456 7890",
    rating: 4.9,
    vehicle: {
      model: "Yamaha Nmax",
      plate: "XYZ 789"
    }
  }
];

const TripDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, destination } = location.state || {};
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [distance, setDistance] = useState(0);
  const [cost, setCost] = useState(0);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!pickup || !destination) {
      navigate('/services/transportation/motorcycle');
      return;
    }

    // Initialize map
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [pickup.lat, pickup.lng],
        13
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Clear any existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add pickup marker
      const pickupMarker = L.marker([pickup.lat, pickup.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup('Pickup: ' + pickup.address)
        .openPopup();

      // Add destination marker
      const destinationMarker = L.marker([destination.lat, destination.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup('Destination: ' + destination.address);

      markersRef.current.push(pickupMarker, destinationMarker);

      // Calculate distance in kilometers
      const pickupLatLng = L.latLng(pickup.lat, pickup.lng);
      const destinationLatLng = L.latLng(destination.lat, destination.lng);
      const distanceInMeters = pickupLatLng.distanceTo(destinationLatLng);
      const distanceInKm = (distanceInMeters / 1000).toFixed(2);
      
      // Set distance and calculate cost (₱10 per km with minimum fare of ₱10)
      setDistance(Number(distanceInKm));
      const calculatedCost = Number(distanceInKm) * 10;
      setCost(calculatedCost < 10 ? 10 : calculatedCost);

      // Draw line between markers
      const latlngs = [
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng]
      ];
      
      L.polyline(latlngs, {color: 'blue'}).addTo(mapInstanceRef.current);

      // Fit map bounds to show both markers
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [destination.lat, destination.lng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [pickup, destination, navigate]);

  const handleBookTrip = async () => {
    try {
      const tripData = {
        pickupLocation: pickup,
        dropLocation: destination,
        status: 'BOOKED',
        distance: distance,
        cost: cost,
        driver: {
          name: selectedDriver.name,
          contact: selectedDriver.contact,
          photo: selectedDriver.photo,
          vehicle: {
            model: selectedDriver.vehicle.model,
            plate: selectedDriver.vehicle.plate
          },
          rating: selectedDriver.rating
        }
      };

      await axios.post('http://localhost:4000/api/trips', tripData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('Trip booked successfully!', {
        position: "top-right",
        autoClose: 3000
      });

      setTimeout(() => {
        navigate('/my-trips');
      }, 3000);

    } catch (error) {
      toast.error('Failed to book trip. Please try again.');
      console.error('Booking error:', error);
    }
  };

  if (!pickup || !destination) {
    return null;
  }

  return (
    <div className="trip-details-page">
      <ToastContainer />
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span><Link to="/services/transportation">Transportation</Link></span>
        <span><Link to="/services/transportation/motorcycle">Pickup</Link></span>
        <span><Link to="/services/transportation/motorcycle/destination">Destination</Link></span>
        <span>Trip Details</span>
      </div>

      <div className="trip-details-container">
        {/* Add the map container */}
        <div ref={mapRef} className="trip-map" style={{ height: '300px', marginBottom: '20px' }}></div>

        <div className="location-details">
          <div className="location-card">
            <h3>Pickup Location</h3>
            <p>{pickup.address}</p>
          </div>
          <div className="location-card">
            <h3>Destination</h3>
            <p>{destination.address}</p>
          </div>
        </div>

        <div className="trip-summary">
          <div className="summary-card">
            <div className="summary-item">
              <h3>Distance</h3>
              <p>{distance} kilometers</p>
            </div>
            <div className="summary-item">
              <h3>Estimated Cost</h3>
              <p>₱{cost.toFixed(2)}</p>
            </div>
          </div>
        </div>

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
            Show Available Drivers
          </button>
        )}

        {selectedDriver && (
          <div className="booking-actions">
            <button 
              className="btn btn-success"
              onClick={handleBookTrip}
            >
              Book Trip
            </button>
          </div>
        )}
      </div>

      {showDrivers && (
        <div className="modal">
          <div className="modal-content">
            <h3>Available Drivers</h3>
            <div className="drivers-list">
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

export default TripDetails;
