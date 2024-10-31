const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const auth = require('../middleware/auth');

// Get all stores
router.get('/', async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ 
      message: 'Error fetching stores',
      error: error.message 
    });
  }
});

// Get store by ID with its items
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (error) {
    console.error('Error fetching store:', error);
    res.status(500).json({ 
      message: 'Error fetching store',
      error: error.message 
    });
  }
});

// Get items by store ID
router.get('/:id/items', async (req, res) => {
  try {
    const items = await Store.findItemsByStoreId(req.params.id);
    res.json(items);
  } catch (error) {
    console.error('Error fetching store items:', error);
    res.status(500).json({ 
      message: 'Error fetching store items',
      error: error.message 
    });
  }
});

// Get specific item details
router.get('/items/:itemId', async (req, res) => {
  try {
    const item = await Store.findItemById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ 
      message: 'Error fetching item',
      error: error.message 
    });
  }
});

module.exports = router; 