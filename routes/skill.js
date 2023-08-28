var express = require("express");
var router = express.Router();
var multer = require("multer");

const skillController = require("../controllers/skillController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/skills");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.get("/", skillController.getSkillsList);

router.post(
  "/create",
  upload.single("skill_image"),
  skillController.createSkill
);

router.post("/:id/update", skillController.updateSkillById);

router.post("/:id/delete", skillController.deleteSkillById);

router.get("/:id", skillController.getSkillById);

module.exports = router;
