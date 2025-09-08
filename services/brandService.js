const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const BrandModel = require("../models/brandModel");
const factory = require("./handlersFactory");

//Upload single image
exports.uploadBrandImage = uploadSingleImage("image");
// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);
    req.body.image = filename;
  }

  next();
});

// @desc get list of  brands
// @route get api/v1/brands
// @access public
exports.getBrands = factory.getAll(BrandModel);

// @desc create brand
// @route post api/v1/brands
// @access private/Admin-Manager
exports.createBrand = factory.createOne(BrandModel);
// @desc get specific brand by id
// @route get api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(BrandModel);

// @desc update brand
// @route put api/v1/brands/:id
// @access private/Admin-Manager
exports.updateBrand = factory.updateOne(BrandModel);

// @desc delete brand
// @route delete api/v1/brands/:id
// @access private/Admin-Manager
exports.deleteBrand = factory.deleteOne(BrandModel);
