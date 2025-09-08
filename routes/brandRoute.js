const express = require("express");
const {
  getBrand,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");
const {
  getBrandValidator,
  deleteBrandValidator,
  updateBrandValidator,
  createBrandValidator,
} = require("../utils/validators/brandValidator");

const authRoute = require("../services/authService");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .delete(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    deleteBrandValidator,
    deleteBrand
  )
  .patch(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  );
module.exports = router;
