const { body } = require("express-validator");
const ValidationConstants = require("../constants/validation.constant");
const ValidationHelper = require("../helpers/validator.helper");

const TokenValidator = {};

TokenValidator.exchangeRefreshTokenForAccessToken = [
  body("refreshToken", "Refresh Token is empty or invalid").exists(),
  ValidationHelper.errorHandler,
];

module.exports = TokenValidator;
