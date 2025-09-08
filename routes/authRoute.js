const express = require("express");
const { singup, login, forgetPassword, verifyPassResetCode, resetPassword } = require("../services/authService");
const {
  singupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

const router = express.Router();

router.post("/singup", singupValidator, singup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword",forgetPassword);
router.post("/verifyResetCode",verifyPassResetCode);
router.put("/resetPassword",resetPassword);

module.exports = router;
