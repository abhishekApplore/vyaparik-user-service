const router = require("express").Router();

const privateRouter = require("./private");
const publicRouter = require("./public/index");
const AuthMiddleware = require("../middlewares/auth.middleware");
const { AsyncHandler } = require("../helpers/utils.helper");

router.use(publicRouter);

// Authenticated Route

// router.use(AsyncHandler(AuthMiddleware));

router.use("/user", privateRouter);

module.exports = router;
