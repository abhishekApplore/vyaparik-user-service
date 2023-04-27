const connection = require("../config/database");
const mongoose = require("mongoose");

const MODEL_NAME = "AuthOtp";
const Schema = mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
    },

    email: {
      type: String,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    count: {
      type: Number,
      default: 1,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "auth-otps",
  }
);

const Otp = connection.model(MODEL_NAME, Schema);

module.exports = Otp;
