const path = require("path");
const fs = require("fs");
const Dataset = require("../models/dataSet");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const aiAgentService = require("../services/aiAgentService");
const logger = require("../config/logger");

exports.upload = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded", 400));

  const { originalname, filename, path: filePath, size, mimetype } = req.file;
  const ext = path.extname(originalname).toLowerCase().replace(".", "");

  // Create initial DB record
  const dataset = await Dataset.create({
    userId: req.user.id,
    name: path.basename(originalname, path.extname(originalname)),
    filename,
    filePath,
    fileType: ext,
    fileSize: size,
    status: "processing",
  });

  // Trigger AI agent schema detection asynchronously (don't await — respond immediately)
  aiAgentService
    .detectSchema(filePath, ext)
    .then(async (schemaData) => {
      await Dataset.findByIdAndUpdate(dataset._id, {
        status: "ready",
        rowCount: schemaData.row_count || 0,
        columns: schemaData.columns || [],
        duckdbId: schemaData.dataset_id,
      });
      logger.info(`Dataset ${dataset._id} schema detected — ${schemaData.row_count} rows. DuckDB ID: ${schemaData.dataset_id}`);
    })
    .catch(async (err) => {
      logger.error(`Schema detection failed for dataset ${dataset._id}: ${err.message}`);
      await Dataset.findByIdAndUpdate(dataset._id, {
        status: "error",
        errorMessage: err.message,
      });
    });

  res.status(201).json({ success: true, ...dataset.toObject() });
});

exports.list = asyncHandler(async (req, res) => {
  const datasets = await Dataset.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, datasets });
});

exports.get = asyncHandler(async (req, res, next) => {
  const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user.id });
  if (!dataset) return next(new AppError("Dataset not found", 404));
  res.json({ success: true, dataset });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const dataset = await Dataset.findOne({ _id: req.params.id, userId: req.user.id });
  if (!dataset) return next(new AppError("Dataset not found", 404));

  // Remove file from disk
  if (fs.existsSync(dataset.filePath)) {
    fs.unlinkSync(dataset.filePath);
  }

  await dataset.deleteOne();
  res.json({ success: true, message: "Dataset deleted" });
});
