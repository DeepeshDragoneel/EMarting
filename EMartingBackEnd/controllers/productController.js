const Product = require("../models/product");
const ProductModel = require("../models/product");
const Cart = require("../models/cart");
const mongodb = require("mongodb");
const User = require("../models/user");
const UserGoogle = require("../models/userGoogle");
const Comment = require("../models/comments");
const Order = require("../models/order");
const fs = require("fs");
const PaytmChecksum = require("../routes/PaytmCheckSum");
const { v4: uuidv4 } = require("uuid");
const formidable = require("formidable");
const https = require("https");
const path = require("path");
const axios = require("axios");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const crypto = require("crypto");
const { cloudinary } = require("../util/cloudinary");
var FormData = require("form-data");
const jwt = require("jsonwebtoken");

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

const rasorpay = new Razorpay({
    key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
    key_secret: process.env.REACT_APP_RAZORPAY_SECRET,
});

exports.getAddProduct = (req, res, next) => {
    res.send(
        "<form method='POST' action='/admin/addProduct'><input type='text' name='Title'><button type='submit'>Add Product</button></form>"
    );
};

exports.postComment = async (req, res, next) => {
    try {
        if (req.body.userId.googleId === undefined) {
            // console.log("Not google: ",req.body.userId);
            // res.send("Done");
            const comment = new Comment({
                rating: req.body.rating,
                heading: req.body.heading,
                desc: req.body.desc,
                userId: req.body.userId._id,
                productId: req.body.productId,
            });
            console.log(comment);
            const result = await comment.save();
            const product = await ProductModel.findById(req.body.productId);
            const rating = (product.rating + req.body.rating) / 2;
            console.log("RATING: ", round(rating, 1));
            product.rating = rating;
            const productResult = await product.save();
            res.send("SUCCESS");
        } else {
            // console.log("googleuser : ",req.body.userId);
            // res.send("Done");
            const comment = new Comment({
                rating: req.body.rating,
                heading: req.body.heading,
                desc: req.body.desc,
                googleUserId: req.body.userId._id,
                productId: req.body.productId,
            });
            console.log(comment);
            const result = await comment.save();
            const product = await ProductModel.findById(req.body.productId);
            const rating = (product.rating + req.body.rating) / 2;
            console.log("RATING: ", round(rating, 1));
            product.rating = rating;
            const productResult = await product.save();
            res.send("SUCCESS");
        }
    } catch (error) {
        console.log(error);
        res.send("ERROR");
    }
};

exports.postAddProduct = async (req, res, next) => {
    // console.log("Add Products Controller: ", req);
    // console.log("Add Products Controller: ", req.params);
    try {
        {
            /* let fromData = new FormData();
        fromData.append("file", req.files.file);
        fromData.append("upload_preset", req.body.upload_preset);
        console.log(formData);
        const result = await axios({
            method: "post",
            url: `https://api.cloudinary.com/v1_1/emarting/image/upload`,
            data: formData,
            headers: {
                "content-type": "multipart/form-data",
            },
        });
        console.log(result); */
        }

        console.log(req.files.file);
        const uploadCloudinary = await cloudinary.uploader.upload(
            req.files.file.tempFilePath,
            {
                upload_preset: `irffzxsz`,
            }
        );
        console.log(uploadCloudinary);
        /* res.json({
            "result": "SUCCESS"
        }) */
        const temp = JSON.parse(req.body.data);
        console.log(temp);
        const product = new ProductModel({
            title: temp.title,
            image: uploadCloudinary.secure_url,
            image_name: uploadCloudinary.public_id,
            desc: temp.desc,
            genre: temp.genre,
            price: temp.price,
            pages: temp.pages,
            quantity: temp.quantity,
            author: temp.author,
            userId: req.params.id,
        });
        console.log(product);
        product
            .save()
            .then((result) => {
                console.log("ADDED PRODUCT TO DB");
                res.status(202).send("ADDED PRODUCT TO DB");
            })
            .catch((error) => {
                console.log(error);
                res.status(400).send("ERROR ADDING PRODUCT TO DB");
            });
    } catch (error) {
        console.log("CLOUDINARY ERROR: ", error);
        res.send("ERROR");
    }

    /* if (req.files.file !== null) {
        req.files.file.mv(`./uploads/${req.files.file.name}`, (error) => {
            console.log("FILE UPLOAD ERROR: ", error);
        });
    }
    req.body.data = JSON.parse(req.body.data);
    if (req.body.data.title != undefined && req.files.file !== null) {
        //console.log(image);
        res.redirect("/");
    } */
};

