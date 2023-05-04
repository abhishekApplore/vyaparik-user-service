const Constant = require("../constants/Constant");
const moment = require("moment");
const SmsHelper = require("../helpers/Sms.helper");
const Otp = require("../models/otp.model");
const EmailHelper = require("../helpers/Email.helper");
const { PROJECT_NAME } = require("../config");

const OTPService = {};

OTPService.send = async (mobileOrEmail, mode, user) => {
  var mobile, email;
  var query = {};
  if (mode == Constant.TYPE_EMAIL) {
    email = mobileOrEmail;
    query = { email };
  } else {
    mobile = mobileOrEmail;
    query = { mobile };
  }

  // var otp = Math.floor(1000 + Math.random() * 9000);
  var otp = "1234";

  var otpObject = await Otp.findOne(query);

  if (!otpObject) {
    // create new otp.

    // console.log("New OTP created");
    Otp.create({ ...query, otp, user });
  } else {
    // update otp

    var diffInSeconds = moment
      .duration(moment().diff(otpObject.updatedAt))
      .asSeconds();
    // console.log("Differencce in seconds", diffInSeconds);
    if (
      diffInSeconds / (60 * 60 * 24) >=
      1 // seconds to Day
      // otpObject.count == Constant.OTP_DAILY_RETRY_LIMIT
    ) {
      console.log("Reset the OTP Limit");
      otpObject.count = 0;
      diffInSeconds = Constant.OTP_EXPIRY_TIME + 1;
    }

    if (diffInSeconds > Constant.OTP_EXPIRY_TIME) {
      // validate expiry
      if (otpObject.count < Constant.OTP_DAILY_RETRY_LIMIT) {
        let count = otpObject.count + 1;
        // console.log("Checking old otp count and new count",count, otpObject.count);
        await Otp.findByIdAndUpdate(otpObject._id, {
          otp,
          // user,
          count,
        });
        console.log("Working");
        otpObject.otp = otp;
        //otpObject.user = user;
        // await Otp.findByIdAndUpdate(otpObject._id, {
        //   otp,
        //   // user,
        //   count,
        // });

        otpObject.otp = otp;
        // otpObject.user = user;
        otpObject.count = count;
        // console.log("Old OTP updated");
      } else {
        throw new Error("OTP Limit Reached");
      }
    } else {
      // last OTP has not expired. Use the old OTP only
      // console.log("Reusing old OTP");
      otp = otpObject.otp;
    }

    await otpObject.save();
  }

  // TODO: Encrypt OTP

  console.log("Trying sending OTP...");

  if (mode == Constant.TYPE_MOBILE) {
    // send SMS otp

    SmsHelper.send({
      body: "Your OTP is " + otp,
      to: mobile,
    });

    console.log("OTP " + otp + " sent to mobile " + mobile);
  } else {
    // send Email otp

    await EmailHelper.send({
      to: email,
      subject: "OTP For " + PROJECT_NAME,
      body: "Your OTP is " + otp,
    });

    console.log("OTP " + otp + " sent to email " + email);
  }
  return otp;
};

OTPService.verify = async (mobileOrEmail, mode, otp) => {
  var mobile, email;
  var query = {};
  if (mode == Constant.TYPE_EMAIL) {
    email = mobileOrEmail;
    query = { email };
  } else {
    mobile = mobileOrEmail;
    query = { mobile };
  }
  // console.log(query);
  const otpObject = await Otp.findOne(query);
  if (otpObject) {
    // console.log(otpObject);
    if (otpObject.otp == otp) {
      const diffInSeconds = moment
        .duration(moment().diff(otpObject.updatedAt))
        .asSeconds();
      // validate expiry
      return true;
      if (diffInSeconds <= Constant.OTP_EXPIRY_TIME) {
        if (otpObject.count <= Constant.OTP_DAILY_RETRY_LIMIT) {
          return true;
        }
      }
    }
  }

  return false;
};

module.exports = OTPService;
