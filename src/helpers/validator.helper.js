const { validationResult } = require("express-validator");
const ValidationHelper = {};

ValidationHelper.errorHandler = (req, res, next) => {
  // Throw Error if Validation Fails
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var errorMessage = [];
    errors.array().map((err) => errorMessage.push(err.msg));
    const error = new Error(errorMessage.toString());
    error.status = 400;
    throw error;
  }

  next();
};

module.exports = ValidationHelper;
