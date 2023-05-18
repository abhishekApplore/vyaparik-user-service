/*

Middleware to verify token issued by firebase.
Uses Firebase-admin api to verify.

*/

const ErrorMessage = require("../constants/ErrorMessage");
const HttpError = require("../helpers/HttpError");
const TokenHelper = require("../helpers/Token.helper");
const userModel = require("../models/user.model");
const Response = require("../Response");
const mongoose = require("mongoose");

const ConditionalAuthMiddleware = async (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return next();
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    return next();
  }
  const token = headerToken.split(" ")[1];

  try {
    const decodedValue = TokenHelper.verifyAccessToken(token);
    const user = await userModel.findOne({
      _id: mongoose.Types.ObjectId(decodedValue.uid),
    });
    if (user?.isBlocked || new Date().getTime() <= user?.blockTime) {
      Response(res)
        .status(401)
        .body({ isBlocked: true })
        .message(ErrorMessage.USER_BLOCKED)
        .send();
    } else {
      req.user = decodedValue;
      return next();
    }
    throw new HttpError(401, ErrorMessage.STATUS_401_INVALID_TOKEN);
  } catch (error) {
    console.log("Token Middleware Error: ", error.message);
    throw new HttpError(401, ErrorMessage.STATUS_401_INVALID_TOKEN);
  }
};

module.exports = ConditionalAuthMiddleware;
