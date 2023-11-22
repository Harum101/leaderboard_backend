const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true },
  linkedin_url: { type: String, required: true },
  profile_image: { type: String },
  years_of_experience: { type: Number, default: 0 },
  availability: { type: String },
  badge: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  achievements: [
    {
      mainTitle: {
        type: String,
      },
      subparts: [
        {
          subTitle: {
            type: String,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
