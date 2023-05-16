const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      rquired: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    cause: {
      type: String,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      rquired: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dispute = connection.model("Dispute", Schema);

module.exports = Dispute;
