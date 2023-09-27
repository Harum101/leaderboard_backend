const { body, validationResult } = require("express-validator");
const Hackathon = require("../models/hackathon");

exports.getHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findOne({});
    res.json(hackathon);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createHackathon = async (req, res, next) => {
  try {
    const { hackathonDate } = req.body;
    console.log(hackathonDate);

    // Validate the input date (you can add more validation)
    if (!hackathonDate || !Date.parse(hackathonDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Create or update the hackathon document in the database
    const existingHackathon = await Hackathon.findOne({});
    if (existingHackathon) {
      existingHackathon.hackathonDate = hackathonDate;
      await existingHackathon.save();
    } else {
      const newHackathon = new Hackathon({ hackathonDate });
      await newHackathon.save();
    }

    res.status(200).json({ message: "Hackathon date set successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteHackathon = async (req, res, next) => {
  try {
    const hackathon = await Hackathon.findOne({});
    await hackathon.remove();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
