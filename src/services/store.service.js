const { default: mongoose } = require("mongoose");
const Store = require("../models/store.model");

const StoreService = {};

StoreService.create = (data = {}) => {
  console.log("StoreService");
  return Store.create(data);
};

StoreService.exists = (id) => {
  return Store.exists({ _id: id });
};

StoreService.findById = (id) => {
  return Store.findById(id);
};
StoreService.topSellers = (uid) => {
  return Store.aggregate([
    {
      $match: {
        _id: { $ne: uid ? mongoose.Types.ObjectId(uid) : null },
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
    {
      $addFields: {
        rating: 0,
      },
    },
  ]);
};
StoreService.findOne = (data) => {
  return Store.findOne({ ...data });
};
StoreService.findByIdAndUpdate = (id, body) => {
  console.log({ id, body });
  return Store.findByIdAndUpdate(id, { ...body }, { new: true });
};

StoreService.findExtraDetailsById = (uid) => {
  return Store.aggregate([
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
      $match: {
        "user._id": mongoose.Types.ObjectId(uid),
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
        localField: "_id",
        foreignField: "followingId",
        as: "followers",
      },
    },
    {
      $addFields: {
        rating: 0,
      },
    },
  ]);
};

// StoreService

module.exports = StoreService;
