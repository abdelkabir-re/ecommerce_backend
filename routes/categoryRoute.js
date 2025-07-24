const express=require('express');
const {getCategories, createCategory, updateCategory, getCategory, deleteCategory}=require('../services/categoryService');
const { getCategoryValidator, deleteCategoryValidator, updateCategoryValidator, createCategoryValidator } = require('../utils/validators/categoryValidator');
const router=express.Router();

// router.get('/',getCategories)
// router.post('/',createCategory)
router.route('/')
.get(getCategories)
.post(createCategoryValidator,createCategory)
router.patch('/:id',updateCategoryValidator,updateCategory)
router.route('/:id')
.get(getCategoryValidator,getCategory)
.delete(deleteCategoryValidator,deleteCategory)
module.exports=router