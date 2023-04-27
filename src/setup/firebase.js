const admin = require("firebase-admin");
const credentials = require("./../config/weds-in-serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = {
  admin,
};
