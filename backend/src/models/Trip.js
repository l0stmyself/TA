const db = require('../db');

class Trip {
  static async create(tripData) {
    const { 
      userId, 
      pickupLocation, 
      dropLocation, 
      status,
      driverName,
      driverContact,
      driverPhoto,
      vehicleModel,
      vehiclePlate,
      driverRating
    } = tripData;
    
    try {
      const result = await db.query(
        `INSERT INTO trips (
          user_id, 
          pickup_location, 
          drop_location, 
          status,
          driver_name,
          driver_contact,
          driver_photo,
          vehicle_model,
          vehicle_plate,
          driver_rating
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          userId, 
          pickupLocation, 
          dropLocation, 
          status,
          driverName,
          driverContact,
          driverPhoto,
          vehicleModel,
          vehiclePlate,
          driverRating
        ]
      );
      
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error creating trip: ${err.message}`);
    }
  }

  static async findByUserId(userId) {
    try {
      const result = await db.query(
        `SELECT * FROM trips
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId]
      );

      return result.rows.map(row => ({
        id: row.id,
        pickupLocation: row.pickup_location,
        dropLocation: row.drop_location,
        status: row.status,
        createdAt: row.created_at,
        driver: {
          name: row.driver_name,
          contact: row.driver_contact,
          photo: row.driver_photo,
          vehicle: {
            model: row.vehicle_model,
            plate: row.vehicle_plate
          },
          rating: row.driver_rating
        }
      }));
    } catch (err) {
      throw new Error(`Error finding trips: ${err.message}`);
    }
  }

  static async updateStatus(tripId, status) {
    try {
      const result = await db.query(
        `UPDATE trips 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, tripId]
      );
      
      return result.rows[0];
    } catch (err) {
      throw new Error(`Error updating trip status: ${err.message}`);
    }
  }
}

module.exports = Trip;