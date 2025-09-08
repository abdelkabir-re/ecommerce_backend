const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");

const CategoryModel = require("../models/categoryModel");
const factory = require("./handlersFactory");

//Upload single image
exports.uploadCategoryImage = uploadSingleImage("image");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if(req.file){
    await sharp(req.file.buffer)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  }
  
  next();
});

// @desc get list of  categories
// @route get api/v1/categories
// @access public
exports.getCategories = factory.getAll(CategoryModel);
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
