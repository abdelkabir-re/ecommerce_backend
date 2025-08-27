
const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");

// @desc get list of  categories
// @route get api/v1/categories
// @access public
exports.getCategories = factory.getAll(CategoryModel)
// @desc create category
// @route post api/v1/categories
// @access private
exports.createCategory = factory.createOne(CategoryModel);

// @desc get specific category by id
// @route get api/v1/categories/:id
// @access public
exports.getCategory = factory.getOne(CategoryModel);

// @desc update category
// @route put api/v1/categories/id
// @access private
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc delete category
// @route delete api/v1/categories/:id
// @access private
exports.deleteCategory = factory.deleteOne(CategoryModel);
