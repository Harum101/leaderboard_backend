var express = require("express");
var router = express.Router();

const hackathonController = require("../controllers/hackathonController");

router.post("/create", hackathonController.createHackathon);
router.delete("/delete", hackathonController.deleteHackathon);
router.get("/fetch", hackathonController.getHackathon);

module.exports = router;
