const UserRole = require("../models/userRole.model");

const UserRoleService = {};

UserRoleService.create = ({ _id, name, status, permissions, points }) => {
  return UserRole.create({ _id, name, status, permissions, points });
};

module.exports = UserRoleService;
