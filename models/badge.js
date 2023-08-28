const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
  badge_name: { type: String, required: true },
  badge_image: { type: String, required: true },
});

module.exports = mongoose.model("Badge", BadgeSchema);
