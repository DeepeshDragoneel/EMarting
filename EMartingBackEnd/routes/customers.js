const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
//middleware
const imageUploader = require("../middleware/upload.js");
const imageValidator = require("../middleware/pictureImageValidator.js");
const product = require("../models/product");
const {
    userSignInValidatorFunc,
    userSignInValidator,
} = require("../Validators/UserSignInValidator");

router.post(
    "/productImages",
    imageUploader,
    imageValidator,
    productController.postproductImages
);

router.post("/deleteToken/:id", authController.removeAuthorization);

router.post("/auth", authController.checkAuthorization);

router.post("/auth/signUp", authController.postSignUp);

router.get("/auth/verifySignUp/:token", authController.verifySignUp);

router.get("/auth/verifiedSignUp", authController.verifedSingUp);

router.post("/auth/googleSignUp", authController.postGoogleSignUp);

router.post("/auth/googleLogIn", authController.postGoogleLoginIn);

router.post("/auth/login", authController.postLogin);

router.get("/getRatingPerStar/:query", productController.getRatingPerStar);

router.get("/review", productController.getReview);

router.post("/paymentSuccessFull", productController.postPaymentSuccessFull);

router.post("/comment", productController.postComment);

router.get("/shop", productController.getProducts);

router.get("/shop/detailes/:id", productController.getProductInfo);

router.get("/getOrders", productController.getOrders);

router.post("/order/beforePayment", productController.postbeforePayment);

router.post("/cart/delete/:id", productController.deleteCartItem);

router.post("/cart/order", productController.postOrder);

router.post("/cart/orderFailed", productController.postOrderFailed);

router.get("/callback", productController.getCallBack);

router.post("/order/razorpay", productController.postOrderRazorpay);

router.post("/verification", productController.orderVerification);

router.post("/callback", productController.postCallback);

router.post("/cart/:id", productController.addCartProduct);

router.get("/cart/:id", productController.getCartProducts);

router.get("/", productController.welcome);

module.exports = router;
