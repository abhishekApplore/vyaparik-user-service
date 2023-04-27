const {
  loginOrRegisterWithGoogle,
} = require("../../../controllers/auth.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");

const googleRoute = require("express").Router();

googleRoute.post("/verify", AsyncHandler(loginOrRegisterWithGoogle)); //  Login user or create a user if not found with Google

module.exports = googleRoute;
