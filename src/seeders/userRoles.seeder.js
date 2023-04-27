const UserPermissionService = require("../services/permission.service");
const permissionData = require("../data/permissions.json");
const roleData = require("../data/roles.json");
const UserRoleService = require("../services/userRole.service");
const logger = require("../helpers/logger");

// Seeds Roles and Permissions
const UserRoleSeeder = async () => {
  logger.info("Seeding User Roles and Permissions...");

  try {
    const promises = [];

    if (!(await UserPermissionService.exists(permissionData[0]._id))) {
      permissionData.map((pd) => {
        promises.push(UserPermissionService.create(pd)); // create permissions for user
      });

      roleData.map((rd) => {
        promises.push(UserRoleService.create(rd)); // create role for user
      });

      await Promise.all(promises);
      logger.info("Seeded User Roles and Permissions Successfully");
    } else {
      logger.info(
        "Skipping Seed because User Roles and Permissions are already seeded"
      );
    }
  } catch (error) {
    logger.fatal(
      "Seeded User Roles and Permissions Failed, ERROR: " + error.message
    );
  }
};

module.exports = UserRoleSeeder;
