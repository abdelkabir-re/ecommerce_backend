const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc add address to addresses list
// @route post api/v1/addresses
// @access protected/user
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address added successfully ",
    data: user.addresses,
  });
});

// @desc remove address from addresses
// @route delete api/v1/addresses/:adressId
// @access protected/user
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address removed successfully ",
    data: user.addresses,
  });
});

// @desc get logged user addresses list
// @route get api/v1/addresses
// @access protected/user
exports.getLoggedUseraddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");
  res.status(200).json({
    status: "success",
    result: user.addresses.length,
    data: user.addresses,
  });
});
