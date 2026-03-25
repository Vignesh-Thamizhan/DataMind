const router = require("express").Router();
const ctrl = require("../controllers/dataset");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/upload", auth, upload.single("file"), ctrl.upload);
router.get("/", auth, ctrl.list);
router.get("/:id", auth, ctrl.get);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
