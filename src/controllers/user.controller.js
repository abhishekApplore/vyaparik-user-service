const { default: mongoose } = require("mongoose");
const Constant = require("../constants/Constant");
const ErrorMessage = require("../constants/ErrorMessage");
const HttpError = require("../helpers/HttpError");

const Response = require("../Response"); // custom Response Object to Handle All API Reponse
const AddressService = require("../services/address.service");
const BankAccountService = require("../services/bankAccount.service");
const StoreService = require("../services/store.service");
const UserService = require("../services/user.service");
const SettingService = require("../services/setting.service");
const { ProductClient } = require("../grpc/clients");
const ProductGRPC_ClientService = require("../grpc/clientServices/product-client-service");
const sellerRequestService = require("../services/userRequest.service");
const { sendNotification } = require("../setup/notification");
const e = require("express");

const getUser = async (req, res) => {
  /*
  Work : Get user Profile
  */

  const { uid } = req.user;

  const user = await UserService.findByIdWithExtraDetails(uid);

  if (user.length > 0) {
    return Response(res).status(200).body(user[0]).send();
  } else {
    throw new HttpError(404, "User Not Found");
  }
};
const getAllUsers = async (req, res) => {
  if (req.user.type === "ADMIN") {
    try {
      const users = await UserService.find();
      Response(res).body(users).send();
    } catch (error) {
      throw new HttpError(error.status, error.message);
    }
  } else {
    Response(res).status(403).message("Not Authorized").send();
  }
};
const getProfile = async (req, res) => {
  /*
  Work : Get user Profile for another user
  */
  const uid = req.params.id;

  const user = await UserService.findById(uid);

  if (user) {
    return Response(res).status(200).body(user).send();
  } else {
    throw new HttpError(404, "User Not Found");
  }
};

const blockUnblockUser = async (req, res) => {
  const id = req.params.id;
  const requestType = parseInt(req.body.requestType);
  try {
    if (id) {
      if (requestType === 0 || requestType === 1) {
        const result = await UserService.blockUnblockById(
          id,
          requestType === 1 ? false : true
        );
        if (result) {
          return Response(res)
            .status(200)
            .message(
              requestType === 0
                ? "user blocked successfully"
                : "user unblocked successfully"
            )
            .send();
        } else {
          Response(res).status(400).message("Some error occured").send();
        }
      } else {
        Response(res).status(400).message("Invalid request type").send();
      }
    } else {
      Response(res).status(400).message("Invalid id").send();
    }
  } catch (err) {
    Response(res).status(400).message("Some error occured").send();
  }
};

const getOwnSellerProfileWithFollowers = async (req, res) => {
  /*
  Work : Get user Profile for another user
  */
  try {
    const { uid } = req.user;
    const user = await StoreService.findExtraDetailsById(uid);
    const products = await ProductGRPC_ClientService.getAllProductsOfParticularUser(
      uid
    );
    console.log(products);

    if (user && user.length > 0) {
      console.log(products);
      user[0].products = products?.product?.length;
      return Response(res).status(200).body(user).send();
    } else {
      throw new HttpError(404, "User Not Found");
    }
  } catch (ex) {
    throw new HttpError(ex.status, ex.message);
  }
};

const getAnotherSellerProfileWithFollowers = async (req, res) => {
  /*
  Work : Get user Profile for another user
  */
  try {
    const uid = req.params.id;
    const user = await StoreService.findExtraDetailsById(uid, req?.user?._id);
    if (user[0]?.orders?.length > 0) {
      user[0].canReview = true;
    } else {
      user[0].canReview = false;
    }
    delete user[0].orders;
    const products = await ProductGRPC_ClientService.getAllProductsOfParticularUser(
      uid
    );

    if (user) {
      console.log(products);
      user[0].products = products.product.length;
      return Response(res).status(200).body(user).send();
    } else {
      throw new HttpError(404, "User Not Found");
    }
  } catch (ex) {
    throw new HttpError(ex.status, ex.message);
  }
};
const updateOwnSellerProfile = async (req, res) => {
  /*
    work: Update Seller profile
  */

  try {
    const { uid } = req.user;
    if (req.body.name) {
      req.body.ownerName = req.body.name;
    }
    const user = await UserService.findById(uid);
    const store = await StoreService.findByIdAndUpdate(user.storeId, req.body);
    console.log({ store });
    Response(res)
      .status(200)
      .message("Successfully updated!")
      .body(store)
      .send();
  } catch (error) {
    throw new HttpError(error.status, error.message);
  }
};

