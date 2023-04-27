const PROTO_PATH = "/news.proto";

const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

var packageDefinition = protoLoader.loadSync(
  __dirname + "/protos/products.proto",
  {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
  }
);

const ProductService =
  grpc.loadPackageDefinition(packageDefinition).ProductService;
const ProductClient = new ProductService(
  "localhost:30043",
  grpc.credentials.createInsecure()
);

module.exports.ProductClient = ProductClient;
