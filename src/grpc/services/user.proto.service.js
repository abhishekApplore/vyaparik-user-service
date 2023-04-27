var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
const UserService = require("../../services/user.service");
const StoreService = require("../../services/store.service");

var packageDefinition = protoLoader.loadSync(
  __dirname + "/../protos/users.proto",
  {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
  }
);

var userProto = grpc.loadPackageDefinition(packageDefinition);

module.exports.UserGRPCService = (server) => {
  return server.addService(userProto.UserService.service, {
    getUserDetailsById: async (call, callback) => {
      console.log({ call: call.request });
      const user = await UserService.findById(call.request._id);
      //   console.log({ user, call: call.request });
      callback(null, user);
    },
    getStoreDetailsViaUserID: async (call, callback) => {
      //   console.log({ call });
      const user = await UserService.findById(call.request._id);
        console.log("WOKING", user);
      const store = await StoreService.findById(user.storeId);
      //   console.log({ user, call: call.request });
      callback(null, store);
    },
    getUserFCMTOKEN: async (call, callback) => {
      const user = await UserService.findById(call.request._id);
      // console.log(call.request._id, user);
      callback(null, { token: user.fcmTokens });
    },
  });
};
