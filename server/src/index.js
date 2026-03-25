require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const logger = require("./config/logger");
const { generalLimiter } = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter);

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/datasets", require("./routes/dataset"));
app.use("/api/query",    require("./routes/query"));
app.use("/api/history",  require("./routes/history"));
app.use("/api/qwery",    require("./routes/qwery"));

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", service: "DataMind Server" }));

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
});