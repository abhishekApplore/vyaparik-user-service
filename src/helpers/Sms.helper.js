const SmsHelper = {};

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_SENDER,
} = require("../config/index");
const logger = require("./logger");

const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  //   region: "us1",
  //   edge: "sydney",
});

SmsHelper.send = async ({ body, to }) => {
  try {
    // to -> FORMAT: "+91 XXXXX XXXXX"
    // Approve Number in https://console.twilio.com/us1/develop/phone-numbers/manage/verified
    const res = await client.messages.create({
      body,
      to,
      from: TWILIO_SENDER,
    });
    if (res.status == "queued") {
      return true;
    } else {
      logger.error("Message Not Sent --> " + JSON.stringify(res));
    }
  } catch (error) {
    if (error.status) {
      logger.error(error);
    }
  }

  return false;
};
module.exports = SmsHelper;
