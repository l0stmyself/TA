const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');

// Create a new trip
router.post('/', auth, async (req, res) => {
  try {
    const tripData = {
      userId: req.user.userId,
      pickupLocation: req.body.pickupLocation,
      dropLocation: req.body.dropLocation,
      status: req.body.status,
      distance: req.body.distance,
      cost: req.body.cost,
      driverName: req.body.driver.name,
      driverContact: req.body.driver.contact,
      driverPhoto: req.body.driver.photo,
      vehicleModel: req.body.driver.vehicle.model,
      vehiclePlate: req.body.driver.vehicle.plate,
      driverRating: req.body.driver.rating
    };

    const trip = await Trip.create(tripData);
    res.status(201).json(trip);
  } catch (error) {
    console.error('Trip creation error:', error);
    res.status(500).json({ 
      message: 'Error creating trip',
      error: error.message 
    });
  }
});

// Get user's trips
router.get('/', auth, async (req, res) => {
  try {
    const trips = await Trip.findByUserId(req.user.userId);
    res.json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ 
      message: 'Error fetching trips',
      error: error.message 
    });
  }
});

module.exports = router; 