exports.postEditProduct = async (req, res, next) => {
    try {
        console.log("EDITING THE PRODUCT");
        req.body.data = JSON.parse(req.body.data);
        if (req.body.data.title != undefined && req.files.file !== null) {
            const product = await ProductModel.findById(req.body.data.id);
            console.log("EDITTING PRODUCT:  ", product);
            const temp = req.body.data;
            /* console.log("DELETING: ", `./uploads/${product.image.split("/")[4]}`);
            fs.unlinkSync(`./uploads/${product.image.split("/")[4]}`); */
            let uploadCloudinary = await cloudinary.uploader.destroy(
                product.image_name,
                function (error, result) {
                    console.log(result, error);
                }
            );
            uploadCloudinary = await cloudinary.uploader.upload(
                req.files.file.tempFilePath,
                {
                    upload_preset: `irffzxsz`,
                }
            );
            console.log(uploadCloudinary.secure_url);
            /* req.files.file.mv(`./uploads/${req.files.file.name}`, (error) => {
                console.log("FILE UPLOAD ERROR: ", error);
            }); */
            (product.title = temp.title),
                (product.image = uploadCloudinary.secure_url),
                (product.desc = temp.desc),
                (product.genre = temp.genre),
                (product.price = temp.price),
                (product.pages = temp.pages),
                (product.quantity = temp.quantity),
                (product.author = temp.author),
                (product.image_name = uploadCloudinary.public_id);
            console.log("AFTER EDITING: ", product);
            product
                .save()
                .then((result) => {
                    console.log(result);
                    console.log("PRODUCT EDITED");
                    res.status(202).send("PRODUCT EDITED");
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).send("ERROR UPDATING THE ITEM");
                });
        }
    } catch (error) {
        console.log("CLOUDINARY ERROR: ", error);
        res.send("ERROR");
    }
    /* console.log("req.body: ");
    console.log(req.body.data); */

    /* const product = new Product(
          req.body.data.id,
          req.body.data.title,
          req.body.data.imageURL,
          req.body.data.desc,
          req.body.data.price
        );
        product.save();
        // console.log(req.body);
        // Product.fetchAll((products) => {
        //   console.log("Product: ");
        //   console.log(products);
        // });
        res.redirect("/"); */
    /* const productModel = new ProductModel(
            req.body.data.title,
            req.body.data.imageURL,
            req.body.data.desc,
            req.body.data.price,
            new mongodb.ObjectID(req.body.data.id)
        ) */
};

exports.postDeleteProduct = (req, res, next) => {
    console.log("deleteController");
    console.log(req.body.data);
    ProductModel.findByIdAndRemove(req.body.data._id)
        .then(() => {
            res.status(200).send("Successfully deleted!");
        })
        .catch((error) => {
            console.log(errpr);
        });
};

