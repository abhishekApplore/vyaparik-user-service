/*

Middleware to verify token issued by firebase.
Uses Firebase-admin api to verify.

*/

const mongoose = require("mongoose");
const ErrorMessage = require("../constants/ErrorMessage");
const HttpError = require("../helpers/HttpError");
const TokenHelper = require("../helpers/Token.helper");
const userModel = require("../models/user.model");

const AuthMiddleware = async (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    throw new HttpError(401, ErrorMessage.STATUS_401_NO_TOKEN);
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    throw new HttpError(401, ErrorMessage.STATUS_401_NO_TOKEN);
  }

  const token = headerToken.split(" ")[1];

  try {
    const decodedValue = TokenHelper.verifyAccessToken(token);

    if (decodedValue) {
      const blockFlag = await userModel.findOne({
        _id: mongoose.Types.ObjectId(decodedValue._id),
        isBlocked: true,
      });
      if (blockFlag) {
        throw new HttpError(401, ErrorMessage.USER_BLOCKED);
      } else {
        req.user = decodedValue;
        console.log(req.user);
        return next();
      }
    }

    throw new HttpError(401, ErrorMessage.STATUS_401_INVALID_TOKEN);
  } catch (error) {
    console.log("Token Middleware Error: ", error.message);

    throw new HttpError(401, ErrorMessage.STATUS_401_INVALID_TOKEN);
  }
};

module.exports = AuthMiddleware;
