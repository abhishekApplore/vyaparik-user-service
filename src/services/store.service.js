const { default: mongoose } = require("mongoose");
const Store = require("../models/store.model");

const StoreService = {};

StoreService.create = (data = {}) => {
  return Store.create(data);
};

StoreService.exists = (id) => {
  return Store.exists({ _id: id });
};

StoreService.findById = (id) => {
  return Store.findById(id);
};
StoreService.topSellers = (uid, search) => {
  return Store.aggregate([
    {
      $match: {
        _id: { $ne: uid ? mongoose.Types.ObjectId(uid) : null },
        ...(search && {
          name: {
            $regex: search,
            $options: "i",
          },
        }),
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "userId",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "_id",
        foreignField: "followingId",
        as: "followers",
      },
    },
  ]);
};
StoreService.findOne = (data) => {
  return Store.findOne({ ...data });
};
StoreService.findByIdAndUpdate = (id, body) => {
  return Store.findByIdAndUpdate(id, { ...body }, { new: true });
};

StoreService.findExtraDetailsById = (uid, userId) => {
  return Store.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(uid),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "storeId",
        as: "products",
        pipeline: [
          {
            $count: "totalProducts",
          },
        ],
      },
    },
    {
      $addFields: {
        products: { $first: "$products.totalProducts" },
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "user",
        foreignField: "sellerId",
        as: "orders",
        pipeline: [
          {
            $match: {
              userId: mongoose.Types.ObjectId(userId),
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "user._id",
        foreignField: "userId",
        as: "followings",
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "user",
        foreignField: "followingId",
        as: "followers",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "followingId",
              foreignField: "_id",
              as: "userInfo",
              pipeline: [
                {
                  $project: {
                    _id: 1,
                    fullname: 1,
                    picture: 1,
                  },
                },
              ],
            },
          },
          {
            $project: {
              _id: { $first: "$userInfo._id" },
              fullname: { $first: "$userInfo.fullname" },
              picture: { $first: "$userInfo.picture" },
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "storeId",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "storeId",
        as: "rating",
        pipeline: [
          {
            $group: {
              _id: "$storeId",
              rating: { $avg: "$rating" },
            },
          },
          {
            $project: {
              _id: 0,
              rating: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        rating: { $first: "$rating.rating" },
      },
    },
  ]);
};

// StoreService

module.exports = StoreService;
