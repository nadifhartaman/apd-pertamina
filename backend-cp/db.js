const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
  idleTimeout: 60000,
  connectTimeout: 20000,
  timeout: 60000,
});

db.on('connection', () => console.log('✅ Database connected'));
db.on('error', (err) => console.error('❌ Database error:', err.message));

module.exports = { db };
