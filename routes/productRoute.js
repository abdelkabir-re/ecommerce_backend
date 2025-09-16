const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const reviewRoute=require("./reviewRoute")

const authRoute = require("../services/authService");

const router = express.Router();


router.use('/:productId/reviews',reviewRoute)

router
  .route("/")
  .get(getProducts)
  .post(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router.patch(
  "/:id",
  authRoute.protect,
  authRoute.allowedTo("manager", "admin"),
  uploadProductImages,
  resizeProductImages,
  updateProductValidator,
  updateProduct
);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .delete(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
