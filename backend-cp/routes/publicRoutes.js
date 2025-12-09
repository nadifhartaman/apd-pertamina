const express = require("express");
const router = express.Router();
const { getCameras, getCamerasPublic } = require("../controllers/cameraApdController");

// Route Camera
router.get("/camera/", getCamerasPublic);


module.exports = router;