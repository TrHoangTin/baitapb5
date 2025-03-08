const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products');
let BuildQueies = require('../Utils/BuildQuery');

// GET /products
router.get('/', async function (req, res, next) {
  let queries = req.query;
  let products = await productSchema.find(BuildQueies.QueryProduct(queries));
  res.send(products);
});

// GET /products/:id
router.get('/:id', async function (req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false, // Sửa fail thành false
      message: error.message
    });
  }
});

// POST /products
router.post('/', async function (req, res, next) {
  let body = req.body;
  let newProduct = new productSchema({
    productName: body.productName,
    price: body.price,
    quantity: body.quantity,
    categoryID: body.category
  });
  await newProduct.save();
  res.send(newProduct);
});

// PUT /products/:id
router.put('/:id', async function (req, res, next) {
  try {
    let body = req.body;
    let product = await productSchema.findByIdAndUpdate(req.params.id, body, { new: true });
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(404).send({
      success: false, // Sửa fail thành false
      message: error.message
    });
  }
});

// DELETE /products/:id
router.delete('/:id', async function (req, res, next) {
  try {
    let product = await productSchema.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!product) {
      return res.status(404).send({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;