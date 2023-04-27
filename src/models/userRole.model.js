const connection = require("../config/database");
const mongoose = require("mongoose");

const MODEL_NAME = "UserRole";
const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserPermission",
      },
    ],

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
    collection: "user-roles",
  }
);

const UserRole = connection.model(MODEL_NAME, Schema);

module.exports = UserRole;
