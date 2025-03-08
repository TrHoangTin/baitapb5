const { fail } = require('assert');
var express = require('express');
var router = express.Router();
let productSchema = require('../models/products')
let BuildQueies = require('../Utils/BuildQuery')

//http://localhost:3000/products?name=iph&price[$gte]=1600&price[$lte]=3000
/* GET users listing. */
router.get('/', async function(req, res, next) {
  let queries = req.query;
  let products = await productSchema.find(BuildQueies.QueryProduct(queries));
  res.send(products);
});

router.get('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    })
  }
});

router.post('/', async function(req, res, next) {
  let body = req.body;
  console.log(body);
  let newProduct = new productSchema({
    productName: body.productName,
    price: body.price,
    quantity: body.quantity,
    categoryID: body.category
  })
  await newProduct.save()
  res.send(newProduct);
});

router.put('/:id', async function(req, res, next) {
    try {
        let product = await productSchema.findById(req.params.id);
        let body = req.body;
        product.productName = body.productName;
        product.price = body.price;
        product.quantity = body.quantity;
        product.description = body.description;
        product.imgURL = body.imgURL;
        product.categoryID = body.category;
        
        await product.save();
        
        res.status(200).send({
          success:true,
          data:product
        });
      } catch (error) {
        res.status(404).send({
          success:false,
          message:error.message
        })
      }
});

router.delete('/:id', async function(req, res, next) {
  try {
    let product = await productSchema.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    
    product.isDeleted = true;
    await product.save();
    
    res.status(200).send({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;