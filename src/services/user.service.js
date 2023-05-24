const Constant = require("../constants/Constant");
const mongoose = require("mongoose");
const Utils = require("../helpers/utils.helper");
const User = require("../models/user.model");
const Store = require("../models/store.model");
const Follower = require("../models/follower.model");
const UserService = {};
UserService.public = {};

UserService.blockUnblockById = async (id, isBlocked) => {
  try {
    await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      { isBlocked }
    );
    return true;
  } catch (err) {
    return false;
  }
};

UserService.updateBlockedTime = async (id) => {
  try {
    return await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(id),
      },
      { blockedTime: new Date().getTime() + 7 * 24 * 60 * 60 * 1000 },
      { new: true }
    ).lean();
  } catch (err) {
    return null;
  }
};

UserService.findById = async (
  id,
  allowedFields = [],
  { lean } = { lean: false }
) => {
  return User.findById(id, allowedFields).lean(lean);
};
UserService.find = () => {
  return User.find({ role: { $in: ["BUYER", "SELLER"] } });
};
UserService.topSellersViaFollowers = async (id) => {
  return User.aggregate([
    {
      $match: {
        type: "SELLER",
      },
    },
    {
      $lookup: {
        from: "followers",
        localField: "storeId",
        foreignField: "followingId",
        as: "followers",
      },
    },
    {
      $addFields: {
        sort: { $size: "$followers" },
      },
    },
    {
      $sort: {
        sort: -1,
      },
    },
  ]);
};

UserService.findByIdWithExtraDetails = (id) => {
  return User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(id) },
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

UserService.verifyPassword = async (mobileOrEmail, mode, password) => {
  var user;
  if (mode == Constant.TYPE_MOBILE) {
    user = await UserService.findByMobile(mobileOrEmail);
  } else {
    user = await UserService.findByEmail(mobileOrEmail);
  }
  console.log(user);
  if (!user) {
    throw new Error("User Not Found");
  } else {
    if (!user.password) {
      throw new Error("User Password Not Set");
    }

    return await user.comparePassword(password);
  }
};

UserService.updateProfile = async (
  id,
  { fullname, password, bio, picture, fcmTokens }
) => {
  const payload = { fullname, bio, picture, fcmTokens };

  if (password) {
    const user = await UserService.findById(id);
    // enable Password strategy
    if (!user.strategies.includes(Constant.User.Strategies.PASSWORD)) {
      user.strategies.push(Constant.User.Strategies.PASSWORD);
    }

    user.password = password;

    await user.save();
  }
  return await User.updateOne({ _id: id }, payload);
};

UserService.followUser = (uid, Id, type) => {
  Id = mongoose.Types.ObjectId(Id);
  uid = mongoose.Types.ObjectId(uid);
  if (type == "SELLER") {
    return Follower.create({ followingId: Id, userId: uid });
  } else {
    console.log("here", uid, Id);
    return Follower.create({ followingId: Id, userId: uid });
  }
};
UserService.followUserViaSeller = async (uid, Id = {}) => {
  // console.log('here',uid);
  const user = await UserService.findById(uid);
  if (!user) throw new Error("User not found");
  return Follower.create({ followingId: Id, userId: user._id });
};

UserService.unFollowUser = (uid, Id = {}) => {
  return Follower.findOneAndDelete({ followingId: Id, userId: uid });
};

UserService.followersList = async (userId) => {
  return Follower.find({ followingId: userId }).populate("userId");
};

UserService.followingList = async (userId) => {
  return Follower.aggregate([
    {
      $facet: {
        seller: [
          {
            $match: { userId: mongoose.Types.ObjectId(userId), type: "SELLER" },
          },
          {
            $lookup: {
              from: "stores",
              localField: "followingId",
              foreignField: "_id",
              as: "followingId",
            },
          },
        ],
        buyer: [
          {
            $match: { userId: mongoose.Types.ObjectId(userId), type: "BUYER" },
          },
          {
            $lookup: {
              from: "users",
              localField: "followingId",
              foreignField: "_id",
              as: "followingId",
            },
          },
        ],
      },
    },
  ]);
};

UserService.createSeller = async (id, store) => {
  console.log("createSeller", store);

  return User.findByIdAndUpdate(
    { _id: mongoose.Types.ObjectId(id) },
    { type: "SELLER", storeId: store._id },
    { new: true }
  ).lean();
};
UserService.findByMobile = async (mobile) => {
  return User.findOne({ mobile });
};

UserService.findByEmail = async (email) => {
  return User.findOne({ email });
};

UserService.findByGoogle = async (googleId) => {
  return User.findOne({ googleId });
};

UserService.findByFacebook = async (facebookId) => {
  return User.findOne({ facebookId });
};

UserService.create = async (data = {}) => {
  if (!data.username) {
    // try generating username
    data.username = Utils.random("U");
  }

  return User.create(data);
};

UserService.getSellerById = async (id) => {
  try {
    return User.aggregate([
      {
        $match: {
          type: "BUYER",
          _id: mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "stores",
          localField: "_id",
          foreignField: "user",
          as: "store",
          pipeline: [
            {
              $lookup: {
                from: "bankacconts",
                localField: "bankAccount",
                foreignField: "_id",
                as: "bankAccount",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      accountHolderName: 1,
                      accountNumber: 1,
                      ifsc: 1,
                      bankName: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "addresses",
                localField: "address",
                foreignField: "_id",
                as: "address",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      mobile: 1,
                      pincode: 1,
                      locality: 1,
                      state: 1,
                      city: 1,
                      address: 1,
                    },
                  },
                ],
              },
            },
            {
              $project: {
                _id: 0,
                name: 1,
                type: 1,
                gst: 1,
                bankAccount: { $first: "$bankAccount" },
                address: { $first: "$bankAccount" },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          fullname: 1,
          store: {
            $first: "$store",
          },
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

// public methods that filters public data for client access. Synced with app models.

UserService.public.user = [
  "fullname",
  "username",
  "picture",
  "email",
  "mobile",
  "strategies",
];

UserService.public.getUser = (user) => {
  return {
    _id: user._id,
    // storeId:
    fullname: user.fullname,
    username: user.username,
    picture: user.picture, // nullable
    email: user.email, // nullable
    mobile: user.mobile, // nullable
    strategies: user.strategies,
    type: user.type,
  };
};

UserService.profileSuggestion = async (data) => {
  return Store.find({ categories: data });
};

module.exports = UserService;
