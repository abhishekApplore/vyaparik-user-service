const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    followingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type:{
      type:String,
      default:"BUYER"
    }
  },
  {
    timestamps: true,
  }
);

const Follower = connection.model("Follower", Schema);

module.exports = Follower;
