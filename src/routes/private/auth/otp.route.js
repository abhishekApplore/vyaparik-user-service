const {
  loginOrRegisterWithOTP,
  sendOTP,
} = require("../../../controllers/auth.controller");

const { AsyncHandler } = require("../../../helpers/utils.helper");
const OtpValidator = require("../../../validators/otp.validator");

const otpRoute = require("express").Router();

/**
 * @swagger
 * /api/user/polygon:
 *  get:
 *    tags: ["Polygon"]
 *    description: Use to request all Polygons
 *    responses:
 *      '200':
 *        description: Return List of Polygons
 */

otpRoute.post(
  "/verify",
  OtpValidator.loginOrRegisterWithOTP,
  AsyncHandler(loginOrRegisterWithOTP)
); //  Login user or create a user if not found
otpRoute.post("/send", OtpValidator.sendOTP, AsyncHandler(sendOTP)); //  Sends OTP to a mobile number for both LOGIN and REGISTRATION

module.exports = otpRoute;
