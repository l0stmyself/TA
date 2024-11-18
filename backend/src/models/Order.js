const db = require('../db');

class Order {
  static async create(userId, storeId, deliveryDetails, cartItems) {
    try {
      await db.query('BEGIN');
      
      // Create order using the provided values
      const orderResult = await db.query(
        `INSERT INTO orders (
          user_id, store_id, delivery_address, delivery_lat, 
          delivery_lng, delivery_fee, total_amount, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          userId, storeId, deliveryDetails.address,
          deliveryDetails.lat, deliveryDetails.lng,
          deliveryDetails.deliveryFee, deliveryDetails.totalAmount, 'PENDING'
        ]
      );

      const order = {
        ...orderResult.rows[0],
        total_amount: deliveryDetails.totalAmount
      };

      // Create order items
      for (const item of cartItems) {
        await db.query(
          `INSERT INTO order_items (
            order_id, item_id, quantity, price_at_time
          ) VALUES ($1, $2, $3, $4)`,
          [order.id, item.id, item.quantity, item.price]
        );
      }

      // Clear user's cart
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
      return order;
    } catch (err) {
      await db.query('ROLLBACK');
      throw new Error(`Error creating order: ${err.message}`);
    }
  }

  static async getUserOrders(userId) {
    try {
      const result = await db.query(
        `SELECT o.*, s.name as store_name, s.image_url as store_image
         FROM orders o
         JOIN stores s ON o.store_id = s.id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [userId]
      );
      
      const orders = result.rows.map(order => ({
        ...order,
        total_amount: order.total_amount ? parseFloat(order.total_amount) : 0,
        status: order.status || 'PENDING'
      }));
      
      // Get items for each order
      for (let order of orders) {
        const itemsResult = await db.query(
          `SELECT oi.*, i.name, i.image_url
           FROM order_items oi
           JOIN items i ON oi.item_id = i.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        order.items = itemsResult.rows;
      }
      
      return orders;
    } catch (err) {
      throw new Error(`Error fetching user orders: ${err.message}`);
    }
  }
}

module.exports = Order; 