var express = require("express");
var router = express.Router();
var multer = require("multer");

const badgeController = require("../controllers/badgeController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/badges");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", badgeController.getBadgeList);

router.post("/create", upload.single('badge_image'), badgeController.createBadge);

router.post("/:id/update", badgeController.updateBadgeById);

router.post("/:id/delete", badgeController.deleteBadgeById);

router.get("/:id", badgeController.getBadgeById);

module.exports = router;
