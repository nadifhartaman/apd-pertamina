const { dbApd } = require("../db");
const { differenceInDays, addDays, format, startOfMonth, endOfMonth } = require("date-fns");

const getAllContainer = async (limit, offset, type, startDate, endDate, id_camera) => {
  try {
    console.log('🔄 getAllContainer query starting...');
    
    let whereConditions = [];
    let params = [];

    if (type === 'custom' && startDate && endDate) {
      whereConditions.push('timestamp BETWEEN ? AND ?');
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    }
    else if (type === 'month') {
      whereConditions.push('MONTH(timestamp) = MONTH(CURDATE()) AND YEAR(timestamp) = YEAR(CURDATE())');
    }
    else if (type === 'today') {
      const dateParam = startDate || new Date().toISOString().split('T')[0];
      whereConditions.push('DATE(timestamp) = ?');
      params.push(dateParam);
    }
    else {
      whereConditions.push('DATE(timestamp) = CURDATE()');
    }

    if (id_camera) {
      whereConditions.push('id_camera = ?');
      params.push(parseInt(id_camera));
    }

    // OPTION 1: Include image_frame (LAMBAT tapi complete)
    const query = `
      SELECT id, detected_container_id, timestamp, id_camera, image_frame
      FROM container 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `;
    
    const [data] = await dbApd.query(query, [...params, parseInt(limit), parseInt(offset)]);
    
    // Query total
    const countQuery = `
      SELECT COUNT(*) as total FROM container 
      WHERE ${whereConditions.join(' AND ')}
    `;
    
    const [[{ total }]] = await dbApd.query(countQuery, params);
    
    console.log(`✅ Query done - rows: ${data.length}, total: ${total}`);
    return { data, total };
  } catch (error) {
    console.error('❌ Query error:', error.message);
    throw error;
  }
};

