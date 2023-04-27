const { body } = require("express-validator");
const ValidationConstants = require("../constants/validation.constant");
const ValidationHelper = require("../helpers/validator.helper");

const OtpValidator = {};

OtpValidator.sendOTP = [
  // mobile: +91XXXXXXXXXX
  body("mobile", "Mobile Number is empty or invalid")
    .exists()
    .matches(ValidationConstants.REGEX_MOBILE_INTERNATIONAL),
  ValidationHelper.errorHandler,
];

OtpValidator.loginOrRegisterWithOTP = [
  body("mobile", "Mobile Number is empty or invalid")
    .exists()
    .matches(ValidationConstants.REGEX_MOBILE_INTERNATIONAL),
  body("otp", "OTP is required").notEmpty(),
  ValidationHelper.errorHandler,
];

module.exports = OtpValidator;
