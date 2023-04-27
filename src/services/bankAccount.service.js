const BankAccount = require("../models/bankAccount.model");

const BankAccountService = {};

BankAccountService.create = (data = {}) => {
  console.log("BankAccountService");
  return BankAccount.create(data);
};

BankAccountService.exists = (id) => {
  return BankAccount.exists({ _id: id });
};

// BankAccountService

module.exports = BankAccountService;
