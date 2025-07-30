const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const SubCategoryModel = require("../models/subCategoryModel");
const ApiError = require("../utils/apiError");
const subCategoryModel = require("../models/subCategoryModel");

//nested routes
//post api/v1/categories/:categoryId/subCategories
exports.setCategoryIdToBody=(req,res,next)=>{
  if(!req.body.category) req.body.category=req.params.categoryId
  next()
}
//get api/v1/categories/:categoryId/subCategories
exports.createFilterObject=(req,res,next)=>{
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject=filterObject
  next();

}
// @desc create subCategory
// @route post api/v1/subCategories
// @access private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});

// @desc get specific subCategory by id
// @route get api/v1/subCategories/:id
// @access public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findById(id);
  // .populate({ path: "category", select: "name -_id" });

  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id ${id}`, 404));
  }
  res.status(200).json({ data: subCategory });
});

// @desc get list of  subCategories
// @route get api/v1/subCategories
// @access public
exports.getSubCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  
  const subCategories = await subCategoryModel
    .find(req.filterObject)
    .skip(skip)
    .limit(limit);
  // .populate({ path: "category", select: "name -_id" });
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

// @desc update subcategory
// @route put api/v1/subCategories/id
// @access private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.findByIdAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id ${id}`, 404));
  }

  res.status(200).json({ data: subCategory });
});

// @desc delete subCategory
// @route delete api/v1/subCategories/:id
// @access private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findByIdAndDelete(id);
  if (!subCategory) {
    return next(new ApiError(`No subCategory with this id ${id}`, 404));
  }
  res.status(204).send();
});
