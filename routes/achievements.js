var express = require("express");
var router = express.Router();

const achievementController = require("../controllers/achievementController");

router.post("/createMainTitle", achievementController.createMainTitle);
router.post("/createSubTitle", achievementController.createSubTitle);
router.get("/getAchievements", achievementController.getAchievements);
router.post(
  "/createUserAchievements",
  achievementController.createUserAchievements
);

module.exports = router;
