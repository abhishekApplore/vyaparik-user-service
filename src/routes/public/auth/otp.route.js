const {
  loginOrRegisterWithOTP,
  sendOTP,
  verifyOTP,
} = require("../../../controllers/auth.controller");

const { AsyncHandler } = require("../../../helpers/utils.helper");
const OtpValidator = require("../../../validators/otp.validator");

const otpRoute = require("express").Router();

otpRoute.post(
  "/verify/login",
  // OtpValidator.loginOrRegisterWithOTP,
  AsyncHandler(loginOrRegisterWithOTP)
); //  Login user or create a user if not found
otpRoute.post(
  "/send",
  //  OtpValidator.sendOTP,
  AsyncHandler(sendOTP)
); //  Sends OTP to a mobile number for both LOGIN and REGISTRATION
otpRoute.post(
  "/verify/otp",
  //validator
  AsyncHandler(verifyOTP)
);

module.exports = otpRoute;
