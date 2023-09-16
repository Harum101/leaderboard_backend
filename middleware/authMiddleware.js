// This middleware validates the token
const jwt = require("jsonwebtoken");
const Company = require("../models/company");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = await Company.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      console.error(err);
      res.status(401).send("Not Authorized - Token Failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized - No Token");
  }
};

module.exports = protect;
