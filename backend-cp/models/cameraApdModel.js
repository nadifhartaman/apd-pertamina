const { dbApd } = require("../db");

async function getAllCameraStatus() {
  const [[statusSummary]] = await dbApd.query(
    `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) as online,
        SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline
     FROM cameras`
  );

  // Hasilnya mungkin berisi string, konversi ke angka untuk keamanan
  return {
    total: parseInt(statusSummary.total, 10),
    online: parseInt(statusSummary.online, 10) || 0,
    offline: parseInt(statusSummary.offline, 10) || 0,
  };
}

async function getAllCamera (page = 1, limit = 10) {
  const offset = (page - 1) * limit;

  const [rows] = await dbApd.query(
    "SELECT * FROM cameras LIMIT ? OFFSET ?",
    [limit, offset]
  );

  const [[{ total }]] = await dbApd.query(
    "SELECT COUNT(*) as total FROM cameras"
  );
  
  const statusSummary = await getAllCameraStatus();
  
  return {
    data: rows,
    pagination: {
      total,
      page,
      limit,
      statusSummary,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function getCameraById (id) {
  const [rows] = await dbApd.query(
    "SELECT * FROM cameras WHERE id = ?",
    [id]
  );

  return rows[0] || null;
}

async function createCamera (name, location, description, rtsp_url, status, resolution, channel) {
  const now = new Date();

  const [result] = await dbApd.query(
    `INSERT INTO cameras 
      (name, location, description, rtsp_url, status, created_at, updated_at, resolution, channel) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      location,
      description,
      rtsp_url,
      status,
      now,
      now,
      resolution,
      channel,
    ]
  );

  const cameraId = result.insertId;

  return {
    id: cameraId,
    name,
    location,
    description,
    rtsp_url,
    status,
    resolution,
    channel,
  };
}

async function updateCamera (id, name, location, description, ip_address, rtsp_url, status, resolution, channel) {
  const now = new Date();

  await dbApd.query(
    `UPDATE cameras 
     SET name = ?, location = ?, description = ?, ip_address = ?, rtsp_url = ?, 
         status = ?, updated_at = ?, resolution = ?, channel = ? 
     WHERE id = ?`,
    [
      name,
      location,
      description,
      ip_address,
      rtsp_url,
      status,
      now,
      resolution,
      channel,
      id,
    ]
  );

  return {
    id,
    name,
    location,
    description,
    ip_address,
    rtsp_url,
    status,
    resolution,
    channel,
  };
}

async function deleteCamera (id) {
  await dbApd.query("DELETE FROM cameras WHERE id = ?", id);
  return { message: "Camera APD deleted", id };
}

module.exports = { getAllCamera, createCamera, updateCamera, deleteCamera, getCameraById };
