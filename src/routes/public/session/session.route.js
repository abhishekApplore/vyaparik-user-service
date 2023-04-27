const {
  createSession,
  getSessionStatus,
} = require("../../../controllers/session.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");

const router = require("express").Router();

router.post("/login", AsyncHandler(getSessionStatus));
router.post("/", AsyncHandler(createSession));

module.exports = router;
