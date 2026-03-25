const QueryHistory = require("../models/QueryHistory");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

exports.list = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);

  const [history, total] = await Promise.all([
    QueryHistory.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("datasetId", "name fileType"),
    QueryHistory.countDocuments({ userId: req.user.id }),
  ]);

  res.json({
    success: true,
    history,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

exports.remove = asyncHandler(async (req, res, next) => {
  const item = await QueryHistory.findOne({ _id: req.params.id, userId: req.user.id });
  if (!item) return next(new AppError("History item not found", 404));
  await item.deleteOne();
  res.json({ success: true, message: "History item deleted" });
});
