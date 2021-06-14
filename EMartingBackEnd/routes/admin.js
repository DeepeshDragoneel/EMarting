const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const products = [];

//middleware
const imageUploader = require('../middleware/upload.js');
const imageValidator = require("../middleware/pictureImageValidator.js");

router.get("/addProduct", productController.getAddProduct);

router.post("/addProduct/:id", productController.postAddProduct);

router.post("/editProduct/delete", productController.postDeleteProduct);
router.get("/editProduct/:id", productController.getProductInfo);
router.post("/editProduct", productController.postEditProduct);

exports.routes = router;