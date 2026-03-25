const path = require("path");
const Dataset = require("../models/dataSet");
const QueryHistory = require("../models/QueryHistory");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const aiAgentService = require("../services/aiAgentService");
const logger = require("../config/logger");

exports.runQuery = asyncHandler(async (req, res, next) => {
  const { datasetId, query, model, provider } = req.body;

  if (!datasetId || !query) {
    return next(new AppError("datasetId and query are required", 400));
  }

  // Verify dataset belongs to user
  const dataset = await Dataset.findOne({ _id: datasetId, userId: req.user.id });
  if (!dataset) return next(new AppError("Dataset not found", 404));

  if (dataset.status !== "ready") {
    return next(new AppError("Dataset is not ready for querying", 400));
  }

  // Fallback: if duckdbId is missing, derive it from filename
  let duckdbId = dataset.duckdbId;
  if (!duckdbId) {
    logger.warn(`Dataset ${dataset._id} missing duckdbId. Deriving from filename: ${dataset.filename}`);
    // Derive from filename: "leads-1000_1774333031100.csv" -> "leads-1000_1774333031100"
    duckdbId = path.basename(dataset.filename, path.extname(dataset.filename));
    // Update the database for future requests
    await Dataset.findByIdAndUpdate(dataset._id, { duckdbId });
  }

  // Delegate to Python AI agent (use DuckDB ID, not MongoDB ID)
  const result = await aiAgentService.runQuery({
    dataset_id: duckdbId,
    query,
    model: model || undefined,
    provider: provider || "groq",
  });

  // Persist to history (non-fatal)
  try {
    await QueryHistory.create({
      userId: req.user.id,
      datasetId: dataset._id,
      datasetName: dataset.name,
      query,
      sql: result.sql || "",
      rowCount: result.row_count || 0,
      executionTimeMs: result.execution_time_ms || 0,
      model: model || "llama3-70b",
      provider: provider || "groq",
      insight: result.insight || null,
      chartType: result.chart?.chart_type || null,
      duckdbId: dataset.duckdbId,
    });
  } catch (_) {}

  res.json({ success: true, ...result });
});

exports.getModels = asyncHandler(async (req, res) => {
  const data = await aiAgentService.getModels();
  res.json({ success: true, ...data });
});
