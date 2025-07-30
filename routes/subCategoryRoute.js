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
const { deleteCategoryValidator } = require("../utils/validators/categoryValidator");

const router = express.Router({mergeParams:true});
router
  .route("/")
  .post(setCategoryIdToBody,createSubCategoryValidator, createSubCategory)
  .get(createFilterObject,getSubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator,updateSubCategory)
  .delete(deleteCategoryValidator,deleteSubCategory);

module.exports = router;
