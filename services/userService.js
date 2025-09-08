const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const ApiError = require("../utils/apiError");
const User = require("../models/userModel");
const factory = require("./handlersFactory");
const createToken = require("../utils/createToken");

//Upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    req.body.profileImg = filename;
  }

  next();
});

// @desc get list of  users
// @route get api/v1/users
// @access private/Admin
exports.getUsers = factory.getAll(User);

// @desc create user
// @route post api/v1/users
// @access private/Admin
exports.createUser = factory.createOne(User);

// @desc get specific user by id
// @route get api/v1/users/:id
// @access public/Admin
exports.getUser = factory.getOne(User);

// @desc update user
// @route put api/v1/users/:id
// @access private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document with this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc update password
// @route put api/v1/users/changePassword/:id
// @access private/Admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document with this id ${req.params.id}`, 404));
  }

  res.status(200).json({ data: document });
});

// @desc delete user
// @route delete api/v1/users/:id
// @access private/Admin
exports.deleteUser = factory.deleteOne(User);

// @desc get logged user data
// @route put api/v1/users/getMe
// @access private/protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc update logged user password
// @route put api/v1/users/changeMyPassword
// @access private/protect
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(new ApiError(`No User with this id ${req.user._id}`, 404));
  }
  //Generate token
  const token = createToken(req.user._id);
  res.status(200).json({ data: user, token });
});

// @desc update logged user data(without password and role)
// @route put api/v1/users/updateMe
// @access private/protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    {
      new: true,
    }
  );
  res.status(200).json({ data: updatedUser });
});


// @desc deactive logged user 
// @route DELETE api/v1/users/deleteMe
// @access private/protect
exports.deleteLoggedUserData=asyncHandler(async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user._id,{active:false})
  res.status(204).send()
})