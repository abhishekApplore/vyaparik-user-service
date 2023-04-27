const connection = require("../config/database");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const MODEL_NAME = "User";
const Schema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
    },

    fullname: {
      type: String,
      trim: true,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "#Add your bio",
    },

    picture: {
      type: String,
      default: null,
    },

    email: {
      type: String,
      trim: true,
      default: null,
    },

    mobile: {
      type: Number,
      trim: true,
      default: null,
    },

    type: {
      type: String,
      enum: ["BUYER", "SELLER", "ADMIN"],
      default: "BUYER",
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "store",
      default: null,
    },
    setting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "settings",
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    password: {
      type: String,
      default: null,
    },

    fcmTokens: {
      type: String,
    },

    // Authentication Strategies
    strategies: [
      {
        type: String,
        enum: [
          "EMAIL_OTP",
          "GOOGLE",
          "FACEBOOK",
          "APPLE",
          "MOBILE_OTP",
          "PASSWORD",
        ],
      },
    ],

    googleId: {
      type: String,
      default: null,
    },

    facebookId: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

Schema.pre("save", function (next) {
  var user = this;
  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

Schema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

const User = connection.model(MODEL_NAME, Schema);

module.exports = User;
