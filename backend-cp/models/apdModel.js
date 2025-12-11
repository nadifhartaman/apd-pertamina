const { dbApd } = require("../db");
const { differenceInDays, addDays, format, startOfMonth, endOfMonth } = require("date-fns");

const getAllContainer = async (limit, offset, type, startDate, endDate, id_camera) => {
  try {
    console.log('🔄 getAllContainer query starting...');

    let whereConditions = [];
    let params = [];

    const finalLimit = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10; // Default limit 10 if 0 or invalid
    const finalOffset = parseInt(offset, 10) || 0; // Default offset 0
    
    
    if (type === 'custom' && startDate && endDate) {
      whereConditions.push('c.timestamp BETWEEN ? AND ?');
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    }
    else if (type === 'month') {
      const startMonth = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const endMonth = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      
      whereConditions.push('c.timestamp BETWEEN ? AND ?');
      params.push(`${startMonth} 00:00:00`, `${endMonth} 23:59:59`);
    }
    else if (type === 'week') {
      // Get data for the current week (Monday to Sunday)
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert Sunday (0) to 6
      
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - daysFromMonday);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const startDateStr = format(weekStart, 'yyyy-MM-dd');
      const endDateStr = format(weekEnd, 'yyyy-MM-dd');
      
      whereConditions.push('c.timestamp BETWEEN ? AND ?');
      params.push(`${startDateStr} 00:00:00`, `${endDateStr} 23:59:59`);
    }
    else if (type === 'today') {
      const dateParam = startDate ? startDate.substring(0, 10) : new Date().toISOString().split('T')[0];
      
      whereConditions.push('c.timestamp BETWEEN ? AND ?');
      params.push(`${dateParam} 00:00:00`, `${dateParam} 23:59:59`);
    }
    else {
      whereConditions.push('DATE(c.timestamp) = CURDATE()');
    }


    if (id_camera) {
      const cameraId = parseInt(id_camera, 10);
      if (!isNaN(cameraId)) { 
        whereConditions.push('c.id_camera = ?');
        params.push(cameraId);
      }
    }


    const finalWhere = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        c.id, 
        c.detected_container_id, 
        c.timestamp, 
        c.id_camera, 
        c.image_frame,
        a.name AS camera_name, 
        a.location AS camera_location 
      FROM 
        container c
      JOIN 
        cameras a ON c.id_camera = a.id
      ${finalWhere}
      ORDER BY c.timestamp DESC
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM container c
      JOIN cameras a ON c.id_camera = a.id
      ${finalWhere}
    `;

    
    console.log('⏳ Executing data and count queries concurrently...');

    const [dataResult, countResult] = await Promise.all([
      dbApd.query(query, [...params, finalLimit, finalOffset]),
      dbApd.query(countQuery, params)
    ]);

    const [data] = dataResult;
    const [[{ total }]] = countResult;

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


// Fungsi pembantu untuk normalisasi label (lowercase dan hapus strip)
const normalizeLabel = (label) => {
  let normalized = label.toLowerCase().trim();

  normalized = normalized.replace(/-/g, ' ');

  normalized = normalized.replace(/\s\s+/g, ' ');

  return normalized;
};

const capitalizeLabel = (normalizedLabel) => {
  const parts = normalizedLabel.split(' ');
  const capitalizedParts = parts.map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedParts.join(' ');
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

  const IGNORE_LABEL = "person";

  const counts = {};
  let violationTotal = 0;
  let nonViolationTotal = 0;
  const violationCounts = {};

  rows.forEach(row => {
    if (!row.detected_container_id) return;

    const labels = row.detected_container_id
      .split(",")
      .map(l => l.trim())
      .filter(l => l.length > 0);

    labels.forEach(label => {

      const normalizedLabel = normalizeLabel(label);

      if (normalizedLabel === IGNORE_LABEL) return;

      const isViolation = normalizedLabel.includes("no ");

      const finalLabel = capitalizeLabel(normalizedLabel);

      if (counts[finalLabel] !== undefined) {
        counts[finalLabel] += 1;
      } else {
        counts[finalLabel] = 1;
      }

      if (isViolation) {
        violationTotal += 1;

        if (violationCounts[finalLabel] !== undefined) {
          violationCounts[finalLabel] += 1;
        } else {
          violationCounts[finalLabel] = 1;
        }
      } else {
        nonViolationTotal += 1;
      }
    });
  });

  // ... (Perhitungan persentase dan return tetap sama)
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
    violationCounts
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

    // 🕒 Tentukan filter waktu berdasarkan type (Bagian ini tetap sama)
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

    // 🚨 Tentukan kriteria pelanggaran BARU
    const IGNORE_LABEL = "person"; // Dalam bentuk lowercase

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
        // --- START MODIFIKASI NORMALISASI & LOGIKA ---

        const normalizedLabel = normalizeLabel(label);

        // 1. Abaikan label "person"
        if (normalizedLabel === IGNORE_LABEL) return;

        // 2. Cek apakah ini Pelanggaran (mengandung 'no ')
        const isViolation = normalizedLabel.includes("no ");

        // TALLY HANYA BERDASARKAN isViolation
        if (isViolation) {
          cameraSummary.totals.violation += 1;
        } else {
          cameraSummary.totals.nonViolation += 1;
        }

        cameraSummary.totals.totalDetections += 1;

        // --- END MODIFIKASI NORMALISASI & LOGIKA ---
      });
    });

    // 📊 Hitung persentase per kamera (Bagian ini tetap sama)
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