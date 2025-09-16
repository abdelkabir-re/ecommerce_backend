const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc add product to wishlist
// @route get api/v1/wishList
// @access protected/user
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product added successfully to your wishlist",
    data: user.wishList,
  });
});

// @desc remove product from wishlist
// @route delete api/v1/wishList/:productId
// @access protected/user
exports.removeProductFromWhishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Product removed successfully from your wishlist",
    data: user.wishList,
  });
});

// @desc get logged user wishList
// @route get api/v1/wishList
// @access protected/user
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    result: user.wishList.length,
    data: user.wishList,
  });
});
