const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const messageController = require("../controllers/messageController");

router.get("/:id", checkAuth, messageController.getAllMessages);

module.exports = router;
