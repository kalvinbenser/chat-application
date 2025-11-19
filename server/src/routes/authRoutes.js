const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", checkAuth, authController.profile);
router.get("/list", checkAuth, authController.getAllUser);

module.exports = router;
