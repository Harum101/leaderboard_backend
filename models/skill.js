const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SkillSchema = new Schema({
  skill_name: { type: String, required: true },
  skill_image: { type: String, required: true },
});

module.exports = mongoose.model("Skill", SkillSchema);
