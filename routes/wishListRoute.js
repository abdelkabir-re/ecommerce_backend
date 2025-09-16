const express = require("express");
const {
  addProductToWishList,
  removeProductFromWhishList,
  getLoggedUserWishList,
} = require("../services/wishListService");

const authRoute = require("../services/authService");

const router = express.Router();
router.use(authRoute.protect, authRoute.allowedTo("user"));

router.route("/").post(addProductToWishList).get(getLoggedUserWishList);

router.delete("/:productId", removeProductFromWhishList);

module.exports = router;
