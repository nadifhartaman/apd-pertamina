require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const apdRoutes = require("./routes/apdRoutes");
const authApdRoutes = require("./routes/authApdRoutes");
const authMiddleware = require("./middleware/authApdMiddleware");

const app = express();
app.use(express.json());

//middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// routes

app.use("/api/auth", authApdRoutes);
app.use("/api/apd", authMiddleware, apdRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
