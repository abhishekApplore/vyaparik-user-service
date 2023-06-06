const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    title: {
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
    collection: "notifications",
  }
);

const Notifications = connection.model("notifications", Schema);

module.exports = Notifications;
