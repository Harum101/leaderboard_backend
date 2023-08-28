var express = require("express");
var router = express.Router();
var multer = require("multer");

const userController = require("../controllers/userController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/profilePictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* GET users listing. */
router.get("/", userController.getUsersList);

router.post(
  "/create",
  upload.single("profile_image"),
  userController.createUser
);

router.get("/get-all-skills", userController.getAllUserSkills);

router.get("/:id/get-skills", userController.getUserSkills);

router.post("/:id/update-skills", userController.updateUserSkills);

router.post("/:id/add-badge", userController.addBadge);

router.post("/:id/delete", userController.deleteUserById);

router.get("/:id", userController.getUserById);

router.get("/get-by-name/:name", userController.getUsersByName);

module.exports = router;
