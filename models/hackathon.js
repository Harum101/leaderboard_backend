const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
    hackathonDate: { type: Date, required: true },
});

module.exports = mongoose.model("Hackathon", hackathonSchema);
