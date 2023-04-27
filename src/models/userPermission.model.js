const connection = require("../config/database");
const mongoose = require("mongoose");

const MODEL_NAME = "UserPermission";
const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // Check all Module Rights in Project Documentation (README.md)
    moduleRights: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: "user-permissions",
  }
);

const UserPermission = connection.model(MODEL_NAME, Schema);

module.exports = UserPermission;
