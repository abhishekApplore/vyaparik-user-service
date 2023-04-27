const Constant = require("../constants/Constant");
const ErrorMessage = require("../constants/ErrorMessage");
const HttpError = require("../helpers/HttpError");
const TokenHelper = require("../helpers/Token.helper");

const Response = require("../Response"); // custom Response Object to Handle All API Reponse
const SessionService = require("../services/session.service");

// Flow

const createSession = async (req, res) => {
  /*
  
  Work : Create a new Session 
  Returns: Express Response
  
  */
  const session = await SessionService.create();
  const token = TokenHelper.createTransferToken(session._id);
  return Response(res).status(200).body({ transferToken: token }).send();
};

const approveSession = async (req, res) => {
  /*
  
  [Authenticated API]
  Work : Approve a session transfer request
  Input: transferToken
  Returns: Express Response
  
  */
  const { transferToken } = req.body;

  const decodedValue = TokenHelper.verifyTransferToken(transferToken);

  if (decodedValue) {
    const sessionId = decodedValue.session;
    const status = await SessionService.approve(req.user.uid, sessionId);

    if (status) {
      return Response(res).status(200).send();
    } else {
      throw new HttpError(400, "Session Rejected");
    }
  } else {
    throw new HttpError(400, "Transfer Token is Invalid or Expired");
  }
};

const getSessionStatus = async (req, res) => {
  /*
  
  Work : Get session status
  Input: transferToken
  Returns: Express Response
  
  */

  const { transferToken } = req.body;

  const decodedValue = TokenHelper.verifyTransferToken(transferToken);

  if (decodedValue) {
    const userId = await SessionService.isVerified(decodedValue.session);

    if (userId) {
      const accessToken = TokenHelper.createAccessToken(userId);
      const refreshToken = TokenHelper.createRefreshToken(userId);
      return Response(res)
        .message("Login Success")
        .body({ accessToken, refreshToken })
        .status(200)
        .send();
    } else {
      throw new HttpError(401, ErrorMessage.STATUS_401);
    }
  }

  throw new HttpError(400, "Transfer Token is Invalid or Expired");
};

module.exports = {
  createSession,
  approveSession,
  getSessionStatus,
};
