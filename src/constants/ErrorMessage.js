/*
  Error messages
*/
module.exports = Object.freeze({
  // commonly used

  // commonly used functions

  Status404: (model) => {
    return model + " Not Found";
  },

  Status500: (error) => {
    return "Server Side Error (" + error + ")";
  },

  Status400: (fields) => {
    return (
      fields.toString() +
      " " +
      (fields.length == 1 || typeof fields == "string" ? "is" : "are") +
      " missing or invalid"
    );
  },

  STATUS_400: "Provided Input is invalid or missing",
  STATUS_400_MISSING_PARAMS: "Missing required parameters",
  STATUS_409: "Resource Account already exists",
  STATUS_500: "Server Side Error",
  STATUS_404: "Resource Not Found",
  STATUS_404_ROUTE: "Route Not Found",
  STATUS_401: "You are unauthorized to perform this operation",
  STATUS_401_NO_TOKEN: "No Token",
  STATUS_401_INVALID_TOKEN: "The Token is invalid or expired",
  STATUS_403: "You do not have enough Privilages to perform this action",
  STATUS_401_USER_NOT_REGISTERED: "User does not exist",

  // project specific

  STATUS_409_USER: "User Account already exists with the given ID",
  STATUS_409_USER_FIREBASE:
    "Developer Claims already exists in Firebase JWT Token. The Firebase Account associated with the Token has been deleted. Hit this API with a new fresh login token from user to register user.",
  STATUS_404_USER: "User Not Found",
  STATUS_404_COURSE: "Course Not Found",
  STATUS_404_COURSE_CLASS: "Course Class Not Found",
  STATUS_404_VIDEO: "Video Not Found",
  STATUS_404_REVIEW: "Review Not Found",
  STATUS_404_SESSION: "Session Not Found",
  STATUS_404_NOTIFICATION: "Notification Not Found",
  STATUS_404_ORDER: "Order Not Found",
  STATUS_400_INVALID_USER_TYPE: "User Type is not allowed",
  ACCOUNT_CREATED_SUCCESSFULLY: "Account Created Successfully",
  GRADE_NOT_VALID: "Grade is not valid",
  USER_ALREADY_EXISTS: "User Already Exists",
  USER_TYPE_INVALID: "User Type is invalid",

  // failed coupon code messages
  COUPON_UNAPPLICABLE: "Coupon is not applicable",
  COUPON_NOT_FOUND: {
    code: 113,
    message: "Coupon is invalid",
  },
  COUPON_OUT_OF_LIMIT_LESS: {
    code: 114,
    message: "Order is not applicable for provided Coupon",
    message: (min) => {
      return "Coupon is only applicable on minimum orders of amount Rs." + min;
    },
  },
  COUPON_OUT_OF_LIMIT_MORE: {
    code: 115,
    message: "Maximum Order Amount Limit exceeded",
    message: (max) => {
      return "Coupon is only applicable upto order of amount Rs." + max;
    },
  },
  COUPON_EXPIRED: {
    code: 116,
    message: "Coupon has been Expired",
  },

  COUPON_APPLICABLE: {
    code: 200,
    message: "Coupon is Applicable",
  },
  CART_EMPTY: {
    code: 118,
    message: "Cart is Empty",
  },
  CART_NOT_FOUND: {
    code: 117,
    message: "Cart not Found",
  },
  COUPON_INVALID_OTHER: {
    code: 121,
    message: "Coupon is not valid because of unknown reason.",
  },
});
