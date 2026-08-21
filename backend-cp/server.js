require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apdRoutes = require("./routes/apdRoutes");
const authApdRoutes = require("./routes/authApdRoutes");
const authMiddleware = require("./middleware/authApdMiddleware");
const streamRoutes = require("./routes/streamRoutes");
const { initializeStreams } = require('./middleware/ffmpegService');
const { deleteOldData } = require('./models/apdModel');
const publicRoutes = require("./routes/publicRoutes");

const app = express();
app.use(express.json());

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use("/hls", express.static(path.join(__dirname, "hls")));

// routes

app.use("/api/auth", authApdRoutes);
app.use("/api/apd", authMiddleware, apdRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/stream", streamRoutes);

const printRoutes = () => {
  const stack = app._router?.stack || [];
  console.log("\n=== Registered Routes ===");
  stack.forEach((layer) => {
    // Direct route on app (layer.route)
    if (layer.route) {
      const methods = Object.keys(layer.route.methods).join(",").toUpperCase();
      console.log(`${methods} ${layer.route.path}`);
      return;
    }

    // Mounted router (layer.name may vary), inspect handle.stack
    const handleStack = layer.handle?.stack || layer?.handle;
    if (handleStack && Array.isArray(handleStack)) {x
      handleStack.forEach((handler) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(",").toUpperCase();
          // layer.regexp contains mount regexp; show it for context if needed
          const mount = layer.regexp ? layer.regexp.toString() : "";
          console.log(`${methods} ${mount} -> ${handler.route.path}`);
        }
      });
    }
  });
};

const PORT = process.env.PORT || 3001;
const ENABLE_HLS = process.env.ENABLE_HLS_CONVERSION !== 'false';
const AUTO_CLEANUP = process.env.AUTO_CLEANUP === 'true';

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  if (AUTO_CLEANUP) {
    const runCleanup = async () => {
      try {
        console.log("🧹 Auto Cleanup: Running task...");
        const result = await deleteOldData();
        if (result.affectedRows > 0) {
          console.log(`✔️ Auto Cleanup: Deleted ${result.affectedRows} records older than 3 months.`);
        } else {
          console.log("✔️ Auto Cleanup: No old records found.");
        }
      } catch (error) {
        console.error("❌ Auto Cleanup Failed:", error.message);
      }
    };

    // Run immediately on start
    await runCleanup();

    // Schedule to run every 24 hours
    setInterval(runCleanup, 24 * 60 * 60 * 1000);
    console.log("⏰ Auto Cleanup Schedule: Active (Every 24 hours)");
  }

  if (ENABLE_HLS) {
    console.log("HLS Conversion: ENABLED ✓");
    await initializeStreams();
  } else {
    console.log("HLS Conversion: DISABLED (Direct RTSP mode only)");
  }
  printRoutes();
});