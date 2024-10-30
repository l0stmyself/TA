import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProtectedRoute from './ProtectedRoute';

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/trips', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-trips-page">
      <div className="breadcrumb">
        <span><Link to="/services">Services</Link></span>
        <span>My Trips</span>
      </div>

      <div className="trips-container">
        <h2>My Trips</h2>
        {trips.length === 0 ? (
          <p>No trips booked yet.</p>
        ) : (
          <div className="trips-list">
            {trips.map((trip) => (
              <div key={trip.id} className="trip-card">
                <div className="trip-header">
                  <h3>Trip #{trip.id}</h3>
                  <span className={`status status-${trip.status.toLowerCase()}`}>
                    {trip.status}
                  </span>
                </div>
                <div className="trip-details">
                  <div className="locations">
                    <p><strong>From:</strong> {trip.pickupLocation.address}</p>
                    <p><strong>To:</strong> {trip.dropLocation.address}</p>
                  </div>
                  <div className="trip-summary">
                    <p><strong>Distance:</strong> {typeof trip.distance === 'number' ? trip.distance.toFixed(2) : trip.distance} kilometers</p>
                    <p><strong>Cost:</strong> ₱{typeof trip.cost === 'number' ? trip.cost.toFixed(2) : parseFloat(trip.cost).toFixed(2)}</p>
                  </div>
                  <div className="driver-info">
                    <h4>Driver</h4>
                    <p>{trip.driver.name}</p>
                    <p>Contact: {trip.driver.contact}</p>
                    <p>Vehicle: {trip.driver.vehicle.model}</p>
                    <p>Plate: {trip.driver.vehicle.plate}</p>
                  </div>
                  <div className="trip-metadata">
                    <p>Booked on: {new Date(trip.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function WrappedMyTrips() {
  return (
    <ProtectedRoute>
      <MyTrips />
    </ProtectedRoute>
  );
} 