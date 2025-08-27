
const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

//nested routes
//post api/v1/categories/:categoryId/subCategories
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
//get api/v1/categories/:categoryId/subCategories
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};
// @desc create subCategory
// @route post api/v1/subCategories
// @access private
exports.createSubCategory = factory.createOne(subCategoryModel);

// @desc get specific subCategory by id
// @route get api/v1/subCategories/:id
// @access public
exports.getSubCategory = factory.getOne(subCategoryModel);

// @desc get list of  subCategories
// @route get api/v1/subCategories
// @access public
exports.getSubCategories = factory.getAll(subCategoryModel)
// @desc update subcategory
// @route put api/v1/subCategories/id
// @access private
exports.updateSubCategory = factory.updateOne(subCategoryModel);

// @desc delete subCategory
// @route delete api/v1/subCategories/:id
// @access private
exports.deleteSubCategory = factory.deleteOne(subCategoryModel);
