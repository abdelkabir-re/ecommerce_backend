const express = require("express");
const {
  addAddress,
  removeAddress,
  getLoggedUseraddresses,
} = require("../services/addressService");

const authRoute = require("../services/authService");

const router = express.Router();
router.use(authRoute.protect, authRoute.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUseraddresses);

router.delete("/:addressId", removeAddress);

module.exports = router;
