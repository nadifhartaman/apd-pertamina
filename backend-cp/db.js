const mysql = require("mysql2/promise");

// koneksi DB utama
const dbMain = mysql.createPool({
  host: process.env.DB1_HOST,
  user: process.env.DB1_USER,
  password: process.env.DB1_PASSWORD,
  database: process.env.DB1_NAME,
  port: process.env.DB1_PORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  idleTimeout: 60000,
  connectTimeout: 20000,
  timeout: 60000,
});

// koneksi DB APD
const dbApd = mysql.createPool({
  host: process.env.DB2_HOST,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME,
  port: process.env.DB2_PORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  idleTimeout: 60000,
  connectTimeout: 20000,
  timeout: 60000,
});

// Error handler
dbMain.on('connection', () => console.log('✅ DB1 connected'));
dbMain.on('error', (err) => console.error('❌ DB1 error:', err.message));

dbApd.on('connection', () => console.log('✅ DB2 connected'));
dbApd.on('error', (err) => console.error('❌ DB2 error:', err.message));

module.exports = { dbMain, dbApd };
