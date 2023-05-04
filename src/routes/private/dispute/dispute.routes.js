const { AsyncHandler } = require("../../../helpers/utils.helper");
const DisputeController = require("../../../controllers/dispute.controller");
const dispute = new DisputeController();
const AuthMiddleware = require("../../../middlewares/auth.middleware");

const router = require("express").Router();

router.use(AsyncHandler(AuthMiddleware));

router.get("/", AsyncHandler(dispute.getAllDisputes));
router.post("/raise/:id", AsyncHandler(dispute.createDispute));
router.patch("/update-status/:id", AsyncHandler(dispute.updatesDisputeStatus));

module.exports = router;
