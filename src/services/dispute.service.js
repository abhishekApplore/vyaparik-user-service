const { default: mongoose } = require("mongoose");
const Dispute = require("../models/dispute.model");
const User = require("../models/user.model");
const { sendNotification } = require("../setup/notification");
const Constant = require("../constants/Constant");

const DisputeService = {};

DisputeService.create = (data = {}) => {
  return Dispute.create(data);
};

DisputeService.exists = (id) => {
  return Dispute.exists({ _id: id });
};

DisputeService.getAllDispute = ({ pageNumber, pageSize }) => {
  let pgNo = pageNumber;
  let pgSize = pageSize;
  if (!pageNumber) {
    pgNo = 1;
  }
  if (!pageSize) {
    pgSize = 1000;
  }
  return Dispute.aggregate([
    {
      $match: {
        isActive: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
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
      $lookup: {
        from: "users",
        localField: "raisedBy",
        foreignField: "_id",
        as: "raisedBy",
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
      $sort: {
        updatedAt: -1,
      },
    },
    {
      $project: {
        _id: 1,
        cause: 1,
        status: 1,
        user: { $first: "$user" },
        raisedBy: { $first: "$raisedBy" },
      },
    },
  ]);
};

DisputeService.markAsComplete = async (id) => {
  try {
    await Dispute.findByIdAndUpdate(id, { isActive: false });
    return true;
  } catch (err) {
    return false;
  }
};

DisputeService.sendWarning = async (id) => {
  try {
    const dispute = await Dispute.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { isActive: false },
      { new: true }
    ).lean();
    const user = await User.findById(dispute.userId).lean();
    if (user.fcmTokens) {
      await sendNotification(
        Constant.Notification.DISPUTE_WARNING.title,
        Constant.Notification.DISPUTE_WARNING.message,
        user.fcmTokens
      );
    }
    return true;
  } catch (err) {
    return false;
  }
};

DisputeService.blockUser = async (id) => {
  try {
    const dispute = await Dispute.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { isActive: false },
      { new: true }
    ).lean();
    const blockTime = new Date().getTime() + 24 * 7 * 60 * 60 * 1000;
    const user = await User.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(dispute.userId),
      },
      { blockTime },
      { new: true }
    ).lean();
    if (user.fcmTokens) {
      await sendNotification(
        Constant.Notification.DISPUTE_BLOCK.title,
        Constant.Notification.DISPUTE_BLOCK.message,
        user.fcmTokens
      );
    }
    return true;
  } catch (err) {
    return false;
  }
};

// DisputeService

module.exports = DisputeService;
