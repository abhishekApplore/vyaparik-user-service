const Constant = require("../constants/Constant");
const ErrorMessage = require("../constants/ErrorMessage");
const FacebookAuth = require("../helpers/FacebookAuth.helper");
const GoogleAuth = require("../helpers/GoogleAuth.helper");
const HttpError = require("../helpers/HttpError");
const TokenHelper = require("../helpers/Token.helper");

const Response = require("../Response"); // custom Response Object to Handle All API Reponse
const OTPService = require("../services/otp.service");
const UserService = require("../services/user.service");

const loginWithPassword = async (req, res) => {
  /*
  Work : Login user
  */

  var { mobile, password, email } = req.body;

  var mode;

  if (mobile) {
    email = null;
    mode = Constant.TYPE_MOBILE; // for mobile
  } else {
    mobile = null;
    mode = Constant.TYPE_EMAIL; // for email
  }
  const verified = await UserService.verifyPassword(
    mobile ?? email,
    mode,
    password
  );
  try {
    if (verified) {
      const user =
        mode == Constant.TYPE_EMAIL
          ? await UserService.findByEmail(email)
          : await UserService.findByMobile(mobile);

      if (user) {
        if (user.isBlocked) {
          return Response(res)
            .status(401)
            .message(ErrorMessage.USER_BLOCKED)
            .body({
              isBlocked: true,
            })
            .send();
        }
        // login
        let accessToken;
        if (user.type == "SELLER") {
          accessToken = TokenHelper.createAccessToken(
            user._id,
            user.type,
            user.storeId
          );
        } else {
          accessToken = TokenHelper.createAccessToken(user._id, user.type);
        }
        const refreshToken = TokenHelper.createRefreshToken(user._id);

        Response(res)
          .status(200)
          .message("Login Success")
          .body({
            accessToken,
            refreshToken,
            user: UserService.public.getUser(user),
            type: "LOGIN",
          })
          .send();
        return;
      }
    } else {
      throw new HttpError(401, "Email, Mobile Or Password is incorrect");
    }
  } catch (error) {
    // throw new HttpError(400, error.message);
    // do not send actual error
    throw new HttpError(401, "Email, Mobile Or Password is incorrect");
  }
};

const loginOrRegisterWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  var payload;

  try {
    payload = await GoogleAuth.verify(idToken);
  } catch (error) {
    throw new HttpError(400, "Google ID Token is Invalid");
  }

  const user = await UserService.findByGoogle(payload.sub);

  if (user) {
    // login
    if (user.isBlocked) {
      return Response(res)
        .status(401)
        .message(ErrorMessage.USER_BLOCKED)
        .body({
          isBlocked: true,
        })
        .send();
    }

    let accessToken;
    if (user.type == "SELLER") {
      accessToken = TokenHelper.createAccessToken(
        user._id,
        user.type,
        user.storeId
      );
    } else {
      accessToken = TokenHelper.createAccessToken(user._id, user.type);
    }
    const refreshToken = TokenHelper.createRefreshToken(user._id);

    Response(res)
      .status(200)
      .message("Login Success")
      .body({
        accessToken,
        refreshToken,
        user: UserService.public.getUser(user),
        type: "LOGIN",
      })
      .send();
    return;
  } else {
    // create new account
    const strategies = [Constant.User.Strategies.GOOGLE];
    console.log(payload);
    const newUser = await UserService.create({
      googleId: payload.sub,
      strategies,
      email: payload.email_verified ? payload?.email : null,
      fullname: payload?.name,
      picture: payload?.picture,
      type: "BUYER",
    });
    const accessToken = TokenHelper.createAccessToken(
      newUser._id,
      newUser.type
    );
    const refreshToken = TokenHelper.createRefreshToken(newUser._id);

    Response(res)
      .status(200)
      .message("Account Created Successfully")
      .body({
        accessToken,
        refreshToken,
        user: UserService.public.getUser(newUser),
        type: "REGISTERD",
      })
      .send();
    return;
  }
};

