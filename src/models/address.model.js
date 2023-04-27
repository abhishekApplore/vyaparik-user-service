// const connection = require("../config/database");
// const mongoose = require("mongoose");

// const Schema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//     },
//   },
//   {
//     mobile: {
//       type: String,
//     },
//   },
//   {
//     pincode: {
//       type: String,
//     },
//     state: {
//       type: String,
//     },
//     address: {
//       type: String,
//     },
//     locality: {
//       type: String,
//     },
//     city: {
//       type: String,
//     },
//   },
//   {
//     type: {
//       type: String,
//     },
//   },
//   {
//     default: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   //Id of owner of card
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//     },
//   },
//   {
//     timeStamps: true,
//   }
// );

// const Address = connection.model("Address", Schema);

// module.exports = Address;

const connection = require("../config/database");
const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    pincode: {
      type: Number,
    },
    locality: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    type: {
      type: String,
    },
    address: {
      type: String,
    },
    default: {
      type: Boolean,
      default: false,
    },
    delete: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const Address = connection.model("address", Schema);

module.exports = Address;
