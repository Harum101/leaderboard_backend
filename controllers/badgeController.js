const { body, validationResult } = require("express-validator");
const Badge = require("../models/badge");

exports.getBadgeList = (req, res, next) => {
  Badge.find({})
    .sort({ badge_name: 1 })
    .exec(function (err, badge_list) {
      if (err) {
        return next(err);
      }
      res.json(badge_list);
    });
};

exports.getBadgeById = (req, res, next) => {
  Badge.findById(req.params.id).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    res.json(result);
  });
};

exports.createBadge = [
  // body("badge_name").trim().isLength({ min: 1 }).escape(),
  // body("badge_image").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Invalid Input");
      err.status = 400;
      return next(err);
    }
    const badge = new Badge({
      badge_name: req.body.badge_name,
      badge_image: req.file.filename,
    });
    badge.save(function (err) {
      if (err) {
        return next(err);
      }
      return res.json({ badge_id: badge._id });
    });
  },
];

exports.deleteBadgeById = (req, res, next) => {
  Badge.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      return next(err);
    }
    res.json({ message: "Deletion Successful" });
  });
};

exports.updateBadgeById = [
  body("badge_name").trim().isLength({ min: 1 }).escape(),
  body("badge_pic_url").trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const badge = new Badge({
      _id: req.params.id,
      badge_name: req.body.badge_name,
      badge_pic_url: req.body.badge_pic_url,
    });

    if (!errors.isEmpty()) {
      res.json({ message: errors.array() });
    }
    Badge.findByIdAndUpdate(req.params.id, badge, function (err) {
      if (err) {
        return next(err);
      }
      res.json({ message: "Update Successful" });
    });
  },
];
