const { Pool } = require('pg');
const { logError } = require('../utils/logger');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  connectionTimeoutMillis: 10000,
  retry: {
    max: 10,
    backoff: 'exponential'
  }
});

// Add event listener for errors
pool.on('error', (err) => {
  logError(err);
});

module.exports = pool;
