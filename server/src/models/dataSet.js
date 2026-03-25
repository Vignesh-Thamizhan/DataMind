const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
  },
  { _id: false }
);

const datasetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["csv", "json", "xlsx", "xls", "parquet"],
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    rowCount: {
      type: Number,
      default: 0,
    },
    columns: [columnSchema],
    status: {
      type: String,
      enum: ["uploading", "processing", "ready", "error"],
      default: "uploading",
    },
    errorMessage: {
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

module.exports = mongoose.model("Dataset", datasetSchema);
