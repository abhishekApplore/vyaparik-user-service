var grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");
const { UserGRPCService } = require("./services/user.proto.service");

// const { v4: uuidv4 } = require("uuid");

const server = new grpc.Server();

//services
UserGRPCService(server);

server.bind("127.0.0.1:30044", grpc.ServerCredentials.createInsecure());
console.log("GRPC Server running at http://127.0.0.1:30044");
// server.start();

module.exports.GRPCServer = server;
