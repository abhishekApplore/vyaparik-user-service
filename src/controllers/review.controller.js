const HttpError = require("../helpers/HttpError");
const Response = require("../Response"); // custom Response Object to Handle All API Reponse
const ReviewService = require("../services/review.service");

const addReview = async (req, res) => {
  try {
    const newReview = await ReviewService.createReview({
      review: req.body.review,
      rating: req.body.rating,
      storeId: req.body.storeId,
      userId: req.user.uid,
    });

    Response(res)
      .status(200)
      .message("Review Added Successfully")
      .body(newReview)
      .send();
  } catch (error) {
    throw new HttpError(400,error.message);
  }
};
const getReviewsOfParticularUser = async (req, res) => {
  try {
    const reviews = await ReviewService.find({ userId: req.params.id });
    Response(res).status(200).body(reviews).send();
  } catch (error) {
    throw new HttpError(400,error.message);
  }
};
const getReviewsOfParticularSeller = async (req, res) => {
  try {
    const reviews = await ReviewService.find({ storeId: req.params.id });

    Response(res).status(200).body(reviews).send();
  } catch (error) {
    throw new HttpError(400,error.message);
  }
};

module.exports = {
  addReview,
  getReviewsOfParticularUser,
  getReviewsOfParticularSeller
};
