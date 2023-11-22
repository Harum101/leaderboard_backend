const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MainTitleSchema = new Schema({
    mainTitle: {
      type: String,
    },
    subparts: [
      {
        subTitle: {
          type: String
        }
      }
    ],
});
  
const AchievementSchema = new Schema({
    skillId: {
      type: String,
    },
    achievements: [MainTitleSchema],
});

module.exports = mongoose.model("Achievement", AchievementSchema);

