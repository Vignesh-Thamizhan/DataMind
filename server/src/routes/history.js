const router = require("express").Router();
const ctrl = require("../controllers/history");
const auth = require("../middleware/auth");

router.get("/", auth, ctrl.list);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
