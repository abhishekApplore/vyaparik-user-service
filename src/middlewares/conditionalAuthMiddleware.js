/*

Middleware to verify token issued by firebase.
Uses Firebase-admin api to verify.

*/

const ErrorMessage = require("../constants/ErrorMessage");
const HttpError = require("../helpers/HttpError");
const TokenHelper = require("../helpers/Token.helper");

const ConditionalAuthMiddleware = async (req, res, next) => {
  const headerToken = req.headers.authorization;

  if (!headerToken) {
    return next();
  }

  if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
    return next();
  }
  console.log("woking");
  const token = headerToken.split(" ")[1];
  console.log(token);

  try {
    const decodedValue = TokenHelper.verifyAccessToken(token);

    if (decodedValue) {
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
