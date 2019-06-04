const path = require("path");

const express = require("express");

const productController = require('../controllers/admin');
const router = express.Router();

//created an array to push the request typed in the text field.
// /admin/add-product => GET
router.get("/add-product", productController.getAddProduct); //product controller reference


// /admin/products => GET
router.get("/products",productController.getProducts);

// /admin/add-product => POST
router.post("/add-product", productController.postAddProduct);

module.exports = router;
