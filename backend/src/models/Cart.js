const db = require('../db');

class Cart {
  static async getOrCreate(userId, storeId) {
    try {
      let result = await db.query(
        'SELECT * FROM carts WHERE user_id = $1 AND store_id = $2',
        [userId, storeId]
      );

      if (result.rows.length === 0) {
        result = await db.query(
          'INSERT INTO carts (user_id, store_id) VALUES ($1, $2) RETURNING *',
          [userId, storeId]
        );
      }

      return result.rows[0];
    } catch (err) {
      throw new Error(`Error with cart: ${err.message}`);
    }
  }

  static async addItem(userId, storeId, itemId, quantity) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      await db.query('BEGIN');
      
      let result = await db.query(
        'SELECT * FROM carts WHERE user_id = $1 AND store_id = $2',
        [userId, storeId]
      );

      if (result.rows.length === 0) {
        result = await db.query(
          'INSERT INTO carts (user_id, store_id) VALUES ($1, $2) RETURNING *',
          [userId, storeId]
        );
      }

      const cart = result.rows[0];
      
      result = await db.query(
        `INSERT INTO cart_items (cart_id, item_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (cart_id, item_id)
         DO UPDATE SET quantity = $3
         RETURNING *`,
        [cart.id, itemId, quantity]
      );

      await db.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await db.query('ROLLBACK');
      throw err;
    }
  }

  static async getUserCart(userId) {
    try {
      const result = await db.query(
        `SELECT ci.quantity, i.*, s.name as store_name, s.distance
         FROM cart_items ci
         JOIN items i ON ci.item_id = i.id
         JOIN carts c ON ci.cart_id = c.id
         JOIN stores s ON c.store_id = s.id
         WHERE c.user_id = $1`,
        [userId]
      );
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching user cart: ${err.message}`);
    }
  }

  static async clearCart(userId) {
    try {
      await db.query('BEGIN');
      
      await db.query(
        `DELETE FROM cart_items ci
         USING carts c
         WHERE ci.cart_id = c.id AND c.user_id = $1`,
        [userId]
      );
      
      await db.query(
        'DELETE FROM carts WHERE user_id = $1',
        [userId]
      );

      await db.query('COMMIT');
    } catch (err) {
      await db.query('ROLLBACK');
      throw new Error(`Error clearing cart: ${err.message}`);
    }
  }
}

module.exports = Cart; 