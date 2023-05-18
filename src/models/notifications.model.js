const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    tile: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "auth-otps",
  }
);

const Notifications = connection.model("notifications", Schema);

module.exports = Notifications;
