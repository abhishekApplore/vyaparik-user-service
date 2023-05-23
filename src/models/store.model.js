const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    picture: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "#Add your Bio",
    },
    gst: {
      type: String,
    },
    name: {
      type: String,
    },
    mobile: {
      type: String,
    },
    pincode: {
      type: String,
    },
    state: {
      type: String,
    },
    locality: {
      type: String,
    },
    city: {
      type: String,
    },
    ownerName: {
      type: String,
    },
    type: {
      type: String,
    },
    categories: {
      type: Array,
      default: [],
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    bankAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BankAccount",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    razorpayContactId: {
      type: String,
      default: "",
    },
    razorpayFundAccountId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Store = connection.model("Store", Schema);

module.exports = Store;
