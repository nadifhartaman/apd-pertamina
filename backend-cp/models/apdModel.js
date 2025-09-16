const { dbApd } = require("../db");

async function getAllContainer (limit, offset) {
  const [rows] = await dbApd.query(
    "SELECT * FROM container ORDER BY id DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[{ count }]] = await dbApd.query("SELECT COUNT(*) as count FROM container");

  return { data: rows, total: count };
}

async function getLastContainer () {
  const [rows] = await dbApd.query(
    "SELECT * FROM container ORDER BY id DESC LIMIT 1"
  );
  return rows[0] || null;
}

// hitung jumlah per jam hari ini
// async function getTodayCountPerHour () {
//   const [rows] = await dbApd.query(`
//     SELECT 
//       HOUR(timestamp) as hour,
//       COUNT(*) as count
//     FROM container
//     WHERE DATE(timestamp) = CURDATE()
//     GROUP BY HOUR(timestamp)
//     ORDER BY hour ASC
//   `);

//   return rows;
// }

async function getCountPerHourRaw(date = null) {
  const targetDate = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [rows] = await dbApd.query(
    `
      SELECT 
        HOUR(timestamp) as hour,
        COUNT(*) as count
      FROM container
      WHERE DATE(timestamp) = ?
      GROUP BY HOUR(timestamp)
      ORDER BY hour ASC
    `,
    [targetDate]
  );

  return rows;
}

// API jam 0–23
async function getCountPerHour(date = null) {
  const raw = await getCountPerHourRaw(date);

  const fullData = Array.from({ length: 24 }, (_, hour) => {
    const found = raw.find(r => r.hour === hour);
    return { hour, count: found ? found.count : 0 };
  });

  return fullData;
}

module.exports = {
  getAllContainer,
  getLastContainer,
  getCountPerHour,
}
