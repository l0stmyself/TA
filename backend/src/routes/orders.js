const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { storeId, deliveryDetails } = req.body;
    
    // Get cart items
    const cartItems = await Cart.getUserCart(userId);
    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = await Order.create(userId, storeId, deliveryDetails, cartItems);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.getUserOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Error fetching orders',
      error: error.message 
    });
  }
});

module.exports = router; 