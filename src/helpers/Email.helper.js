const EmailHelper = {};
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const {
  SENDER_EMAIL,
  AWS_ENDPOINT,
  AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY_ID,
} = require("../config/index");

const logger = require("./logger");

const sesClient = new SESClient({
  key: AWS_ACCESS_KEY_ID,
  secret: AWS_SECRET_ACCESS_KEY,
  amazon: AWS_ENDPOINT,
});

EmailHelper.send = async ({ subject, body, to }) => {
  try {
    // send email
    const res = await sesClient.send(
      new SendEmailCommand({
        Destination: {
          /* required */
          CcAddresses: [
            /* more items */
          ],
          ToAddresses: [
            to,
            /* more To-email addresses */
          ],
        },
        Message: {
          /* required */
          Body: {
            /* required */
            Html: {
              Charset: "UTF-8",
              Data: body,
            },
            Text: {
              Charset: "UTF-8",
              Data: body,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: SENDER_EMAIL,
        ReplyToAddresses: [
          /* more items */
        ],
      })
    );

    return res.$metadata.httpStatusCode == 200;
  } catch (error) {
    logger.error(error);
  }

  return false;
};
module.exports = EmailHelper;
