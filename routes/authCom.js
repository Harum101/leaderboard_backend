var express = require("express");
var router = express.Router();

const authComController = require("../controllers/authComController");

router.post("/register", authComController.createCompany);

module.exports = router;
