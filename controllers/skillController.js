const { body, validationResult } = require("express-validator");
const Skill = require("../models/skill");

exports.getSkillsList = (req, res, next) => {
  Skill.find({})
    .sort({ skill_name: 1 })
    .exec(function (err, skill_list) {
      if (err) {
        return next(err);
      }
      res.json(skill_list);
    });
};

exports.getSkillById = (req, res, next) => {
  Skill.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
};

exports.createSkill = [
  // body("skill_name").trim().isLength({ min: 1 }).escape(),
  // body("skill_pic_url").trim().isLength({ min: 1 }).escape(),
  // body("skill_level").trim().escape(),
  // body("avatar").trim().escape(),
  // body("score").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Invalid input");
      err.status = 400;
      console.log(err);
      return next(err);
    }
    const skill = new Skill({
      skill_name: req.body.skill_name,
      skill_image: req.file.filename,
    });
    skill.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({ skill_id: skill._id });
    });
  },
];

exports.deleteSkillById = (req, res, next) => {
  Skill.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Deletion Successful" });
  });
};

exports.updateSkillById = (req, res, next) => {
  res.send(`Update Skill: ${req.params.id}`);
};
