
const BrandModel = require("../models/brandModel");
const factory = require("./handlersFactory");

// @desc get list of  brands
// @route get api/v1/brands
// @access public
exports.getBrands = factory.getAll(BrandModel)

// @desc create brand
// @route post api/v1/brands
// @access private
exports.createBrand = factory.createOne(BrandModel);
// @desc get specific brand by id
// @route get api/v1/brands/:id
// @access public
exports.getBrand = factory.getOne(BrandModel);

// @desc update brand
// @route put api/v1/brands/:id
// @access private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc delete brand
// @route delete api/v1/brands/:id
// @access private
exports.deleteBrand = factory.deleteOne(BrandModel);
