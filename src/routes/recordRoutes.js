const express = require("express");
const router = express.Router();
const controller = require("../controllers/recordsController");
const authMiddleware = require('../middleware/authMiddleware');

// Rotas públicas (Leitura)
router.get("/", controller.index);

// Rotas protegidas (Escrita/Deleção)
router.post("/", authMiddleware, controller.store);
router.delete("/:id", authMiddleware, controller.destroy);

module.exports = router;