const Setting = require("../models/userSetting.model");
const User = require("../models/user.model");
const SettingService = {};

SettingService.addSetting = (data = {}) => {
  return Setting.create(data);
};
SettingService.updateUser = async (id,setting) => {
  return User.findByIdAndUpdate(id, {setting:setting._id });
};

SettingService.getSetting = (Id = {}) => {
  return Setting.findById(Id);
};

SettingService.updateSetting = (Id,data = {}) => {
  return Setting.findByIdAndUpdate(Id,data);
};



module.exports = SettingService;
