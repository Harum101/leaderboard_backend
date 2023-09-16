var express = require("express");
var router = express.Router();

const authComController = require("../controllers/authComController");
const protect = require("../middleware/authMiddleware");

router.post("/register", authComController.createCompany);
router.post("/login", authComController.authCompany);
router.post("/profile", protect, authComController.getCompanyProfile);
router.get("/:id/verify/:token", authComController.verifyEmail);

module.exports = router;
