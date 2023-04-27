const UserPermission = require("../models/userPermission.model");

const UserPermissionService = {};

UserPermissionService.create = ({ _id, name, status, moduleRights }) => {
  return UserPermission.create({ _id, name, status, moduleRights });
};

UserPermissionService.exists = (id) => {
  return UserPermission.exists({ _id: id });
};

module.exports = UserPermissionService;
