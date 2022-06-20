const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput (data) {
  let errors = {};

  data.fname = !isEmpty(data.first_name) ? data.first_name : "";
  data.lname = !isEmpty(data.last_name) ? data.last_name : "";
  data.uname = !isEmpty(data.user_name) ? data.user_name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.psw = !isEmpty(data.password) ? data.password: "";
  data.repsw = !isEmpty(data.password2) ? data.password2 : "";

  // Name checks
  if (Validator.isEmpty(data.fname)) {
    errors.fname = "First Name field is required";
  }

  if (Validator.isEmpty(data.lname)) {
    errors.lname = "Last Name field is required";
  }

  if (Validator.isEmpty(data.uname)) {
    errors.uname = "Username field is required";
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }
  else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(data.psw)) {
    errors.psw = "Password field is required";
  }

  if (Validator.isEmpty(data.repsw)) {
    errors.repsw = "Confirm Password field is required";
  }

  if (!Validator.isLength(data.psw, { min: 6, max: 30 })) {
    errors.psw = "Password must be at least 6 characters";
  }

  if (!Validator.equals(data.psw, data.repsw)) {
    errors.repsw = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};