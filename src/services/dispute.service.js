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
      $skip: (parseInt(pgNo) - 1) * parseInt(pgSize),
    },
    {
      $limit: parseInt(pgSize),
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "raisedBy",
        foreignField: "_id",
        as: "raisedBy",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $unwind: "$raisedBy",
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        raisedBy: { $first: "$raisedBy" },
        cause: { $first: "$cause" },
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
