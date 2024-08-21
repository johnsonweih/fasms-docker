// config/dbConfig.js

const mysql = require('mysql2');

// Create a connection pool to handle multiple simultaneous connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export a promise-based version of the connection pool
const promisePool = pool.promise();

module.exports = promisePool;
