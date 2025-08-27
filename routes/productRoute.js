const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
 
} = require("../services/productService");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator
  
} = require("../utils/validators/productValidator");


const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(createProductValidator, createProduct);
router.patch("/:id", updateProductValidator, updateProduct);
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .delete(deleteProductValidator, deleteProduct);
module.exports = router;
