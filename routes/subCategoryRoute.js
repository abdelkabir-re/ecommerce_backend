const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObject,
} = require("../services/subCategoryService");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");
const {
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const authRoute = require("../services/authService");

const router = express.Router({ mergeParams: true });
router
  .route("/")
  .post(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObject, getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authRoute.protect,
    authRoute.allowedTo("manager", "admin"),
    deleteCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
