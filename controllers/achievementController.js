const Achievement = require("../models/achievement");
const User = require("../models/user");

exports.createMainTitle = async (req, res, next) => {
  try {
    const { skillId, mainTitle } = req.body;

    Achievement.findOne({ skillId: skillId }, (err, existingSkill) => {
      if (err) {
        res.status(500).send("Error in checking for existing skill");
      } else {
        if (existingSkill) {
          existingSkill.achievements.push({
            mainTitle: mainTitle,
          });

          existingSkill.save((err) => {
            if (err) {
              res.status(500).send("Error Saving Achievement!");
            } else {
              res
                .status(200)
                .json({ message: "Achievement Title Added Successfully!" });
            }
          });
        } else {
          const newAchievement = new Achievement({
            skillId: skillId,
            achievements: [
              {
                mainTitle: mainTitle,
              },
            ],
          });

          newAchievement.save((err, savedAchievement) => {
            if (err) {
              res.status(500).send("Error Saving Achievement");
            } else {
              res
                .status(200)
                .json({ message: "Achievement Title Added Successfully" });
            }
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createSubTitle = async (req, res, next) => {
  try {
    const { skillId, mainTitleId, subTitle } = req.body;

    Achievement.find({ skillId: skillId }, (err, resultList) => {
      if (err) {
        res.status(500).json({ message: "Error getting list of achievements" });
      } else {
        const foundEntry = resultList[0].achievements.find((entry) =>
          entry._id.equals(mainTitleId)
        );

        if (foundEntry) {
          foundEntry.subparts.push({
            subTitle: subTitle,
          });
          resultList[0].save((err) => {
            if (err) {
              res.status(500).send("Error Saving Achievement Subtitle");
            } else {
              res
                .status(200)
                .json({ message: "Achievement Sub-Title Added Successfully" });
            }
          });
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createUserAchievements = async (req, res, next) => {
  try {
    const { userId, mainTitle, subTitle } = req.body;

    const existingUser = await User.findById(userId);

    if (existingUser) {
      const mainTitleExists = existingUser.achievements.find(
        (entry) => entry.mainTitle === mainTitle
      );

      if (mainTitleExists) {
        mainTitleExists.subparts.push({
          subTitle: subTitle,
        });
        existingUser.save();
      } else {
        existingUser.achievements.push({
          mainTitle: mainTitle,
          subparts: [{ subTitle: subTitle }],
        });
        existingUser.save();
      }
      res.status(200).json({ message: "Entries Added!" });
    } else {
      res.status(400).json({ message: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAchievements = async (req, res, next) => {
  try {
    Achievement.find({}, (err, achievementsList) => {
      if (err) {
        res.status(500).json({ message: "Error getting list of achievements" });
      } else {
        res.json(achievementsList);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