exports.getProducts = (req, res, next) => {
    console.log("Seding Products");
    console.log(req.query);
    /* Product.fetchAll((products)=>{
        res.json(products);
    }) */
    /* ProductModel.fetchAll()
    .then((products)=>{
        console.log("Sending Products!");
        res.status(202).json(products);
    })
    .catch(error=>{
        console.log(error);
    }); */
    let productJson, prductCount;
    ProductModel.find({ title: { $regex: req.query.query, $options: "i" } })
        .skip((req.query.pageNumber - 1) * 6)
        .limit(6)
        .then((products) => {
            console.log("Sending Products!");
            productJson = products;
            ProductModel.count({
                title: { $regex: req.query.query, $options: "i" },
            })
                .then((count) => {
                    console.log("Sending Products!");
                    prductCount = count;
                    res.status(202).json({
                        products: productJson,
                        count: prductCount - req.query.pageNumber * 6,
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getReview = async (req, res, next) => {
    try {
        console.log(req.query);
        let reviewJson, reviewCount;
        Comment.find({ productId: req.query.productId })
            .populate("userId", "username")
            .populate("googleUserId", "username")
            .skip((req.query.pageNumber - 1) * 6)
            .limit(6)
            .then((reviews) => {
                console.log("Sending Reviews!");
                reviewJson = reviews;
                console.log("reviewJSon: ", reviewJson);
                Comment.count({
                    productId: req.query.productId,
                })
                    .then((count) => {
                        console.log("Sending REVIEW COUNT!");
                        reviewCount = count;
                        res.status(202).json({
                            review: reviewJson,
                            count: reviewCount - req.query.pageNumber * 6,
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
        res.send("ERROR");
    }
};

exports.getProductInfo = (req, res, next) => {
    ProductModel.findById(req.params.id)
        .then((product) => {
            // console.log(req.params.id);
            // console.log(product);
            res.status(202).json(product);
            console.log("SENDING PRODUCT DETAILS!");
            console.log(product);
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getRatingPerStar = async (req, res, next) => {
    try {
        // let mappingStarsRating = { "1": "one", "2": "two", "3": "three", '4': "four", "5":"five" };
        let ratingPerStar = {
            one: 0,
            two: 0,
            three: 0,
            four: 0,
            five: 1,
        };
        console.log("getRatingPerStar");
        console.log(req.params.query);
        const comments = await Comment.find({ productId: req.params.query });
        console.log("getRatingPerStar: ", comments);
        for (var i = 0; i < comments.length; i++) {
            if (comments[i].rating === 1) {
                ratingPerStar = {
                    ...ratingPerStar,
                    one: ratingPerStar.one + 1,
                };
            }
            if (comments[i].rating === 2) {
                ratingPerStar = {
                    ...ratingPerStar,
                    two: ratingPerStar.two + 1,
                };
            }
            if (comments[i].rating === 3) {
                ratingPerStar = {
                    ...ratingPerStar,
                    three: ratingPerStar.three + 1,
                };
            }
            if (comments[i].rating === 4) {
                ratingPerStar = {
                    ...ratingPerStar,
                    four: ratingPerStar.four + 1,
                };
            }
            if (comments[i].rating === 5) {
                ratingPerStar = {
                    ...ratingPerStar,
                    five: ratingPerStar.five + 1,
                };
            }
        }
        console.log(ratingPerStar);
        const total =
            ratingPerStar.one +
            ratingPerStar.two +
            ratingPerStar.three +
            ratingPerStar.four +
            ratingPerStar.five;
        ratingPerStar.one =
            ratingPerStar.one === 0
                ? 0
                : round((ratingPerStar.one / total) * 100, 1);
        ratingPerStar.two =
            ratingPerStar.two === 0
                ? 0
                : round((ratingPerStar.two / total) * 100, 1);
        ratingPerStar.three =
            ratingPerStar.three === 0
                ? 0
                : round((ratingPerStar.three / total) * 100, 1);
        ratingPerStar.four =
            ratingPerStar.four === 0
                ? 0
                : round((ratingPerStar.four / total) * 100, 1);
        ratingPerStar.five =
            ratingPerStar.five === 0
                ? 0
                : round((ratingPerStar.five / total) * 100, 1);
        console.log(ratingPerStar);
        res.send(ratingPerStar);
    } catch (error) {
        console.log(error);
        res.send("error");
    }
};

exports.addCartProduct = async (req, res, next) => {
    try {
        console.log("ADDING PRODUCT TO CART");
        console.log(req.params);
        console.log(req.body.product);
        let user = await User.findById(req.params.id);
        if (user === null) {
            user = await UserGoogle.findById(req.params.id);
        }
        console.log(user);
        user.addToCart(req.body.product);
        res.status(200).send("Successfully added to cart!");
    } catch (error) {
        res.status(400).send("Failed");
    }
};

exports.getCartProducts = async (req, res, next) => {
    console.log("FETCHING CART PRODUCTS");
    try {
        /* Cart.getCartItems( (func)=> {
            Product.fetchAll((items) => {
                const cart=[];
                for(item of items){
                    const cartProductData = func.products.find(p => p.id ===item.id);
                    if(cartProductData){
                        cart.push({productData: item, quantity: cartProductData.quantity});
                    }
                }
                res.status(200).json(cart);
            })
        }) */
        console.log("----------------------");
        console.log(req.params.id);
        console.log("----------------------");
        let user;
        user = await User.findById(req.params.id);
        // console.log("USER: ", user);
        if (user === null) {
            user = await UserGoogle.findById(req.params.id);
            // console.log("GOOGLE-USER: ", user);
        }
        // console.log("Cart user: ", user);
        let item_temp = null;
        user.populate("cart.items.productId")
            .execPopulate()
            .then((user) => {
                // console.log(user.cart.items);
                user.cart.items.forEach(async (item) => {
                    // console.log("item :",item);
                    if (item.productId === null) {
                        console.log("INSIDEIF: ", item);
                        user.deleteCartProduct(item);
                    }
                    // const originalProduct = await ProductModel.findById(item.productId);
                    if (item.quantity > item.productId.quantity) {
                        console.log("more than original product");
                        item_temp = user.decrementQuantity(item);
                    }
                    if (item.productId.quantity === 0) {
                        user.deleteCartProduct(item);
                    }
                });
                // console.log(user.cart.items);
                if (item_temp !== null) {
                    user.cart.items = user.cart.items.filter((item) => {
                        /* console.log(
                            item._id.toString() !== item_temp._id.toString(),
                            " ",
                            item._id != item_temp._id,
                            " ",
                            item._id, " ", item_temp._id
                        ); */
                        return item._id.toString() !== item_temp._id.toString();
                    });
                    user.cart.items.push(item_temp);
                    console.log(
                        "user.cart.items after change: ",
                        user.cart.items
                    );
                    console.log("item_temp: ", item_temp);
                    res.status(202).send(user.cart.items);
                } else {
                    res.status(202).send(user.cart.items);
                }
            })
            .catch((error) => {
                console.log("Error Getting cart item!: ", error);
            });
    } catch (error) {
        res.send("Error Getting cart item!");
    }
};

exports.deleteCartItem = async (req, res, next) => {
    try {
        console.log("DELETING THE CART ITEM");
        console.log(req.body.data);
        let user;
        user = await User.findById(req.params.id);
        //console.log("DeleteCartItems: ",user);
        if (user === null) {
            user = await UserGoogle.findById(req.params.id);
        }
        user.deleteCartProductByBook(req.body.data);
        res.status(202).send("Delected the item from cart!");
    } catch (error) {
        res.status(400).send("Error deleting cart item!");
    }
};

exports.getCallBack = (req, res) => {
    console.log("getCallBack    ");
    res.redirect("http://localhost:8000");
};

exports.postCallback = async (req, res) => {
    console.log("POSTCALLBACK");
    const callback_res = res;
    const form = new formidable.IncomingForm();
    try {
        await form.parse(req, (err, fields, file) => {
            /* import checksum generation utility */
            fields = req.body;
            console.log("form-parse", fields);
            paytmChecksum = fields.CHECKSUMHASH;
            //delete fields.CHECKSUMHASH;
            console.log("Hello");
            var isVerifySignature = PaytmChecksum.verifySignature(
                fields,
                process.env.PAYTM_MKEY,
                paytmChecksum
            );
            if (isVerifySignature) {
                var paytmParams = {};
                paytmParams["MID"] = fields.MID;
                paytmParams["ORDERID"] = fields.ORDERID;
                /*
                 * Generate checksum by parameters we have
                 * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
                 */
                PaytmChecksum.generateSignature(
                    paytmParams,
                    process.env.PAYTM_MKEY
                ).then(async function (checksum) {
                    paytmParams["CHECKSUMHASH"] = checksum;

                    var post_data = JSON.stringify(paytmParams);

                    // var options = {
                    // /* for Staging */
                    //     hostname: "securegw-stage.paytm.in",

                    //     /* for Production */
                    //     // hostname: 'securegw.paytm.in',

                    //     port: 443,
                    //     path: "/order/status",
                    //     method: "POST",
                    //     headers: {
                    //         "Content-Type": "application/json",
                    //         "Content-Length": post_data.length,
                    //     },
                    // };

                    var response = "";
                    let res_axios;
                    try {
                        const result = await axios({
                            method: "POST",
                            url: "http://securegw-stage.paytm.in/order/status",
                            headers: {
                                "content-type": "application/json",
                                accept: "application/json",
                            },
                            data: post_data,
                        });
                        console.log("RESULT: ", result.data);
                        res_axios = result.data;
                    } catch (error) {
                        console.log(error);
                    }
                    console.log("res_axios: ", res_axios);
                    if (res_axios.STATUS === "TXN_SUCCESS") {
                        console.log("RES_AXIOS: PAYMENT SUCCESSFULL");
                        callback_res.redirect("http://localhost:8000");
                        // res.redirect("http://localhost:8000");
                    }
                    /* var post_req = https.request(options, function (post_res) {
                        post_res.on("data", function (chunk) {
                            response += chunk;
                    });
        
                    post_res.on("end", function () {
                        // let result = JSON.parse(response);
                        // if (result.STATUS === "TXN_SUCCESS") {
                        //   //store in db
                        //   db.collection("payments")
                        //     .doc("mPDd5z0pNiInbSIIotfj")
                        //     .update({
                        //       paymentHistory: firebase.firestore.FieldValue.arrayUnion(
                        //         result
                        //       ),
                        //     })
                        //     .then(() => console.log("Update success"))
                        //     .catch(() => console.log("Unable to update"));
                        // }
        
                        // res.redirect(`REACT_APP_BASE_URLstatus/${result.ORDERID}`);
                        // res.json(response);
                        console.log("Response: ", response);
                        let response_temp = JSON.parse(response);
                        console.log("RESPONSE_TEMP: ", response_temp);
                        res.redirect("http://localhost:8000");
                        if(response_temp.STATUS === "TXN_SUCCESS"){
                            console.log("PAYMENT SUCCESSFULL")
                        }
                    });
                    });
        
                    console.log("HELLO BEFORE WRITE");
                    post_req.write(post_data);
                    console.log("HELLO BEFORE END");
                    post_req.end();
                    console.log("HELLO AFTER END"); */
                    /* res.redirect("http://localhost:3000")
                    console.log("AFTER RES.RESIRECT");
                    res.setHeader('Location', '/')
                    console.log("AFTER RES.SETHEADER") */
                });
            } else {
                console.log("Checksum Mismatched");
            }
        });
        // return res.redirect("http://localhost:3000");
    } catch (error) {
        console.log(error);
    }
};

exports.postOrder = async (req, res, next) => {
    //https://securegw-stage.paytm.in/order/process
    //https://securegw-stage.paytm.in/order/status
    /* import checksum generation utility */
    var params = {};

    /* initialize an array */
    console.log("PostORDER: ", req.body);
    try {
        const user = await User.findById(req.body.id);
        const amount = req.body.totalPrice;
        const email = user.email;
        const totalAmount = JSON.stringify(amount);
        params["MID"] = process.env.PAYTM_MID;
        params["WEBSITE"] = process.env.PAYTM_WEBSITE;
        params["CHANNEL_ID"] = process.env.PAYTM_CHANNEL_ID;
        params["INDUSTRY_TYPE_ID"] = process.env.PAYTM_INDUSTRY_TYPE_ID;
        params["ORDER_ID"] = uuidv4();
        params["CUST_ID"] = req.body.id;
        params["TXN_AMOUNT"] = totalAmount;
        params["CALLBACK_URL"] = "http://localhost:8000/callback";
        params["EMAIL"] = email;
        params["MOBILE_NO"] = "8185910167";

        /**
         * Generate checksum by parameters we have
         * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
         */
        var paytmChecksum = PaytmChecksum.generateSignature(
            params,
            process.env.PAYTM_MKEY
        );
        paytmChecksum
            .then(function (checksum) {
                let paytmParams = {
                    ...params,
                    CHECKSUMHASH: checksum,
                };
                res.json(paytmParams);
            })
            .catch(function (error) {
                console.log(error);
            });
    } catch (error) {
        console.log(error);
    }
    /*   try {
        console.log("POSTING ORDER");
        console.log("ORDER POSTED");
        //console.log(req.body);
        req.body.user
          .populate("cart.items.productId")
          .execPopulate()
          .then((user) => {
            console.log(user.cart.items);
            // res.status(202).json(user.cart.items);
            const products = user.cart.items.map((product) => {
              return {
                product: { ...product.productId._doc },
                quantity: product.quantity,
              };
            });
            const order = new Order({
              products: products,
              user: {
                username: req.body.user.username,
                userId: req.body.user._id,
              },
            });
            console.log(order);
            return order.save();
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        res.status(400).send("Error Getting cart item!");
      } */
};

exports.postOrderRazorpay = async (req, res) => {
    let user = await User.findById(req.body.id);
    if (user === null) {
        user = await UserGoogle.findById(req.body.id);
    }
    const payment_capture = 1;
    console.log(req.body);
    const data = req.body;
    const amount = data.totalPrice;
    console.log("amount: ", amount);
    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt: shortid.generate(),
        payment_capture,
    };
    try {
        const response = await rasorpay.orders.create(options);
        console.log(response);
        res.json({
            id: response.id,
            currency: "INR",
            amount: response.amount,
            email: user.email,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.postbeforePayment = async (req, res, next) => {
    try {
        // console.log(req.body.productId);
        const productId = req.body.productId;
        if (productId === undefined) {
            const userToken = jwt.verify(
                req.body.token,
                process.env.SECRET_KEY
            );
            let user = await User.findById(userToken.userid);
            if (user === null) {
                user = await UserGoogle.findById(userToken.userid);
            }
            const cart = user.cart.items;
            const products = cart.map((item, idx) => ({
                product: item.productId,
                quantity: item.quantity,
            }));
            /* products.forEach(async (item, idx) => {
                console.log("FOR EACH :", item);
                const productModel = await ProductModel.findById(item.product);
                console.log("PRODUCTMODEL: ",productModel);
                if (productModel.quantity < item.quantity) {
                    console.log("LESS");
                    res.status(400).json({
                        status: "ERROR",
                        msg: "Some of the Products IN Your cart are out of stock!",
                    });
                    break;
                } else {
                    productModel.quantity = productModel.quantity - item.quantity;
                }
                // console.log(productModel);
                // const productRes = await productModel.save();
            }); */
            products.forEach(async (item, idx) => {
                console.log("FOR EACH :", item);
                const productModel = await ProductModel.findById(item.product);
                productModel.quantity = productModel.quantity - item.quantity;
                // console.log(productModel);
                const productRes = await productModel.save();
            });
        } else {
            const productToBeRemoved = await ProductModel.findById(productId);
            if (productToBeRemoved.quantity <= 0) {
                res.json({ status: "ERROR", msg: "PRODUCT OUT OF STOCK" });
            } else {
                productToBeRemoved.quantity = productToBeRemoved.quantity - 1;
            }
            console.log("productToBeRemoved: ", productToBeRemoved);
            const productRes = await productToBeRemoved.save();
        }
        res.json({ status: "SUCCESS" });
    } catch (error) {
        console.log(error);
        res.send(404).json({ status: "ERROR", msg: "PRODUCT OUT OF STOCK" });
    }
};

exports.postOrderFailed = async (req, res, next) => {
    try {
        console.log("payment failed");
        productId = req.body.productId;
        if (productId === undefined) {
            const userToken = jwt.verify(
                req.body.token,
                process.env.SECRET_KEY
            );
            let user = await User.findById(userToken.userid);
            if (user === null) {
                user = await UserGoogle.findById(userToken.userid);
            }
            const cart = user.cart.items;
            const products = cart.map((item, idx) => ({
                product: item.productId,
                quantity: item.quantity,
            }));
            products.forEach(async (item, idx) => {
                console.log("FOR EACH :", item);
                const productModel = await ProductModel.findById(item.product);
                productModel.quantity = productModel.quantity + item.quantity;
                // console.log(productModel);
                const productRes = await productModel.save();
            });
            res.send("SUCCESS");
        } else {
            console.log(productId);
            const productToBeAdded = await ProductModel.findById(productId);
            productToBeAdded.quantity = productToBeAdded.quantity + 1;
            const productRes = await productToBeAdded.save();
            res.send(productRes);
        }
    } catch (error) {
        console.log(error);
    }
    res.send("SUCCESS");
};

exports.postPaymentSuccessFull = async (req, res, next) => {
    try {
        // console.log("postPaymentSuccessFull: ", req.body);
        const userToken = jwt.verify(req.body.token, process.env.SECRET_KEY);
        let user = await User.findById(userToken.userid);
        if (user === null) {
            user = await UserGoogle.findById(userToken.userid);
        }

        console.log("payment succesfull: ", user.username);
        let products;
        if (req.body.productId === undefined) {
            const cart = user.cart.items;
            products = cart.map((item, idx) => ({
                product: item.productId,
                quantity: item.quantity,
            }));
            user.cart.items = [];
            const res = await user.save();
        } else {
            console.log(req.body.productId);
            products = await ProductModel.findById(req.body.productId);
            products.quantity = 1;
            products = [products];
        }
        console.log("PRODUCTS ORDERED: ", products);
        const order = new Order({
            user: {
                userId: user._id,
                username: user.username,
            },
            products: products,
            address: req.body.location.Address,
            zipCode: req.body.location.ZIP,
            phoneNo: req.body.location.PhoneNumber,
            city: req.body.location.City,
        });
        console.log("ORDER: ", order);
        const result = await order.save();
        // const allProducts = await ProductModel.find({});
        // console.log("All products: ", allProducts);

        console.log("ORDER: ", order);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send("ERROR");
    }
};

exports.getOrders = async (req, res, next) => {
    try {
        // console.log("Hello: ", req.query.token);
        const { userid, username } = jwt.verify(
            req.query.token,
            process.env.SECRET_KEY
        );
        // console.log(userid, username);
        const orders = await Order.find({ "user.username": username });
        // console.log(orders);
        res.send(orders);
    } catch (error) {
        console.log(error);
    }
};

exports.orderVerification = (req, res) => {
    const secret = process.env.REACT_APP_RAZORPAY_WEBHOOK_SECRET;
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
    console.log("Hello");
    console.log(req.body);
    console.log(digest, req.headers["x-razorpay-signature"]);
    if (digest === req.headers["x-razorpay-signature"]) {
        console.log("PAYED!");
        res.json({
            status: "OK",
        });
        /* res.redirect("REACT_APP_BASE_URLorder?msg=SUCCESS"); */
        /* res.setHeader("Location", "/"); */
    } else {
        res.json({
            status: "OK",
        });
    }
};

exports.welcome = (req, res, next) => {
    res.send("<h1>Welcome to EMarting API</h1>");
};

exports.getErrorPage = (req, res, next) => {
    res.status(404).send("<h1>Page Not Found!</h1>");
};

exports.postproductImages = (req, res, next) => {
    res.json({
        message: "SUCCESS",
    });
};
