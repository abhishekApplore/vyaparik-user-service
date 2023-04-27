const {
  exchangeRefreshTokenForAccessToken,
} = require("../../../controllers/auth.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");
const TokenValidator = require("../../../validators/token.validator");

const tokenRoute = require("express").Router();

/**
 * @swagger
 * /api/user/polygon:
 *  get:
 *    tags: ["Polygon"]
 *    description: Use to request all Polygons
 *    responses:
 *      '200':
 *        description: Return List of Polygons
 */

tokenRoute.post(
  "/access",
  TokenValidator.exchangeRefreshTokenForAccessToken,
  AsyncHandler(exchangeRefreshTokenForAccessToken)
); //  Exhange refresh toke for access token

module.exports = tokenRoute;
