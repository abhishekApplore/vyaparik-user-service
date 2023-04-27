const SellerRequestController = require("../../../controllers/sellerRequest.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");

const requestRoute = require("express").Router();
const sellerRequest = new SellerRequestController();

//For Admin Users Only
requestRoute.get("/", AsyncHandler(sellerRequest.getAllPendingRequest));
requestRoute.put("/:id", AsyncHandler(sellerRequest.updateStatus));

module.exports = requestRoute;
