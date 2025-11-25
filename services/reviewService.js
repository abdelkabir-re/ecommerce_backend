const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

//nested routes
//post api/v1/products/:productId/reviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

//route get api/v1/product/:productId/reviews
exports.createFilterObject = asyncHandler((req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  req.filterObject = filterObject;
  next();
});

// @desc get list of  reviews
// @route get api/v1/reviews
// @access public
exports.getReviews = factory.getAll(Review);

// @desc create review
// @route post api/v1/reviews
// @access private/protect/user
exports.createReview = factory.createOne(Review);

// @desc get specific review by id
// @route get api/v1/reviews/:id
// @access public
exports.getReview = factory.getOne(Review);

// @desc update review
// @route put api/v1/reviews/:id
// @access private/protect/user
exports.updateReview = factory.updateOne(Review);

// @desc delete review
// @route delete api/v1/reviews/:id
// @access private/protect/user-Admin-Manager
exports.deleteReview = factory.deleteOne(Review);
