const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");
const createToken = require("../utils/createToken");
const { sanitizeUser } = require("../utils/sanitizeData");

// @desc singup
// @route post api/v1/auth/singup
// @access public
exports.singup = asyncHandler(async (req, res, next) => {
  //1-create user
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //2-generate token
  const token = createToken(user._id);

  res.status(201).json({ data: sanitizeUser(user), token });
});

exports.login = asyncHandler(async (req, res, next) => {
  //1-find user by email and check the password
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  // 2-generate token
  const token = createToken(user._id);
  // 3- send response to client
  res.status(200).json({ data: user, token });
});

exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({ message: "Logged out successfully" });
});

//@desc make sure the user is logged in
exports.protect = asyncHandler(async (req, res, next) => {
  //1-check if token exist
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ApiError(
        "you are not login,Please login to get access this route ",
        401
      )
    );
  }
  //2-verify token(no change happens=>(token change,expired token))
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  //1-check if token exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(
      new ApiError(
        "the user that belong to this token does no longer exists",
        401
      )
    );
  }
  //1-check if user change his password after token created
  if (currentUser.passwordChangedAt) {
    const passChangedTimestamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed his password, please login again..",
          401
        )
      );
    }
  }
  req.user = currentUser;
  next();
});

//@desc Authorization(user permissions)
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(roles);
      console.log(req.user.role);

      return next(
        new ApiError("you are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc forgot password
// @route post api/v1/auth/forgotPassword
// @access public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  //1-get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with this email ${req.body.email}`, 404)
    );
  }
  //2-if user exists ,Generate reset random 6 digits and save it in db
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  //save hashed password reset code into db
  user.passwordResetCode = hashedResetCode;
  //add expiration time for password reset code (10min)
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;
  user.save();
  //3-send the reset code via email
  const message = `Hi ${user.name},\nWe received a request to reset the password on your E-shop rabie Account \n    ${resetCode}\nEnter this code to complete the reset.\nThanks for helping us keep your account secure `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset code (valid for 10 min)",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();
    return next(new ApiError("There is an error in sending email", 500));
  }
  res
    .status(200)
    .json({ status: "success", message: "Reset code send to email" });
});

// @desc verify password rest code
// @route post api/v1/auth/verifyResetCode
// @access public
exports.verifyPassResetCode = asyncHandler(async (req, res, next) => {
  //1)get user based on rest code
  const hashedResetCode = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("reset code inavalid or expired", 400));
  }
  user.passwordResetVerified = true;

  await user.save();
  res.status(200).json({ success: "success" });
});

// @desc reset password
// @route put api/v1/auth/resetPassword
// @access public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //1)get user base on email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("there is no user with this id"));
  }
  //2)check if reset code verified
  if (!user.passwordResetVerified) {
    return next(new ApiError("reset code not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();
  //3)if everything is ok ,generate token
  const token = createToken(user._id);
  res.status(200).json({ token });
});
