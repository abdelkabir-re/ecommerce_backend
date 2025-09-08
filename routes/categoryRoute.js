const express = require("express");

const {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");

const authRoute = require("../services/authService");

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .patch(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .get(getCategoryValidator, getCategory)
  .delete(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    deleteCategoryValidator,
    deleteCategory
  );
module.exports = router;
