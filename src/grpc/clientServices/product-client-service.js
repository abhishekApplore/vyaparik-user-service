const { ProductClient } = require("../clients");

const ProductGRPC_ClientService = {};

ProductGRPC_ClientService.getAllProductsOfParticularUser = (id) => {
  return new Promise((resolve, reject) => {
    ProductClient.getAllProducts({ _id: id }, (err, data) => {
      if (err) {
        reject(err);
      }
      console.log({ data });
      resolve(data);
    });
  });
};
ProductGRPC_ClientService.getNumberOfSoldProductsByUser = (id) => {
  return new Promise((resolve, reject) => {
    ProductClient.getNumberOfSoldProductsByUser({ _id: id }, (err, data) => {
      if (err) {
        reject(err);
      }
      console.log({ data });

      resolve(data);
    });
  });
};

module.exports = ProductGRPC_ClientService;
