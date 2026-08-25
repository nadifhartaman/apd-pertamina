const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// =====================================================
// DEMO MODE
// Saat DEMO_MODE=true, verifikasi token di-bypass dan request langsung
// diberi user demo. Gunakan HANYA untuk demo. JANGAN aktifkan di production.
// =====================================================
const DEMO_MODE = process.env.DEMO_MODE === "true";
const DEMO_USER = {
  id: parseInt(process.env.DEMO_USER_ID || "1", 10),
  username: process.env.DEMO_USER_NAME || "demo",
  roles: [{ name: "admin" }],
};

if (DEMO_MODE) {
  console.warn("⚠️  DEMO_MODE AKTIF: autentikasi di-bypass (user demo). JANGAN gunakan di production!");
}

function authMiddleware(req, res, next) {
  // Bypass penuh saat demo mode
  if (DEMO_MODE) {
    req.user = DEMO_USER;
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = decoded;
    next();
  });
}

module.exports = authMiddleware;
