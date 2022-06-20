const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput (data) {
  let errors = {};

  data.uname = !isEmpty(data.user_name) ? data.user_name : "";
  data.psw = !isEmpty(data.password) ? data.password : "";

  // Username checks
  if (Validator.isEmpty(data.uname)) {
    errors.uname = "Username field is required";
  }

  // Password checks
  if (Validator.isEmpty(data.psw)) {
    errors.psw = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};