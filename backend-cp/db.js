const mysql = require("mysql2/promise");

// koneksi DB utama
const dbMain = mysql.createPool({
  host: process.env.DB1_HOST,
  user: process.env.DB1_USER,
  password: process.env.DB1_PASSWORD,
  database: process.env.DB1_NAME,
  port: process.env.DB1_PORT,
});

// koneksi DB APD
const dbApd = mysql.createPool({
  host: process.env.DB2_HOST,
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME,
  port: process.env.DB2_PORT,
});

module.exports = { dbMain, dbApd };
