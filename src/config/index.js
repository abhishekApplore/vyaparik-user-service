const dotEnv = require("dotenv");
dotEnv.config();

if (process.env.NODE_ENV == "production") {
  // for production
  dotEnv.config();
} else {
  // for other environments
  var ext = "";
  if (process.env.NODE_ENV == "development") {
    ext = "dev";
  } else {
    ext = "local";
  }
  const configFile = "./.env." + ext;
  dotEnv.config({ path: configFile });
}

checkInstallation(); // checks if needed installation and envs are configured.

module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.MONGO_DB_URL,
  NODE_ENV: process.env.NODE_ENV,
  PROJECT_NAME: "Vyaparik",
  ORIGIN: process.env.ORIGIN ?? "*",
  JWT_ACCESS_TOKEN_PRIVATE_KEY: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_PRIVATE_KEY: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  JWT_TRANSFER_TOKEN_PRIVATE_KEY: process.env.JWT_TRANSFER_TOKEN_PRIVATE_KEY,
  JWT_TRANSFER_TOKEN_EXPIRY: process.env.JWT_TRANSFER_TOKEN_EXPIRY,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_SENDER: process.env.TWILIO_SENDER,
  AWS_ENDPOINT: process.env.AWS_ENDPOINT,
  SENDER_EMAIL: process.env.SENDER_EMAIL,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

function checkInstallation() {
  // this function checks if all conditions are met including envs

  if (!process.env.NODE_ENV) {
    console.error("[O] Node Environment is not Set (NODE_ENV)");
    process.exit(1);
  }

  if (!process.env.MONGO_DB_URL) {
    console.error("[O] Node Environment is not Set (MONGO_DB_URL)");
    process.exit(1);
  }
}
