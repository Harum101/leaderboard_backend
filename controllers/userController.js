const { body, validationResult } = require("express-validator");
const async = require("async");
const User = require("../models/user");
const UserSkill = require("../models/userSkill");
const Skill = require("../models/skill");
const Badge = require("../models/badge");

exports.getUsersList = (req, res, next) => {
  User.find({})
    .sort({ name: 1 })
    .populate("badge")
    .exec(function (err, user_list) {
      if (err) {
        return next(err);
      }
      res.json(user_list);
    });
};

exports.getUserById = (req, res, next) => {
  User.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
};

exports.getUsersByName = (req, res, next) => {
  User.find({ name: req.params.name })
    .sort({ name: 1 })
    .populate("badge")
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      res.json(result);
    });
};

exports.getAllUserSkills = (req, res, next) => {
  UserSkill.find({})
    .populate({ path: "user", populate: { path: "badge" } })
    .populate("skill")
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      res.json(result);
    });
};

exports.getUserSkills = (req, res, next) => {
  UserSkill.find({ user: req.params.id })
    .populate("skill")
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      res.json(result);
    });
};

exports.updateUserSkills = [
  body("skill").trim().escape(),
  body("skill_level").trim().escape(),
  body("avatar_url").trim().escape(),
  body("score").trim().escape(),

  (req, res, next) => {
    const errors = validationResult(body);
    // console.log(req.params.id);
    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }

    UserSkill.findOne({ user: req.params.id, skill: req.body.skill }).exec(
      function (err, result) {
        if (err) {
          return next(err);
        } //Record exists so update it.
        if (result) {
          const userSkll = {
            _id: result._id,
            user: result.user,
            skill: result.skill,
            skill_level: req.body.skill_level,
            avatar_url: req.body.avatar_url,
            score: req.body.score,
          };

          UserSkill.findByIdAndUpdate(result._id, userSkll, function (err) {
            if (err) {
              return next(err);
            }
            res.json({ userSkill_id: result._id });
          });
        }
        //No record so add new.
        else {
          const userSkill = new UserSkill({
            user: req.params.id,
            skill: req.body.skill,
            skill_level: req.body.skill_level,
            avatar_url: req.body.avatar_url,
            score: req.body.score,
          });
          userSkill.save(function (err) {
            if (err) {
              return next(err);
            }
            res.json({ userSkill_id: userSkill._id });
          });
        }
      }
    );
  },
];

exports.addBadge = [
  body("badge").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(body);

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }

    User.findById(req.params.id).exec(function (err, result) {
      if (err) {
        return next(err);
      }

      const user = {
        _id: result._id,
        name: result.name,
        email: result.email,
        linkedin_url: result.linkedin_url,
        profile_image: result.profile_image,
        years_of_experience: result.years_of_experience,
        availability: result.availability,
        badge: result.badge,
      };
      const index = user.badge.find((e) => e._id.toString() === req.body.badge);
      // console.log(index);
      // console.log(user.badge);
      // console.log(req.body);

      if (!index) {
        user.badge.push(req.body.badge);

        User.findByIdAndUpdate(req.params.id, user, function (err) {
          if (err) {
            return next(err);
          }
          res.json({ user_id: user._id });
        });
      } else {
        res.json({ user_id: user._id });
      }
    });
  },
];

exports.createUser = [
  // Convert skills and badges to an array.
  // (req, res, next) => {
  //   if (!Array.isArray(req.body.skill)) {
  //     req.body.skill =
  //       typeof req.body.skill === "undefined" ? [] : [req.body.skill];
  //   }

  // body("name").trim().isLength({ min: 1 }).escape(),
  // body("email").trim().isLength({ min: 1 }).escape(),
  // body("linkedin_url").trim().isLength({ min: 1 }).escape(),
  // body("profile_image").trim().isLength({ min: 1 }).escape(),
  // body("years_of_experience").trim().escape(),
  // body("availability").trim().isLength({ min: 1 }).escape(),
  // body("skill.*").escape(),

  (req, res, next) => {
    const errors = validationResult(body);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      linkedin_url: req.body.linkedin_url,
      profile_image: req.file.filename ? req.file.filename : "",
      years_of_experience: req.body.years_of_experience
        ? req.body.years_of_experience
        : "",
      availability: req.body.availability ? req.body.availability : "",
    });

    if (!errors.isEmpty()) {
      res.json({ errors: errors.array() });
    }
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.json({ user_id: user._id });
    });
  },
];

exports.deleteUserById = (req, res, next) => {
  User.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Deletion Successful" });
  });
};
