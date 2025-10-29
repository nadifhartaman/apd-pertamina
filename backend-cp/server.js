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

const app = express();
app.use(express.json());

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/hls", express.static(path.join(__dirname, "hls")));

// routes

app.use("/api/auth", authApdRoutes);
app.use("/api/apd", authMiddleware, apdRoutes);
app.use("/api/stream", streamRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  initializeStreams();
});
