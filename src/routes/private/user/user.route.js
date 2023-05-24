const Auth = require("../../../middlewares/auth.middleware");

const {
  getUser,
  getProfile,
  followUser,
  unFollowUser,
  followerList,
  followingList,
  updateProfile,
  becomeSupplier,
  addAddress,
  getAddress,
  updateAddress,
  removeAddress,
  addSetting,
  getSetting,
  updateSetting,
  profileSuggestion,
  getAllAddressOfMyself,
  getOwnSellerProfileWithFollowers,
  followUserViaSeller,
  updateOwnSellerProfile,
  getAnotherSellerProfileWithFollowers,
  getAllUsers,
  blockUnblockUser,
  getNotifications,
} = require("../../../controllers/user.controller");
const { AsyncHandler } = require("../../../helpers/utils.helper");
const AuthMiddleware = require("../../../middlewares/auth.middleware");

const userRoute = require("express").Router();

userRoute.use(AsyncHandler(AuthMiddleware));
userRoute.get("/admin", AsyncHandler(getAllUsers));
userRoute.get("/notifications", AsyncHandler(getNotifications));
userRoute.get("/", AsyncHandler(getUser));
userRoute.get("/followersList", AsyncHandler(followerList));
userRoute.get("/followingList", AsyncHandler(followingList));
userRoute.get("/profileSuggestion", AsyncHandler(profileSuggestion));
userRoute.post("/follow/:id", AsyncHandler(followUser));
userRoute.post("/follow/seller/:id", AsyncHandler(followUserViaSeller));
userRoute.delete("/unfollow/:id", AsyncHandler(unFollowUser));
userRoute.put("/", AsyncHandler(updateProfile));
userRoute.post("/addAddress", AsyncHandler(addAddress));
userRoute.get("/address", AsyncHandler(getAllAddressOfMyself));
userRoute.get("/:id", AsyncHandler(getProfile));
userRoute.get(
  "/seller/me",
  AsyncHandler(AuthMiddleware),
  AsyncHandler(getOwnSellerProfileWithFollowers)
);
userRoute.get(
  "/seller/:id",
  AsyncHandler(getAnotherSellerProfileWithFollowers)
);
userRoute.put("/seller/update/me", AsyncHandler(updateOwnSellerProfile));
userRoute.get("/getAddress/:id", AsyncHandler(getAddress));
userRoute.put("/updateAddress/:id", AsyncHandler(updateAddress));
userRoute.put("/removeAddress/:id", AsyncHandler(removeAddress));
userRoute.put("/seller", AsyncHandler(becomeSupplier));
userRoute.post("/addSetting", AsyncHandler(addSetting));
userRoute.get("/getSetting/:id", AsyncHandler(getSetting));
userRoute.put("/updateSetting/:id", AsyncHandler(updateSetting));
userRoute.put("/blockUnblock/:id", AsyncHandler(blockUnblockUser));

module.exports = userRoute;
