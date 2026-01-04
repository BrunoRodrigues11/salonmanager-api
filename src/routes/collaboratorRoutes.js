const express = require("express");
const router = express.Router();
const controller = require("../controllers/collaboratorController");

router.get("/", controller.index);
router.post("/", controller.store);
router.delete("/:id", controller.destroy);

module.exports = router;
