const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSkillSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  skill: { type: Schema.Types.ObjectId, ref: "Skill", required: true },
  skill_level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Experienced"],
    default: "beginner",
  },
  avatar_url: { type: String },
  score: { type: Number, required: true, default: 0 },
  rank: {type: String},
});

module.exports = mongoose.model("UserSkill", UserSkillSchema);
