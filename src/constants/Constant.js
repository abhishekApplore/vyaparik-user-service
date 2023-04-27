/*
  Other Contants Used
*/

module.exports = Object.freeze({
  // commonly used
  Permission: {
    ONLY_WHO_CREATED: 1,
    ALL: 2,
  },

  DEFAULT_USER_TYPE: "Normal",

  OTP_EXPIRY_TIME: 30, // In SECONDS
  OTP_DAILY_RETRY_LIMIT: 50,

  TYPE_EMAIL: 1,
  TYPE_MOBILE: 2,

  User: {
    Strategies: {
      PASSWORD: "PASSWORD", // for both email or mobile
      GOOGLE: "GOOGLE",
      FACEBOOK: "FACEBOOK",
      APPLE: "APPLE",
      MOBILE_OTP: "MOBILE_OTP",
      EMAIL_OTP: "EMAIL_OTP",
    },
  },
  Notification: {
    BECOME_A_SELLER: {
      title: "You have Successfully applied for a seller",
      message: "Please wait till admin check your request!",
    },
    REQUEST_ADMIN: {
      title: "A buyer have requested to become a seller",
      message: "Click to check request",
    },
    REQUEST_APPROVED: {
      title: "Your request for becoming a Seller is approved by Admin",
      message: "Now You can start Selling your Product!",
    },
    REQUEST_REJECT: {
      title: "Your request for becoming a Seller is rejected by Admin",
      message: "You can contact our customer care for further details",
    },
    PRODUCT_CREATE: {
      title: "Product Added!",
      message: "Product created Successfully, Click to add more products!",
    },
    BID_CREATE: {
      title: "Successfully Bid Placed!",
      message: "Please wait till seller check and approve your bid",
    },
    BID_PRODUCT_CREATE: {
      title: "Successfully Added to Bid Bag!",
      message: "buyers can check your products in Bid Products list",
    },
    BID_APPROVE: {
      title: "Congratulations!! your Bid Approved By a Seller",
      message: "Check and Purchase now!!",
    },
    BID_REJECT: {
      title: "Nice Try!, your bid is reject by a Seller",
      message: "Click to know more details",
    },
  },
});
