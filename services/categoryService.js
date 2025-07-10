const CategoryModel = require("../models/categoryModel");
const slugify = require("slugify");
const asyncHandler=require('express-async-handler')


// @desc get list of  categories
// @route get api/v1/categories
// @access public
exports.getCategories = asyncHandler(async(req, res) => {
  const page=req.query.page*1 || 1;
  const limit=req.query.limit*1 || 5;
  const skip=(page-1)*limit;
  const categories=await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({results:categories.length,page,data:categories})
});


// @desc create category
// @route post api/v1/categories
// @access private
exports.createCategory =asyncHandler( async(req, res) => {
  const name = req.body.name;
  const category= await CategoryModel.create({ name, slug: slugify(name) })
  res.status(201).json({ data: category })
 
});

// @desc get specific category by id
// @route get api/v1/categories/:id
// @access public
exports.getCategory=asyncHandler(async(req,res)=>{
  const id=req.params.id
  const category=await CategoryModel.findById(id)
  if(!category){
    res.status(404).json({msg:`No category with this id ${id}`})
  }
  res.status(200).json({data:category});
})

// @desc update category
// @route put api/v1/categories/id
// @access private
exports.updateCategory=asyncHandler(async(req,res)=>{
  const id=req.params.id
  const name=req.body.name
  const category=await CategoryModel.findByIdAndUpdate({_id:id},{name,slug:slugify(name)},{new:true})
  if(!category){
    res.status(404).json({msg:`No category with this id ${id}`})
  }
  res.status(200).json({data:category})
})

// @desc delete category
// @route delete api/v1/categories/:id
// @access private
exports.deleteCategory=asyncHandler(async(req,res)=>{
  const id=req.params.id
  const category=await CategoryModel.findByIdAndDelete(id)
  if(!category){
    res.status(404).json({msg:`No category with this id ${id}`})
  }
  res.status(204).send()
})
