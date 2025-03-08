const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let categorySchema = require('../models/categories');
let BuildQueies = require('../Utils/BuildQuery');

router.get('/', async function(req, res, next) {
  let queries = req.query;
  let categories = await categorySchema.find(BuildQueies.QueryCategory(queries));
  res.send(categories);
});

router.get('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newCategory = new categorySchema({
    categoryName: body.categoryName,
    description: body.description
  });
  
  await newCategory.save();
  res.send(newCategory);
});
router.put('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    let body = req.body;
    
    category.categoryName = body.categoryName;
    category.description = body.description;
    
    await category.save();
    
    res.status(200).send({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
});

// DELETE a category (soft delete)
router.delete('/:id', async function(req, res, next) {
  try {
    let category = await categorySchema.findById(req.params.id);
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    category.isDeleted = true;
    await category.save();
    
    res.status(200).send({
      success: true,
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;