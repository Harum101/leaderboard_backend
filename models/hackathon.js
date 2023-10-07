const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
  hackathonTitle: { type: String, required: true },
  hackathonDescription: { type: String, required: true },
  targetAudience: { type: String, required: true },
  hackathonDate: { type: Date, required: true },
  hackathonPrize: { type: String, required: true },
});

module.exports = mongoose.model("Hackathon", hackathonSchema);
