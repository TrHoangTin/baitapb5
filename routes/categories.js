// routes/category.js
const express = require('express');
const router = express.Router();
const categorySchema = require('../models/categories');
const BuildQueies = require('../Utils/BuildQuery');

// Middleware để lọc các category không bị xóa
const filterDeleted = async (req, res, next) => {
  req.query.isDeleted = false; // Chỉ lấy các category chưa bị xóa
  next();
};

// Áp dụng middleware cho tất cả các route GET
router.use('/?', filterDeleted);

// GET /categories
router.get('/', async (req, res, next) => {
  try {
    const queries = req.query;
    const categories = await categorySchema.find(BuildQueies.QueryProduct(queries)); // Có thể cần điều chỉnh BuildQuery
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET /categories/:id
router.get('/:id', async (req, res, next) => {
  try {
    const category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST /categories
router.post('/', async (req, res, next) => {
  try {
    const body = req.body;
    const newCategory = new categorySchema({
      categoryName: body.categoryName,
      description: body.description
    });
    const savedCategory = await newCategory.save();
    res.status(201).json({
      success: true,
      data: savedCategory
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT /categories/:id
router.put('/:id', async (req, res, next) => {
  try {
    const body = req.body;
    const category = await categorySchema.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE /categories/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const category = await categorySchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Category soft deleted successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;