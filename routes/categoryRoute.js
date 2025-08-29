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

const subCategoryRoute = require("./subCategoryRoute");

const router = express.Router();

router.use("/:categoryId/subCategories", subCategoryRoute);
router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .patch(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .get(getCategoryValidator, getCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
