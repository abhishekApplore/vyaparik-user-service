const sessionRoute = require("./session/session.route");
const userRoute = require("./user/user.route");
const dispute = require("./dispute/dispute.routes");
const sellerRequestRoute = require("./sellerRequest/request.routes");
const reveiwUser = require("./review/review.routes");
const privateRouter = require("express").Router();
// Private Authenticated APIs
const faq = require("./faq/faq.routes");

privateRouter.use("/session", sessionRoute);
privateRouter.use("/dispute", dispute);
privateRouter.use("/faq", faq);
privateRouter.use("/requests/seller", sellerRequestRoute);
privateRouter.use("/review", reveiwUser);
privateRouter.use("/", userRoute);


module.exports = privateRouter;
