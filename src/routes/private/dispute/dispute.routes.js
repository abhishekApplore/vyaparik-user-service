const { AsyncHandler } = require("../../../helpers/utils.helper");
const DisputeController = require("../../../controllers/dispute.controller");
const dispute = new DisputeController();

const router = require("express").Router();

router.get("/", AsyncHandler(dispute.getAllDisputes));
router.post("/raise/:id", AsyncHandler(dispute.createDispute));

module.exports = router;
