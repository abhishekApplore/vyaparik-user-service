const Constant = require("../constants/Constant");
const { default: mongoose } = require("mongoose");
const Utils = require("../helpers/utils.helper");
const User = require("../models/user.model");
const Store = require("../models/store.model");
const Follower = require("../models/follower.model");
const UserService = {};
UserService.public = {};

UserService.blockUnblockById = async (id, isBlocked) => {
  try {
    User.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      { isBlocked }
    );
    return true;
  } catch (err) {
    return false;
  }
};

UserService.findById = async (
  id,
  allowedFields = [],
  { lean } = { lean: false }
) => {
  return User.findById(id, allowedFields).lean(lean);
};
UserService.find = (id) => {
  return User.find({ _id: { $ne: id } });
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

  return User.findByIdAndUpdate(id, { type: "SELLER", storeId: store._id });
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
