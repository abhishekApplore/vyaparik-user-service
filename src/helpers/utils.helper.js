// Contains all the utility functions needed
const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Utils = {};

Utils.newId = () => {
  return new mongoose.Types.ObjectId();
};

Utils.AsyncHandler = (controllerFunction) => (req, res, next) => {
  controllerFunction(req, res, next).catch(next);
};

// Add Utility functions here
Utils.customMongooseError = (error) => {
  //   const mongoose = require("mongoose");
  return error;
};

Utils.hasSubArray = (master, sub) => {
  return sub.every(
    (
      (i) => (v) =>
        (i = master.indexOf(v, i) + 1)
    )(0)
  );
};

Utils.validatePayload = (payload, allowed) => {
  return Object.keys(payload).map((el) => {
    return allowed.includes(el);
  });
};

Utils.setupNewAccount = async (user) => {
  return true;
};

Utils.uploadFile = async (file, fileName) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: "public/" + fileName,
    Body: file,
    ACL: "public-read",

    CreateBucketConfiguration: {
      LocationConstraint: process.env.AWS_REGION,
    },
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function (err, data) {
      if (err) {
        // console.log(err);
        return reject(err);
      }

      resolve(data.Location);
    });
  });
};

Utils.formatFile = async (file) => {
  try {
    const extension = file.name.split(".").pop();
    const fileName = `"xyz"-${Math.random()}.${extension}`;
    return fileName;
  } catch (err) {
    console.log(err);
  }
};

Utils.isImage = (file) => {
  const whitelist = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (whitelist.includes(file.mimetype)) {
    return true;
  }

  return false;
};

Utils.random = (pre = "", post) => {
  return pre + Math.floor(Math.random() * 100 + 10 + Date.now());
};

Utils.generateHashPassword = async (password, salt) => {
  try {
    return await bcrypt.hash(password, await bcrypt.genSalt(salt));
  } catch (err) {
    console.log(err);
  }
};

Utils.verifyHashPassword = async (password, hashPassword) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    console.log(error);
  }
};

module.exports = Utils;
