const { approveSession } = require("../../../controllers/session.controller");

const { AsyncHandler } = require("../../../helpers/utils.helper");

const router = require("express").Router();

router.post("/approve", AsyncHandler(approveSession));

module.exports = router;