async function getLastContainer (type = 'today', startDate = null, endDate = null, id_camera = null) {
  let whereConditions = [];
  let params = [];

  const formatDate = (d) => {
    const dt = new Date(d);
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  if (type === 'custom' && startDate && endDate) {
    whereConditions.push('DATE(timestamp) BETWEEN ? AND ?');
    params.push(startDate, endDate);
  }
  else if (type === 'month') {
    whereConditions.push('MONTH(timestamp) = MONTH(CURDATE())');
    whereConditions.push('YEAR(timestamp) = YEAR(CURDATE())');
  }
  else if (type === 'today') {
    const dateParam = startDate ? formatDate(startDate) : formatDate(new Date());
    whereConditions.push('DATE(timestamp) = ?');
    params.push(dateParam);
  }
  else {
    whereConditions.push('DATE(timestamp) = CURDATE()');
  }

  if (id_camera) {
    whereConditions.push('id_camera = ?');
    params.push(id_camera);
  }

  const [rows] = await dbApd.query(
    `
      SELECT * 
      FROM container 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY id DESC 
      LIMIT 1
    `,
    params
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
async function getCountPerHour (date = null, type = 'today', startDate = null, endDate = null, id_camera = null) {
  let whereConditions = [];
  let params = [];

  // Tentukan kondisi waktu
  if (type === 'custom' && startDate && endDate) {
    whereConditions.push('DATE(timestamp) BETWEEN ? AND ?');
    params.push(startDate, endDate);
  }
  else if (type === 'month') {
    whereConditions.push('MONTH(timestamp) = MONTH(CURDATE())');
    whereConditions.push('YEAR(timestamp) = YEAR(CURDATE())');
  }
  else if (type === 'today' && date) {
    whereConditions.push('DATE(timestamp) = ?');
    params.push(date);
  }
  else {
    whereConditions.push('DATE(timestamp) = CURDATE()');
  }

  // Tambahkan filter camera jika ada
  if (id_camera) {
    whereConditions.push('id_camera = ?');
    params.push(id_camera);
  }

  // Build query
  const query = `
    SELECT 
      HOUR(timestamp) AS hour,
      COUNT(*) AS count
    FROM container
    WHERE ${whereConditions.join(' AND ')}
    GROUP BY hour
    ORDER BY hour
  `;

  const [rows] = await dbApd.query(query, params);

  // Lengkapi jam 0-23
  const fullData = Array.from({ length: 24 }, (_, hour) => {
    const found = rows.find(r => r.hour === hour);
    return { hour, count: found ? Number(found.count) : 0 };
  });

  return fullData;
}

async function getCountPerWeek (date = null, type = "month", startDate = null, endDate = null, id_camera = null) {
  let whereConditions = [];
  let params = [];

  // === Tentukan rentang tanggal untuk query utama ===
  let rangeStart = null;
  let rangeEnd = null;

  const now = new Date();

  if (type === "custom" && startDate && endDate) {
    rangeStart = new Date(startDate);
    rangeEnd = new Date(endDate);
    whereConditions.push("DATE(timestamp) BETWEEN ? AND ?");
    params.push(startDate, endDate);
  } else if (["today", "week", "month"].includes(type)) {
    // Ambil bulan ini
    rangeStart = startOfMonth(now);
    rangeEnd = endOfMonth(now);
    whereConditions.push("MONTH(timestamp) = MONTH(CURDATE())");
    whereConditions.push("YEAR(timestamp) = YEAR(CURDATE())");
  } else {
    rangeStart = startOfMonth(now);
    rangeEnd = endOfMonth(now);
    whereConditions.push("DATE(timestamp) = CURDATE()");
  }

  // === Filter kamera jika ada ===
  if (id_camera) {
    whereConditions.push("id_camera = ?");
    params.push(id_camera);
  }

  // === Query utama (grup per minggu ISO) ===
  const query = `
    SELECT 
      WEEK(timestamp, 1) AS week_number,
      MIN(DATE(timestamp)) AS start_date,
      MAX(DATE(timestamp)) AS end_date,
      COUNT(*) AS count
    FROM container
    WHERE ${whereConditions.join(" AND ")}
    GROUP BY week_number
    ORDER BY week_number
  `;

  const [rows] = await dbApd.query(query, params);

  // === Jika type custom, generate minggu manual dari range tanggal ===
  if (type === "custom") {
    const totalDays = differenceInDays(rangeEnd, rangeStart) + 1;
    const totalWeeks = Math.ceil(totalDays / 7);

    const result = [];
    for (let i = 0; i < totalWeeks; i++) {
      const weekStart = addDays(rangeStart, i * 7);
      const weekEnd = addDays(weekStart, 6);

      const found = rows.find(
        (r) =>
          new Date(r.start_date) >= weekStart && new Date(r.start_date) <= weekEnd
      );

      result.push({
        week: i + 1,
        start_date: format(weekStart, "yyyy-MM-dd"),
        end_date: format(weekEnd > rangeEnd ? rangeEnd : weekEnd, "yyyy-MM-dd"),
        count: found ? Number(found.count) : 0,
      });
    }

    return result;
  }

  // === Jika month/week/today → selalu kembalikan 5 minggu (bulan ini) ===
  const monthWeeks = 5;
  const result = [];

  for (let i = 0; i < monthWeeks; i++) {
    const weekStart = addDays(rangeStart, i * 7);
    const weekEnd = addDays(weekStart, 6);

    const found = rows.find(
      (r) => new Date(r.start_date) >= weekStart && new Date(r.start_date) <= weekEnd
    );

    result.push({
      week: i + 1,
      start_date: format(weekStart, "yyyy-MM-dd"),
      end_date: format(weekEnd > rangeEnd ? rangeEnd : weekEnd, "yyyy-MM-dd"),
      count: found ? Number(found.count) : 0,
    });
  }

  return result;
}

async function getTotalDetection (date = null, type = "today", startDate = null, endDate = null, id_camera = null) {
  let whereClause = "";
  let params = [];

  switch (type) {
    case "yesterday":
      whereClause = "WHERE DATE(timestamp) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
      break;

    case "week":
      whereClause = "WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
      break;

    case "month":
      whereClause = `
        WHERE YEAR(timestamp) = YEAR(CURDATE())
        AND MONTH(timestamp) = MONTH(CURDATE())
      `;
      break;

    case "custom":
      if (startDate && endDate) {
        whereClause = "WHERE DATE(timestamp) BETWEEN ? AND ?";
        params.push(startDate, endDate);
      } else {
        whereClause = "WHERE DATE(timestamp) = CURDATE()"; // fallback
      }
      break;

    case "today":
    default:
      const targetDate = date || new Date().toISOString().slice(0, 10);
      whereClause = "WHERE DATE(timestamp) = ?";
      params.push(targetDate);
      break;
  }

  if (id_camera) {
    whereClause += " AND id_camera = ?";
    params.push(id_camera);
  }

  const [[{ total }]] = await dbApd.query(
    `SELECT COUNT(*) as total FROM container ${whereClause}`,
    params
  );

  return total;
}

async function getViolationSummary (date = null, type = "today", startDate = null, endDate = null, id_camera = null) {
  let whereClause = "";
  let params = [];

  switch (type) {
    case "yesterday":
      whereClause = "WHERE DATE(timestamp) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
      break;

    case "week":
      whereClause = "WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
      break;

    case "month":
      whereClause = `
        WHERE YEAR(timestamp) = YEAR(CURDATE())
        AND MONTH(timestamp) = MONTH(CURDATE())
      `;
      break;

    case "custom":
      if (startDate && endDate) {
        whereClause = "WHERE DATE(timestamp) BETWEEN ? AND ?";
        params.push(startDate, endDate);
      } else {
        whereClause = "WHERE DATE(timestamp) = CURDATE()";
      }
      break;

    case "today":
    default:
      const targetDate = date || new Date().toISOString().slice(0, 10);
      whereClause = "WHERE DATE(timestamp) = ?";
      params.push(targetDate);
      break;
  }

  if (id_camera) {
    whereClause += " AND id_camera = ?";
    params.push(id_camera);
  }

  const [rows] = await dbApd.query(
    `SELECT detected_container_id FROM container ${whereClause}`,
    params
  );

  const masterLabels = [
    "Person",
    "No Hardhat",
    "No Mask",
    "No Glove",
    "Hardhat",
    "Mask",
    "Glove"
  ];

  const violationCriteria = ["No Hardhat", "No Mask", "No Glove"];
  const ignoreLabels = ["Person"];

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
      if (ignoreLabels.includes(label)) return;

      if (counts[label] !== undefined) {
        counts[label] += 1;
      } else {
        counts[label] = 1;
      }

      if (violationCriteria.includes(label)) {
        violationTotal += 1;
      } else {
        nonViolationTotal += 1;
      }
    });
  });

  const totalDetections = violationTotal + nonViolationTotal;
  const violationPercentage =
    totalDetections > 0
      ? ((violationTotal / totalDetections) * 100).toFixed(2)
      : "0.00";
  const nonViolationPercentage =
    totalDetections > 0
      ? ((nonViolationTotal / totalDetections) * 100).toFixed(2)
      : "0.00";

  return {
    totals: {
      violation: violationTotal,
      nonViolation: nonViolationTotal,
      totalDetections,
    },
    percentages: {
      violation: violationPercentage + "%",
      nonViolation: nonViolationPercentage + "%",
    },
    counts,
  };
}


