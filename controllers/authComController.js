const { body, validationResult } = require("express-validator");
const Company = require("../models/company");
const Token = require("../models/token");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// REGISTER COMPANY
exports.createCompany = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid Input");
    err.status = 400;
    console.log(err);
    return next(err);
  }
  const company = await Company.findOne({ email: req.body.email });
  if (company) {
    // CHECKING IF EMAIL EXISTS ALREADY
    const err = new Error("Email already exists.");
    err.status = 409;
    return next(err);
  } else {
    // HASING PASSWORD
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    // SAVING COMPANY
    const company = new Company({
      name: req.body.name,
      contact: req.body.contact,
      email: req.body.email,
      company_name: req.body.company_name,
      company_website: req.body.company_website,
      no_of_employees: req.body.no_of_employees,
      industry: req.body.industry,
      password: hashPassword,
    });
    // SAVING COMPANY
    company.save(function (err) {
      if (err) {
        return next(err);
      }
    });
    const token = await new Token({
      userId: company._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}/authCom/${company._id}/verify/${token.token}`;

    const emailSentSuccessfully = await sendEmail(
      company.email,
      "Verify Your Email to Finish Signing Up for LOGIXOS",
      `<h3>Thank you for choosing LOGIXOS.</h3>
      <p>Please click on the link below to verify your email</p>
      <a href="${url}">Verify Email</a>`
    );

    res.send(emailSentSuccessfully);
  }
};

// VERIFY COMPANY EMAIL
exports.verifyEmail = async (req, res, next) => {
  try {
    const company = await Company.findOne({ _id: req.params.id });
    if (!company) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: company._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send({ message: "Invalid link" });

    await Company.updateOne({ _id: company._id }, { $set: { verified: true } });

    await token.remove();

    res.status(200).send({ message: "Email Verified Successfully!" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};
// LOGIN COMPANY
exports.authCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ email: req.body.email });

    if (!company)
      return res.status(401).send({ message: "Invalid Email or Password" });

    const validPassword = await bcrypt.compare(
      req.body.password,
      company.password
    );
    if (!validPassword)
      return res.status(401).send({ message: "Invalid Email or Password" });

    if (!company.verified) {
      let token = await Token.findOne({ userId: company._id });
      if (!token) {
        token = await new Token({
          userId: company._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const url = `${process.env.BASE_URL}/authCom/${company._id}/verify/${token.token}`;
      await sendEmail(
        company.email,
        "Verify Your Email to Finish Signing Up for LOGIXOS",
        `<h3>Thank you for choosing LOGIXOS.</h3>
      <p>Please click on the link below to verify your email</p>
      <a href="${url}">Verify Email</a>`
      );

      return res.status(400).send({
        message: "An Email was sent to your account. Please verify first.",
      });
    }
    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      isAdmin: company.isAdmin,
      token: generateToken(company._id),
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.getCompanyProfile = async (req, res, next) => {
  const company = await Company.findById(req.user._id);
  if (company) {
    res.json({
      _id: updatedCompany._id,
      name: updatedCompany.name,
      email: updatedCompany.email,
      isAdmin: updatedCompany.isAdmin,
    });
  } else {
    res.status(404).send("User Not Found");
  }
};
