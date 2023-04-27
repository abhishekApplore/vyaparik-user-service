const {
  loginWithPassword,
  forgotPassword,
  resetPassword,
} = require("../../../controllers/auth.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");

const passwordRoute = require("express").Router();

passwordRoute.post("/", AsyncHandler(loginWithPassword)); //  Login user with password
passwordRoute.post("/forgot", AsyncHandler(forgotPassword));
passwordRoute.post("/reset", AsyncHandler(resetPassword));

module.exports = passwordRoute;
