const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

const products = [];

router.get("/addProduct", productController.getAddProduct);

router.post("/addProduct",productController.postAddProduct);

// router.get("/editProduct/", (req, res)=>{
//     res.send("<h1>Hello</h1>")
// });
router.post("/editProduct/delete", productController.postDeleteProduct);
router.get("/editProduct/:id", productController.getProductInfo);
router.post("/editProduct", productController.postEditProduct);

exports.routes = router;