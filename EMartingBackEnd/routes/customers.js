const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get("/shop/detailes/:id", productController.getProductInfo);

router.get("/shop", productController.getProducts);

router.post("/cart/delete", productController.deleteCartItem);

router.post("/cart/order", productController.postOrder);

router.post("/cart", productController.addCartProduct);

router.get("/cart", productController.getCartProducts);

router.get("/", productController.welcome);

module.exports = router;