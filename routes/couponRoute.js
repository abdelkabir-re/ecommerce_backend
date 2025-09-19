const express = require("express");
const {
  getCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  createCoupon,
} = require("../services/couponService");

const authRoute = require("../services/authService");

const router = express.Router();
router.use(authRoute.protect, authRoute.allowedTo("manager", "admin"));

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).delete(deleteCoupon).patch(updateCoupon);
module.exports = router;