const loginOrRegisterWithFacebook = async (req, res) => {
  const { accessToken } = req.body;
  var payload;
  try {
    payload = await FacebookAuth.verify(accessToken);
  } catch (error) {
    console.log(error.response);
    throw new HttpError(400, "Facebook Access Token is Invalid");
  }

  const user = await UserService.findByFacebook(payload.id);

  if (user) {
    // login
    if (user.isBlocked) {
      return Response(res)
        .status(401)
        .message(ErrorMessage.USER_BLOCKED)
        .body({
          isBlocked: true,
        })
        .send();
    }
    const accessToken = TokenHelper.createAccessToken(user._id);
    const refreshToken = TokenHelper.createRefreshToken(user._id);

    Response(res)
      .status(200)
      .message("Login Success")
      .body({
        accessToken,
        refreshToken,
        user: UserService.public.getUser(user),
        type: "LOGIN",
      })
      .send();

    return;
  } else {
    // create new account
    const strategies = [Constant.User.Strategies.FACEBOOK];
    const newUser = await UserService.create({
      facebookId: payload.id,
      strategies,
      email: payload?.email,
      fullname: payload?.first_name
        ? payload.first_name + " " + payload.last_name
        : null,
      picture: payload?.picture ? payload.picture?.data.url : null,
    });

    const accessToken = TokenHelper.createAccessToken(newUser._id);
    const refreshToken = TokenHelper.createRefreshToken(newUser._id);
    console.log(newUser);
    Response(res)
      .status(200)
      .message("Account Created Successfully")
      .body({
        accessToken,
        refreshToken,
        user: UserService.public.getUser(newUser),
        type: "REGISTERD",
      })
      .send();
    return;
  }
};

const loginOrRegisterWithOTP = async (req, res) => {
  /*
  Work : create a user if not found
  */

  var { mobile, otp, email } = req.body;

  var mode;

  if (mobile) {
    email = null;
    mode = Constant.TYPE_MOBILE; // for mobile
  } else {
    mobile = null;
    mode = Constant.TYPE_EMAIL; // for email
  }
  if (await OTPService.verify(mobile ?? email, mode, otp)) {
    const user =
      mode == Constant.TYPE_EMAIL
        ? await UserService.findByEmail(email)
        : await UserService.findByMobile(mobile);
    if (user) {
      if (user.isBlocked) {
        return Response(res)
          .status(401)
          .message(ErrorMessage.USER_BLOCKED)
          .body({
            isBlocked: true,
          })
          .send();
      }
      // login
      if (user.strategies.includes(Constant.User.Strategies.PASSWORD)) {
        throw new HttpError(409, "User Already Exists!!");
      }
      let accessToken;
      if (user.type == "SELLER") {
        accessToken = TokenHelper.createAccessToken(
          user._id,
          user.type,
          user.storeId
        );
      } else {
        accessToken = TokenHelper.createAccessToken(user._id, user.type);
      }
      const refreshToken = TokenHelper.createRefreshToken(user._id);

      Response(res)
        .status(200)
        .message("Login Success")
        .body({
          accessToken,
          refreshToken,
          user: UserService.public.getUser(user),
          type: "LOGIN",
        })
        .send();
    } else {
      // create new account

      const strategies =
        mode == Constant.TYPE_MOBILE
          ? [Constant.User.Strategies.MOBILE_OTP]
          : [Constant.User.Strategies.EMAIL_OTP];
      // TODO: validate email and mobile if already exists
      const newUser = await UserService.create({ mobile, email, strategies });
      let accessToken = null;
      if (newUser.storeId) {
        accessToken = TokenHelper.createAccessToken(
          newUser._id,
          newUser.type,
          newUser.storeId
        );
      } else {
        accessToken = TokenHelper.createAccessToken(newUser._id, newUser.type);
      }
      const refreshToken = TokenHelper.createRefreshToken(newUser._id);

      Response(res)
        .status(200)
        .message("Account Created Successfully")
        .body({
          accessToken,
          refreshToken,
          user: UserService.public.getUser(newUser),
          type: "REGISTERD",
        })
        .send();
      return;
    }
  }

  throw new HttpError(400, "OTP is invalid or expired");
};

const forgotPassword = async (req, res) => {
  /*
  Work : Forgot password, send otp on mail or mobile
  */

  var { mobile, email } = req.body;

  var mode;
  let user;
  if (mobile) {
    email = null;
    mode = Constant.TYPE_MOBILE; // for mobile
    user = await UserService.findByMobile(mobile);
    console.log("working mobile");
  } else {
    mobile = null;
    mode = Constant.TYPE_EMAIL; // for email
    user = await UserService.findByEmail(email);
    console.log("working", email, user);
  }
  console.log(user);
  if (!user) throw new HttpError(400, "User doesn't Exists");
  if (user.isBlocked) {
    return Response(res)
      .status(401)
      .message(ErrorMessage.USER_BLOCKED)
      .body({
        isBlocked: true,
      })
      .send();
  }
  try {
    await OTPService.send(mobile ?? email, mode);
  } catch (error) {
    throw new HttpError(500, error.message, error.stack);
  }

  Response(res).status(200).message("OTP Sent Successfully").send();
};

