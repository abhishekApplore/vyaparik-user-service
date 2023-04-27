const FacebookAuth = {};
const axios = require("axios");
// https://stackoverflow.com/questions/8605703/how-to-verify-facebook-access-token

FacebookAuth.verify = async (accessToken) => {
  const FACEBOOK_ID_TOKEN_VERIFY_API_URL = "https://graph.facebook.com/me";

  const data = await axios
    .get(FACEBOOK_ID_TOKEN_VERIFY_API_URL, {
      params: {
        fields: ["id", "email", "first_name", "last_name", "picture"].join(","),
        access_token: accessToken,
      },
    })
    .then((res) => {
      return res.data;
    });

  return data;
};

module.exports = FacebookAuth;
