import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import driver1Image from '../images/drivers/driver1.jpeg';
import driver2Image from '../images/drivers/driver2.jpeg';

const TripDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pickup, destination } = location.state || {};
  const [showDrivers, setShowDrivers] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  if (!pickup || !destination) {
    navigate('/services/transportation/motorcycle');
    return null;
  }

  const handleBookTrip = async () => {
    try {
      const tripData = {
        pickupLocation: pickup,
        dropLocation: destination,
        status: 'BOOKED',
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

      const response = await axios.post('http://localhost:4000/api/trips', tripData, {
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

      <div className="trip-container">
        <div className="trip-info">
          <h2>Trip Details</h2>
          <div className="location-details">
            <div className="pickup">
              <h3>Pickup Location</h3>
              <p>{pickup.address}</p>
            </div>
            <div className="destination">
              <h3>Drop-off Location</h3>
              <p>{destination.address}</p>
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

export default TripDetails;
