const GoogleAuth = {};
const axios = require("axios");
// https://developers.google.com/identity/sign-in/web/backend-auth
GoogleAuth.verify = async (idToken) => {
  const GOOGLE_ID_TOKEN_VERIFY_API_URL =
    "https://oauth2.googleapis.com/tokeninfo";

  const data = await axios
    .get(GOOGLE_ID_TOKEN_VERIFY_API_URL, {
      params: {
        id_token: idToken,
      },
    })
    .then((res) => {
      return res.data;
    });

  return data;
};

module.exports = GoogleAuth;