const verifyOTP = async (req, res) => {
  /*
  Work : Verify Otp
  */

  var { mobile, otp, email } = req.body;

  console.log(req.body);

  var mode;
  let user;
  if (mobile) {
    email = null;
    mode = Constant.TYPE_MOBILE; // for mobile
    user = await UserService.findByMobile(mobile);
  } else {
    mobile = null;
    mode = Constant.TYPE_EMAIL; // for email
    user = await UserService.findByEmail(email);
  }
  if (!user) throw new HttpError(400, "User doesn't Exists");
  if (user.isBlocked) {
    return Response(res)
      .status(401)
      .message(ErrorMessage.USER_BLOCKED)
      .body({
        isBlocked: true,
      })
      .send();
  }
  try {
    await OTPService.verify(mobile ?? email, mode, otp);
  } catch (error) {
    throw new HttpError(500, error.message, error.stack);
  }

  Response(res).status(200).message("OTP Verified").send();
};
const resetPassword = async (req, res) => {
  /*
  Work : reset Password
  */

  var { mobile, password, email } = req.body;

  var mode;

  if (mobile) {
    email = null;
    mode = Constant.TYPE_MOBILE; // for mobile
  } else {
    mobile = null;
    mode = Constant.TYPE_EMAIL; // for email
  }

  const user =
    mode == Constant.TYPE_EMAIL
      ? await UserService.findByEmail(email)
      : await UserService.findByMobile(mobile);
  if (user.isBlocked) {
    return Response(res)
      .status(401)
      .message(ErrorMessage.USER_BLOCKED)
      .body({
        isBlocked: true,
      })
      .send();
  }
  if (user && user.strategies.includes(Constant.User.Strategies.PASSWORD)) {
    await UserService.updateProfile(user._id, { password });
    Response(res).status(200).message("Password Reset Success").send();
  }
};

const sendOTP = async (req, res) => {
  /*
  Work : Sends OTP to a Mobile Number
  */

  var { mobile, email } = req.body;
  let user;
  var mode;
  if (mobile) {
    email = null;
    mode = Constant.TYPE_MOBILE;
    user = await UserService.findByMobile(mobile);
    // for mobile
  } else {
    mobile = null;
    mode = Constant.TYPE_EMAIL;
    user = await UserService.findByEmail(email);
    // for email
  }
  if (user.isBlocked) {
    return Response(res)
      .status(401)
      .message(ErrorMessage.USER_BLOCKED)
      .body({
        isBlocked: true,
      })
      .send();
  }
  if (user && user.strategies.includes(Constant.User.Strategies.PASSWORD))
    throw new HttpError(409, "User Already Exists!!");
  try {
    const result = await OTPService.send(mobile ?? email, mode);

    Response(res)
      .status(200)
      .message("OTP Sent Successfully")
      .body({
        otp: result,
      })
      .send();
  } catch (error) {
    throw new HttpError(500, error.message, error.stack);
  }
};

const exchangeRefreshTokenForAccessToken = async (req, res) => {
  /*
  Work : Returns an access token with a valid refresh token
  */
  try {
    const { refreshToken } = req.body;

    const payload = TokenHelper.verifyRefreshToken(refreshToken);
    const user = await UserService.findById(payload.uid);
    if (user.isBlocked) {
      return Response(res)
        .status(401)
        .message(ErrorMessage.USER_BLOCKED)
        .body({
          isBlocked: true,
        })
        .send();
    }
    if (payload) {
      Response(res)
        .status(200)
        .body({
          accessToken: TokenHelper.createAccessToken(
            user._id,
            user.type,
            user.storeId
          ),
        })
        .send();
      return;
    }

    throw new HttpError(401, ErrorMessage.STATUS_401_INVALID_TOKEN);
  } catch (error) {
    console.log(error.message);
    throw new HttpError(401, ErrorMessage.STATUS_401_INVALID_TOKEN);
  }
};

module.exports = {
  loginOrRegisterWithOTP,
  sendOTP,
  exchangeRefreshTokenForAccessToken,
  loginOrRegisterWithGoogle,
  loginOrRegisterWithFacebook,
  loginWithPassword,
  verifyOTP,
  forgotPassword,
  resetPassword,
};
