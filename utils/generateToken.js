const jwt = require("jsonwebtoken");

module.exports = async = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

