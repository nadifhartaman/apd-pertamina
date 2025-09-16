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

async function getCountPerHourRaw (date = null) {
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
async function getCountPerHour (date = null) {
  const raw = await getCountPerHourRaw(date);

  const fullData = Array.from({ length: 24 }, (_, hour) => {
    const found = raw.find(r => r.hour === hour);
    return { hour, count: found ? found.count : 0 };
  });

  return fullData;
}

async function getTotalDetection (date = null) {
  const targetDate = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [[{ total }]] = await dbApd.query(
    `SELECT COUNT(*) as total FROM container WHERE DATE(timestamp) = ?`,
    [targetDate]
  );

  return total;
}

async function getViolationSummary(date = null) {
  const targetDate = date || new Date().toISOString().slice(0, 10);

  const [rows] = await dbApd.query(
    `
      SELECT detected_container_id
      FROM container
      WHERE DATE(timestamp) = ?
    `,
    [targetDate]
  );

  // master list
  const masterLabels = [
    "Person",
    "No Hardhat",
    "No Mask",
    "No Glove",
    "Hardhat",
    "Mask",
    "Glove"
  ];

  // kriteria pelanggaran
  const violationCriteria = ["No Hardhat", "No Mask", "No Glove"];

  const counts = {};
  masterLabels.forEach(l => (counts[l] = 0));

  let violationTotal = 0;
  let nonViolationTotal = 0;

  rows.forEach(row => {
    if (!row.detected_container_id) return;

    const labels = row.detected_container_id
      .split(",")
      .map(l => l.trim())
      .filter(l => l.length > 0);

    labels.forEach(label => {
      // tambah ke counter label
      if (counts[label] !== undefined) {
        counts[label] += 1;
      } else {
        // kalau label baru muncul
        counts[label] = 1;
      }

      // cek apakah label termasuk pelanggaran
      if (violationCriteria.includes(label)) {
        violationTotal += 1;
      } else {
        nonViolationTotal += 1;
      }
    });
  });

  // label yang tidak muncul sama sekali
  const notDetected = Object.entries(counts)
    .filter(([_, v]) => v === 0)
    .map(([k]) => k);

  const totalDetections = violationTotal + nonViolationTotal;

  const violationPercentage =
    totalDetections > 0 ? ((violationTotal / totalDetections) * 100).toFixed(2) : "0.00";

  const nonViolationPercentage =
    totalDetections > 0 ? ((nonViolationTotal / totalDetections) * 100).toFixed(2) : "0.00";

  return {
    // totalLabels: Object.keys(counts).length,
    // counts,
    // notDetected,
    totals: {
      violation: violationTotal,
      nonViolation: nonViolationTotal,
      totalDetections
    },
    percentages: {
      violation: violationPercentage + "%",
      nonViolation: nonViolationPercentage + "%"
    }
  };
}



module.exports = {
  getAllContainer,
  getLastContainer,
  getCountPerHour,
  getTotalDetection,
  getViolationSummary
};