const Review = require("../models/review.model");


const ReviewService = {};


ReviewService.createReview = (data = {}) => {
  return Review.create(data);
};
ReviewService.find = (filter) => {
  return Review.find({...filter}).populate("storeId userId");
}

//need to call from controller may be its called by user service 
ReviewService.getAvgRating = async(Id = {}) => {
  const rating= await Review.aggregate([
    {
      $match: {
        "storeId":mongoose.Types.ObjectId(Id)
      }
    },
    {
      $group: {
          _id: null,
          rate: {
              $avg: '$rating'
          }
      }
  }
  ])
  return rating
};


module.exports = ReviewService;
