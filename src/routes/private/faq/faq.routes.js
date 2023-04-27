const FaqController = require("../../../controllers/faq.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");

const faq = new FaqController();
const router = require("express").Router();
router.get("/", AsyncHandler(faq.find));
router.get("/:id", AsyncHandler(faq.findOne));
router.patch("/:id", AsyncHandler(faq.edit));
router.delete("/:id", AsyncHandler(faq.delete));
router.post("/", AsyncHandler(faq.create));
module.exports = router;
