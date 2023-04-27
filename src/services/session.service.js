const Utils = require("../helpers/utils.helper");
const Session = require("../models/session.model");
const SessionService = {};

SessionService.create = async () => {
  return Session.create({});
};

SessionService.isVerified = async (sessionId) => {
  const session = await Session.findById(sessionId);

  if (session.userId && !session.used) {
    session.used = true;
    session.save();
    return session.userId;
  }

  return false;
};

SessionService.approve = async (userId, sessionId) => {
  Session.updateOne({ _id: sessionId }, { verified: true, userId });
  return true;
};

module.exports = SessionService;
