const multer = require("multer");
const path = require("path");
const fs = require("fs");
const AppError = require("../utils/AppError");

// Resolve dataset directory relative to project root
const PROJECT_ROOT = path.dirname(require.main.filename) === __dirname 
  ? path.join(__dirname, "../../..")  // When run from server/src
  : path.dirname(require.main.filename);
const DATASET_DIR = process.env.DATASET_DIR || path.join(PROJECT_ROOT, "datasets");

// Ensure directory exists
if (!fs.existsSync(DATASET_DIR)) {
  fs.mkdirSync(DATASET_DIR, { recursive: true });
}

const ALLOWED_TYPES = (
  process.env.ALLOWED_FILE_TYPES || "csv,json,xlsx,xls,parquet"
).split(",");

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 52428800; // 50MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, DATASET_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .substring(0, 60);
    cb(null, `${base}_${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  if (ALLOWED_TYPES.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `File type .${ext} not allowed. Supported: ${ALLOWED_TYPES.join(", ")}`,
        400
      ),
      false
    );
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });

module.exports = upload;
