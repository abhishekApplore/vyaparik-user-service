const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    emailNotification: {
      type: Boolean,
      default: true,
    },
    pushNotification: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Setting = connection.model("Setting", Schema);

module.exports = Setting;
