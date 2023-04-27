const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
    },
  },
  {
    rejectReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const sellerRequest = connection.model("sellerRequest", Schema);

module.exports = sellerRequest;
