

const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    

    notification: {
      type: Boolean,
      default:false
    },
    gpsTrack: {
      type: Boolean,
      default:false
    },
  },
  {
    timestamps: true,
  }
);

const Setting = connection.model("Setting", Schema);

module.exports = Setting;

