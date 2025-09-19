const express = require("express");
const {
  addProductToCart,
  getLoggedUserCart,
  removeItemFromCartItem,
  clearUserCart,
  updateCatItemQuantity,
  applyCoupon,
} = require("../services/cartService");

const authRoute = require("../services/authService");

const router = express.Router();
router.use(authRoute.protect, authRoute.allowedTo("user"));

router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearUserCart);

router.route("/applyCoupon").put(applyCoupon);

router.route("/:itemId").put(updateCatItemQuantity);

router.route("/:id").delete(removeItemFromCartItem);

module.exports = router;
