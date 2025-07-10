const express=require('express');
const {getCategories, createCategory, updateCategory, getCategory, deleteCategory}=require('../services/categoryService')
const router=express.Router();

// router.get('/',getCategories)
// router.post('/',createCategory)
router.route('/').get(getCategories).post(createCategory)
router.patch('/:id',updateCategory)
router.route('/:id').get(getCategory).delete(deleteCategory)
module.exports=router