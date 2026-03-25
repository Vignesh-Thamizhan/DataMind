const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
});

const queryLimiter = rateLimit({
  windowMs: parseInt(process.env.QUERY_RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 min
  max: parseInt(process.env.QUERY_RATE_LIMIT_MAX_REQUESTS) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Query rate limit exceeded. Please wait a minute." },
});

module.exports = { generalLimiter, queryLimiter };