async function getViolationByCamera (date = null, type = "today", startDate = null, endDate = null, id_camera = null) {
  try {
    console.log('📊 getViolationByCamera START - type:', type, 'date:', date, 'startDate:', startDate, 'endDate:', endDate, 'id_camera:', id_camera);
    
    const [cameras] = await dbApd.query("SELECT id, name, location FROM cameras");
    console.log('📷 Cameras loaded:', cameras.length);

    // 🧱 Inisialisasi summary tiap kamera
    const summary = {};
    cameras.forEach(cam => {
      summary[cam.id] = {
        id: cam.id,
        name: cam.name || `Camera ${cam.id}`,
        location: cam.location || 'Unknown',
        totals: { violation: 0, nonViolation: 0, totalDetections: 0 },
        percentages: { violation: "0.00%", nonViolation: "0.00%" }
      };
    });

    // 🕒 Tentukan filter waktu berdasarkan type
    let whereClause = "";
    let params = [];

    switch (type) {
      case "yesterday":
        whereClause = "WHERE DATE(timestamp) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
        break;

      case "week":
        // Ambil 7 hari terakhir (termasuk hari ini)
        whereClause = "WHERE timestamp >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
        break;

      case "month":
        // Ambil data bulan ini
        whereClause = `
          WHERE YEAR(timestamp) = YEAR(CURDATE())
          AND MONTH(timestamp) = MONTH(CURDATE())
        `;
        break;

      case "custom":
        if (startDate && endDate) {
          whereClause = "WHERE DATE(timestamp) BETWEEN ? AND ?";
          params.push(startDate, endDate);
        } else {
          whereClause = "WHERE DATE(timestamp) = CURDATE()"; // fallbacka
        }
        break;

      case "today":
      default:
        // Gunakan parameter date jika ada, jika tidak gunakan hari ini
        const targetDate = date || new Date().toISOString().split('T')[0];
        whereClause = "WHERE DATE(timestamp) = ?";
        params.push(targetDate);
        break;
    }

    if (id_camera) {
      whereClause += " AND id_camera = ?";
      params.push(parseInt(id_camera));
    }

    // 📦 Ambil data container sesuai filter waktu
    const [rows] = await dbApd.query(
      `
        SELECT id_camera, detected_container_id
        FROM container
        ${whereClause}
      `,
      params
    );
    
    console.log('📦 Container rows found:', rows.length);

    // 🚨 Tentukan kriteria pelanggaran
    const violationCriteria = ["No Hardhat", "No Mask", "No Glove"];
    const ignoreLabels = ["Person"]; // abaikan label Person

    // 🔄 Iterasi data container
    rows.forEach(row => {
      if (!row.detected_container_id) return;

      const cameraSummary = summary[row.id_camera];
      if (!cameraSummary) return;

      const labels = row.detected_container_id
        .split(",")
        .map(l => l.trim())
        .filter(l => l.length > 0);

      labels.forEach(label => {
        if (ignoreLabels.includes(label)) return;

        if (violationCriteria.includes(label)) {
          cameraSummary.totals.violation += 1;
        } else {
          cameraSummary.totals.nonViolation += 1;
        }
        cameraSummary.totals.totalDetections += 1;
      });
    });

    // 📊 Hitung persentase per kamera
    Object.values(summary).forEach(cam => {
      const { violation, nonViolation, totalDetections } = cam.totals;
      cam.percentages.violation =
        totalDetections > 0
          ? ((violation / totalDetections) * 100).toFixed(2) + "%"
          : "0.00%";
      cam.percentages.nonViolation =
        totalDetections > 0
          ? ((nonViolation / totalDetections) * 100).toFixed(2) + "%"
          : "0.00%";
    });

    // Konversi object ke array untuk response
    const result = Object.values(summary);
    console.log('✅ getViolationByCamera SUCCESS - cameras returned:', result.length);
    
    return result;
  } catch (error) {
    console.error('❌ getViolationByCamera ERROR:', error.message);
    throw error;
  }
}

module.exports = {
  getAllContainer,
  getLastContainer,
  getCountPerHour,
  getTotalDetection,
  getViolationSummary,
  getViolationByCamera,
  getCountPerWeek
};