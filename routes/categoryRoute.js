const express = require("express");
const {
  getCategories,
  createCategory,
  updateCategory,
  getCategory,
  deleteCategory,
} = require("../services/categoryService");
const {
  getCategoryValidator,
  deleteCategoryValidator,
  updateCategoryValidator,
  createCategoryValidator,
} = require("../utils/validators/categoryValidator");

const subCategoryRoute=require("./subCategoryRoute")

const router = express.Router();

router.use('/:categoryId/subCategories',subCategoryRoute)
router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidator, createCategory);
router.patch("/:id", updateCategoryValidator, updateCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .delete(deleteCategoryValidator, deleteCategory);
module.exports = router;
