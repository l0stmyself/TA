const db = require('../db');

class Store {
  static async findAll() {
    try {
      const result = await db.query(
        'SELECT * FROM stores ORDER BY distance ASC'
      );
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching stores: ${err.message}`);
    }
  }

  static async findById(id) {
    try {
      const storeResult = await db.query(
        'SELECT * FROM stores WHERE id = $1',
        [id]
      );
      
      if (storeResult.rows.length === 0) {
        return null;
      }

      const itemsResult = await db.query(
        'SELECT * FROM items WHERE store_id = $1',
        [id]
      );

      const store = storeResult.rows[0];
      store.items = itemsResult.rows;
      
      return store;
    } catch (err) {
      throw new Error(`Error fetching store: ${err.message}`);
    }
  }

  static async findItemsByStoreId(storeId) {
    try {
      const result = await db.query(
        'SELECT * FROM items WHERE store_id = $1',
        [storeId]
      );
      return result.rows;
    } catch (err) {
      throw new Error(`Error fetching store items: ${err.message}`);
    }
  }

  static async findItemById(itemId) {
    try {
      const result = await db.query(
        'SELECT i.*, s.name as store_name FROM items i JOIN stores s ON i.store_id = s.id WHERE i.id = $1',
        [itemId]
      );
      return result.rows[0] || null;
    } catch (err) {
      throw new Error(`Error fetching item: ${err.message}`);
    }
  }
}

module.exports = Store; 