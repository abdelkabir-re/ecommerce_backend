const Coupon = require("../models/couponModel");
const factory = require("./handlersFactory");

// @desc get list of  coupons
// @route get api/v1/coupons
// @access private/admin-manager
exports.getCoupons = factory.getAll(Coupon);

// @desc create coupon
// @route post api/v1/coupons
// @access private/admin-manager
exports.createCoupon = factory.createOne(Coupon);

// @desc get specific coupon by id
// @route get api/v1/coupons/:id
// @access private/admin-manager
exports.getCoupon = factory.getOne(Coupon);

// @desc update Coupon
// @route put api/v1/coupons/:id
// @access private/admin-manager
exports.updateCoupon = factory.updateOne(Coupon);

// @desc delete Coupon
// @route delete api/v1/coupons/:id
// @access private/admin-manager
exports.deleteCoupon = factory.deleteOne(Coupon);
