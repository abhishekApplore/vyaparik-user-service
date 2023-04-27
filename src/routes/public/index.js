const facebookRoute = require("./auth/facebook.route");
const googleRoute = require("./auth/google.route");
const otpRoute = require("./auth/otp.route");
const passwordRoute = require("./auth/password.route");
const tokenRoute = require("./auth/token.route");

const sessionRoute = require("./session/session.route");
const userRoute = require("./user/user.routes");

const publicRouter = require("express").Router();

// Authentication APIs
publicRouter.use("/auth/password", passwordRoute); // handles both Login using password
publicRouter.use("/auth/facebook", facebookRoute); // handles both Login and registration using Facebook
publicRouter.use("/auth/google", googleRoute); // handles both Login and registration using Google
publicRouter.use("/auth/otp", otpRoute); // handles both Login and registration using OTP
publicRouter.use("/auth/token", tokenRoute); // token routes

// Other Public APIs
publicRouter.use("/public/user", userRoute);
publicRouter.use("/session", sessionRoute);

module.exports = publicRouter;
