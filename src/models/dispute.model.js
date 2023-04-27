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
      // default: "Pending",
    },
    cause: {
      type: String,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const Dispute = connection.model("Dispute", Schema);

module.exports = Dispute;
