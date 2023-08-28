const { body, validationResult } = require("express-validator");
const Company = require("../models/company");
const bcrypt = require("bcrypt");

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
    console.log(err);
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
      return res.json({ company_id: company._id });
    });
  }
};
