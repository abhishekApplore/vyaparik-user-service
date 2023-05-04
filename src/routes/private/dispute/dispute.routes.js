const { AsyncHandler } = require("../../../helpers/utils.helper");
const DisputeController = require("../../../controllers/dispute.controller");
const dispute = new DisputeController();
const AuthMiddleware = require("../../../middlewares/auth.middleware");

const router = require("express").Router();

router.get(
  "/",
  AsyncHandler(AuthMiddleware),
  AsyncHandler(dispute.getAllDisputes)
);
router.post(
  "/raise/:id",
  AsyncHandler(AuthMiddleware),
  AsyncHandler(dispute.createDispute)
);
router.patch(
  "/update-status/:id",
  AsyncHandler(AuthMiddleware),
  AsyncHandler(dispute.updatesDisputeStatus)
);

module.exports = router;
