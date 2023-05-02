const jwt = require("jsonwebtoken");
const fs = require("fs");
const {
  JWT_ACCESS_TOKEN_PRIVATE_KEY,
  JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_PRIVATE_KEY,
  JWT_REFRESH_TOKEN_EXPIRY,
  JWT_TRANSFER_TOKEN_PRIVATE_KEY,
  JWT_TRANSFER_TOKEN_EXPIRY,
} = require("../config");

const TokenHelper = {};

TokenHelper.createAccessToken = (uid, type, storeId) => {
  const token = jwt.sign({ uid, type, storeId }, JWT_ACCESS_TOKEN_PRIVATE_KEY, {
    // algorithm: "HS256",
    // expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
  });

  return token;
};

TokenHelper.createRefreshToken = (uid) => {
  const token = jwt.sign({ uid }, JWT_REFRESH_TOKEN_PRIVATE_KEY, {
    algorithm: "HS256",
    expiresIn: JWT_REFRESH_TOKEN_EXPIRY,
  });

  return token;
};

TokenHelper.createTransferToken = (session) => {
  const token = jwt.sign({ session }, JWT_TRANSFER_TOKEN_PRIVATE_KEY, {
    algorithm: "HS256",
    expiresIn: JWT_TRANSFER_TOKEN_EXPIRY,
  });

  return token;
};

TokenHelper.verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_TOKEN_PRIVATE_KEY);
};

TokenHelper.verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_TOKEN_PRIVATE_KEY);
};

TokenHelper.verifyTransferToken = (token) => {
  return jwt.verify(token, JWT_TRANSFER_TOKEN_PRIVATE_KEY);
};

module.exports = TokenHelper;
