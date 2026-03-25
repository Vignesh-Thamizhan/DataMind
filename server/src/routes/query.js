const router = require("express").Router();
const ctrl = require("../controllers/query");
const auth = require("../middleware/auth");
const { queryLimiter } = require("../middleware/rateLimiter");

router.post("/run", auth, queryLimiter, ctrl.runQuery);
router.get("/models", auth, ctrl.getModels);

module.exports = router;
