const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const CompanySchema = new Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  company_name: { type: String, required: true },
  company_website: { type: String, required: true },
  no_of_employees: { type: Number, required: true },
  industry: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

CompanySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// CompanySchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

module.exports = mongoose.model("Company", CompanySchema);
