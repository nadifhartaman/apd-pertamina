const express = require("express");
const router = express.Router();
const { getContainers, getLastContainer, getTodayCountPerHour } = require("../controllers/apdController");
const { getCameras, getByCamera, addCamera, editCamera, removeCamera } = require("../controllers/cameraApdController");

// Route Camera
router.get("/camera/", getCameras);

router.get("/camera/:id", getByCamera);

router.post("/camera/", addCamera);

router.put("/camera/:id", editCamera);

router.delete("/camera/:id", removeCamera);

// Route Container
router.get("/", getContainers);

router.get("/last", getLastContainer);

router.get("/today-per-hour", getTodayCountPerHour);

module.exports = router;
