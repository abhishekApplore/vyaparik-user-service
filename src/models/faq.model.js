const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    title: {
      type: String,
      trim: true,
    },
    body: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Faq = connection.model("Faq", Schema);

module.exports = Faq;
