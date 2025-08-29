const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const Product = require("../models/productModel");
const factory = require("./handlersFactory");
const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");

exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages =asyncHandler( async (req, res, next) => {
  console.log(req.files)
  // 1 imageCover processing
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverFileName}`);
    req.body.imageCover = imageCoverFileName;
  }
  //2 images processing
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        req.body.images.push(imageName);
      })
    );
    next();
  }
});

// @desc get list of  products
// @route get api/v1/products
// @access public
exports.getProducts = factory.getAll(Product, "Products");

// @desc create product
// @route post api/v1/products
// @access private
exports.createProduct = factory.createOne(Product);

// @desc get specific product by id
// @route get api/v1/products/:id
// @access public
exports.getProduct = factory.getOne(Product);

// @desc update product
// @route put api/v1/products/:id
// @access private
exports.updateProduct = factory.updateOne(Product);
// @desc delete product
// @route delete api/v1/products/:id
// @access private
exports.deleteProduct = factory.deleteOne(Product);
