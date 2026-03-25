const mongoose = require("mongoose");

const queryHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dataset",
      required: true,
    },
    datasetName: {
      type: String,
      default: "",
    },
    query: {
      type: String,
      required: true,
    },
    sql: {
      type: String,
      default: "",
    },
    rowCount: {
      type: Number,
      default: 0,
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
    model: {
      type: String,
      default: "",
    },
    provider: {
      type: String,
      default: "groq",
    },
    insight: {
      type: String,
      default: null,
    },
    chartType: {
      type: String,
      default: null,
    },
    duckdbId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QueryHistory", queryHistorySchema);
