const Dispute = require("../models/dispute.model");

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

DisputeService.updateDispute = async (id, status) => {
  try {
    await Dispute.findByIdAndUpdate(id, { status });
    return true;
  } catch (err) {
    return false;
  }
};

// DisputeService

module.exports = DisputeService;
