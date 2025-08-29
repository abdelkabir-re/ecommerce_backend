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


const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage,resizeImage,createBrandValidator, createBrand);
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .delete(deleteBrandValidator, deleteBrand)
  .patch(uploadBrandImage,resizeImage,updateBrandValidator, updateBrand);
module.exports = router;