const profileSuggestion = async (req, res) => {
  const { data } = req.body;

  const user = await UserService.profileSuggestion(data);

  if (user) {
    return Response(res).status(200).body(user).send();
  } else {
    throw new HttpError(404, "User Not Found");
  }
};

// const followUser = async (req, res) => {
//   /*
//   Work : follow a user
//   */
//   const { uid } = req.user;
//   const id = req.params.id;
//   if (
//     await UserService.followUser(uid,id)
//   ) {
//     return Response(res).status(200).send();
//   } else {
//     throw new HttpError(400, ErrorMessage.STATUS_400);
//   }
// };

const followUser = async (req, res) => {
  const { uid } = req.user;
  const { type } = req.query;
  const id = req.params.id;

  try {
    const followed = await UserService.followUser(uid, id, type);

    Response(res)
      .status(200)
      .message("Followed Successfully")
      .body(followed)
      .send();
  } catch (error) {
    throw new HttpError(400, error.message);
  }
};
const followUserViaSeller = async (req, res) => {
  const { uid } = req.user;
  const id = req.params.id;

  try {
    const followed = await UserService.followUserViaSeller(uid, id);

    Response(res)
      .status(200)
      .message("Followed Successfully")
      .body(followed)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const unFollowUser = async (req, res) => {
  const { uid } = req.user;
  const id = req.params.id;

  try {
    const unFollowed = await UserService.unFollowUser(uid, id);

    Response(res)
      .status(200)
      .message("UnFollowed Successfully")
      .body(unFollowed)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const followerList = async (req, res) => {
  try {
    const { uid } = req.user;
    const followersList = await UserService.followersList(uid);
    Response(res).status(200).body(followersList).send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const followingList = async (req, res) => {
  try {
    const { uid } = req.user;
    const followingData = await UserService.followingList(uid);
    Response(res)
      .status(200)
      .body([...followingData[0].seller, ...followingData[0].buyer])
      .send();
  } catch (error) {
    throw new HttpError(400, error.message);
  }
};

const updateProfile = async (req, res) => {
  /*
  Work : update user Profile
  */
  const { uid } = req.user;
  const { fullname, password, bio, picture, fcmTokens } = req.body;
  if (
    await UserService.updateProfile(uid, {
      fullname,
      password,
      bio,
      picture,
      fcmTokens,
    })
  ) {
    return Response(res).status(200).send();
  } else {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const addAddress = async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) throw new HttpError(400, error.details[0].message);

  try {
    let isDefault = false;
    const address = await AddressService.find({ userId: req.user.uid });
    if (address && address.length < 1) {
      isDefault = true;
    }
    const newAddress = await AddressService.create({
      name: req.body.name,
      mobile: req.body.mobile,
      pincode: req.body.pincode,
      userId: req.user.uid,
      locality: req.body.locality,
      state: req.body.state,
      city: req.body.city,
      type: req.body.type,
      default: isDefault,
      address: req.body.address,
    });

    Response(res)
      .status(200)
      .message("Address Added Successfully")
      .body(newAddress)
      .send();
  } catch (error) {
    throw new HttpError(400, error.message);
  }
};

const getAddress = async (req, res) => {
  const Id = req.params.id;

  try {
    const Address = await AddressService.getAddress(Id);

    Response(res)
      .status(200)
      .message("Address Fetched Successfully")
      .body(Address)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};
const getAllAddressOfMyself = async (req, res) => {
  const { uid } = req.user;

  try {
    const Address = await AddressService.getAllAddress(uid);

    Response(res)
      .status(200)
      .message("Address Fetched Successfully")
      .body(Address)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const updated = await AddressService.updateAddress(
      addressId,
      req.body,
      req.user.uid
    );
    return Response(res)
      .status(200)
      .message("Adress Updated Successfully")
      .body(updated)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const removeAddress = async (req, res) => {
  try {
    const addresstId = req.params.id;
    const remove = await AddressService.removeAddress(addresstId);
    return Response(res)
      .status(200)
      .message("Adress Removed Successfully")
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const becomeSupplier = async (req, res) => {
  console.log("Working step-1");

  const {
    gst,
    addressName,
    mobile,
    pincode,
    state,
    address,
    locality,
    city,
    accountHolderName,
    accountNumber,
    bankName,
    ifsc,
    storeName,
    type,
  } = req.body;
  try {
    //Step-1 creating address
    const pickupAddress = await AddressService.create({
      name: addressName,
      mobile: req.body.mobile,
      pincode,
      state,
      address,
      locality,
      city,
      user: mongoose.Types.ObjectId(req.user.uid),
    });

    //Step-2 creating BankAccount
    const bankAccount = await BankAccountService.create({
      accountNumber,
      accountHolderName,
      bankName,
      ifsc,
      user: mongoose.Types.ObjectId(req.user.uid),
    });
    //Step-3 registering Seller

    const store = await StoreService.create({
      gst,
      mobile,
      pincode,
      state,
      locality,
      city,
      name: storeName,
      ownerName: storeName,
      type,
      address: pickupAddress._id,
      bankAccount: bankAccount._id,
      user: mongoose.Types.ObjectId(req.user.uid),
    });

    //step - 4 updating user profile
    const request = await sellerRequestService.create({
      userId: mongoose.Types.ObjectId(req.user.uid),
    });
    // const user = await UserService.createSeller(
    //   mongoose.Types.ObjectId(req.user.uid),
    //   store
    // );

    if (req.user) {
      const user = await UserService.findById(req.user.uid);
      await sendNotification(
        Constant.Notification.BECOME_A_SELLER.title,
        Constant.Notification.BECOME_A_SELLER.message,
        user.fcmTokens
      );
    }

    //sending Response
    Response(res)
      .status(201)
      .message("Successfully registered as Seller")
      .send();
  } catch (ex) {
    throw new HttpError(400, ex.message);
  }
};

const addSetting = async (req, res) => {
  const { uid } = req.user;
  try {
    const setting = await SettingService.addSetting(req.body);
    const user = await SettingService.updateUser(uid, setting);
    console.log("here user", user);
    return Response(res)
      .status(200)
      .message("setting Added Successfully")
      .body(user)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const getSetting = async (req, res) => {
  try {
    const settingId = req.params.id;
    const setting = await SettingService.getSetting(settingId);
    return Response(res)
      .status(200)
      .message("Setting Fetched Successfully")
      .body(setting)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const updateSetting = async (req, res) => {
  try {
    const settingId = req.params.id;
    const updated = await SettingService.updateSetting(settingId, req.body);
    return Response(res)
      .status(200)
      .message("Setting Updated Successfully")
      .body(updated)
      .send();
  } catch (error) {
    throw new HttpError(400, ErrorMessage.STATUS_400);
  }
};

const topSeller = async (req, res) => {
  try {
    let users;
    if (req.user) {
      users = await StoreService.topSellers(req.user.uid);
    } else {
      users = await StoreService.topSellers();
    }
    for (let i = 0; i < users.length; i++) {
      const userSold = await ProductGRPC_ClientService.getNumberOfSoldProductsByUser(
        users[i].user
      );
      users[i].sold = userSold.sold;
    }
    users.sort((a, b) => b.sold - a.sold);
    Response(res).body(users).send();
  } catch (error) {
    throw new HttpError(error.status, error.message);
  }
};
module.exports = {
  getUser,
  getAllUsers,
  getProfile,
  followUser,
  unFollowUser,
  followerList,
  followingList,
  updateProfile,
  addAddress,
  getAddress,
  removeAddress,
  updateAddress,
  becomeSupplier,
  addSetting,
  getSetting,
  updateSetting,
  profileSuggestion,
  getAllAddressOfMyself,
  getOwnSellerProfileWithFollowers,
  followUserViaSeller,
  updateOwnSellerProfile,
  topSeller,
  getAnotherSellerProfileWithFollowers,
  blockUnblockUser,
};
