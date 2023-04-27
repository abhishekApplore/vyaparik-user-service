// const Address = require("../models/address.model");

// const AddressService = {};

// AddressService.create = (data = {}) => {
//   const address = new Address({
//     name: data.name,
//     pincode:data.pincode

//   });
//   console.log("checkAddress = ",address,data);
//   return address.save();
// };

// AddressService.exists = (id) => {
//   return Address.exists({ _id: id });
// };

// // AddressService

// module.exports = AddressService;

const Address = require("../models/address.model");

const AddressService = {};

// AddressService.addAddress = (data = {}) => {
//   // console.log('data',data);
//   // const address = new Address({
//   //   name: data.name,
//   //   mobile:data.mobile,
//   //   pincode:data.pincode

//   // });
//   // console.log('address',address);
//   console.log("data",data);
//   return Address.create(data);
// };

AddressService.create = (data = {}) => {
  console.log("Working AddressService");
  return Address.create(data);
};

AddressService.getAddress = (Id = {}) => {
  return Address.findById(Id);
};

AddressService.updateAddress = async (Id, data = {}, uid) => {
  console.log("id", Id, "data", data);
  if (data.default && uid) {
    await Address.findOneAndUpdate(
      { userId: uid, default: true },
      { default: false }
    );
    return Address.findByIdAndUpdate(Id, data);
  } else {
    return Address.findByIdAndUpdate(Id, data);
  }
};

AddressService.removeAddress = (Id = {}) => {
  return Address.findByIdAndDelete(Id);
};
AddressService.getAllAddress = (userId) => {
  return Address.find({ userId });
};

AddressService.find = (filter) => {
  return Address.find({ ...filter });
};



// AddressService.exists = (id) => {
//   return Address.exists({ _id: id });
// };

module.exports = AddressService;
