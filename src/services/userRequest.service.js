const sellerRequest = require("../models/sellerRequest.model");

const sellerRequestService = {};

sellerRequestService.create = (data = {}) => {
  console.log(data);
  return sellerRequest.create(data);
};

sellerRequestService.exists = (id) => {
  return sellerRequest.exists({ _id: id });
};
sellerRequestService.update = (_id, fields) => {
  return sellerRequest.findByIdAndUpdate(_id, { ...fields });
};
sellerRequestService.getAllRequest = async (
  { status },
  { pageNumber, pageSize }
) => {
  const request = await sellerRequest.find();
  console.log(request);
  if (pageNumber && pageSize && status)
    return sellerRequest.aggregate([
      {
        $match: { status },
      },
      {
        $skip: (parseInt(pageNumber) - 1) * parseInt(pageSize),
      },
      {
        $limit: parseInt(pageSize),
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ]);
  else if (pageNumber && pageSize)
    return sellerRequest.aggregate([
      {
        $skip: (parseInt(pageNumber) - 1) * parseInt(pageSize),
      },
      {
        $limit: parseInt(pageSize),
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ]);
  else if (status)
    return sellerRequest.aggregate([
      {
        $match: { status },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ]);
  else
    return sellerRequest.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
    ]);
};

// userRequestService

module.exports = sellerRequestService;
