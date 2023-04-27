const { addReview, getReviewsOfParticularUser, getReviewsOfParticularSeller } = require("../../../controllers/review.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");

const router = require("express").Router();

router.post("/create",AsyncHandler(addReview));
router.get("/:id",AsyncHandler(getReviewsOfParticularUser));
router.get("/seller/:id",AsyncHandler(getReviewsOfParticularSeller));



module.exports = router;
