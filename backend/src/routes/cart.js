const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { itemId, quantity, storeId } = req.body;
    const userId = req.user.userId;

    const cartItem = await Cart.addItem(userId, storeId, itemId, quantity);
    res.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ 
      message: 'Error adding item to cart',
      error: error.message 
    });
  }
});

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const cartItems = await Cart.getUserCart(userId);
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ 
      message: 'Error fetching cart',
      error: error.message 
    });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    await Cart.clearCart(userId);
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ 
      message: 'Error clearing cart',
      error: error.message 
    });
  }
});

module.exports = router; 