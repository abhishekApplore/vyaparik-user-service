const Auth = require("../../../middlewares/auth.middleware");

const { topSeller } = require("../../../controllers/user.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");
const ConditionalAuthMiddleware = require("../../../middlewares/conditionalAuthMiddleware");

const userRoute = require("express").Router();

userRoute.get(
  "/top/seller",
  AsyncHandler(ConditionalAuthMiddleware),
  AsyncHandler(topSeller)
);
module.exports = userRoute;
