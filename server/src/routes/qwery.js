const router = require("express").Router();
const ctrl = require("../controllers/query");
const auth = require("../middleware/auth");

router.post("/", auth, ctrl.runQuery);

module.exports = router;