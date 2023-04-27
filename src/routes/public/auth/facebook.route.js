const {
  loginOrRegisterWithFacebook,
} = require("../../../controllers/auth.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");

const facebookRoute = require("express").Router();

facebookRoute.post("/verify", AsyncHandler(loginOrRegisterWithFacebook)); //  Login user or create a user if not found with facebook

module.exports = facebookRoute;
