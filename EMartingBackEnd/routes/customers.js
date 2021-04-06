const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
//middleware
const imageUploader = require('../middleware/upload.js');
const imageValidator = require("../middleware/pictureImageValidator.js");

router.post(
  "/productImages",
  imageUploader,
  imageValidator, productController.postproductImages
);

router.post("/deleteToken/:id", authController.removeAuthorization);

router.post("/auth", authController.checkAuthorization);

router.post("/auth/signUp", authController.postSignUp);

router.post("/auth/login", authController.postLogin);

router.get("/shop/detailes/:id", productController.getProductInfo);

router.get("/shop", productController.getProducts);

router.post("/cart/delete/:id", productController.deleteCartItem);

router.post("/cart/order", productController.postOrder);

router.post("/cart/:id", productController.addCartProduct);

router.get("/cart/:id", productController.getCartProducts);

router.get("/", productController.welcome);

module.exports = router;