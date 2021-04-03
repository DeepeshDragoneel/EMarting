const Product = require('../models/product');
const ProductModel = require('../models/product');
const Cart = require('../models/cart');
const mongodb = require('mongodb');
const User = require('../models/user');
const Order = require("../models/order");

exports.getAddProduct = (req, res, next)=>{
    res.send("<form method='POST' action='/admin/addProduct'><input type='text' name='Title'><button type='submit'>Add Product</button></form>")
};

exports.postAddProduct = (req, res, next)=>{
    console.log("Add Products Controller");
    //console.log(req.body);
    if(req.body.data.title!=undefined){
        /* const product = new Product(
            null,
            req.body.title,
            req.body.imageURL,
            req.body.desc,
            req.body.price
        );
        const productModel = new ProductModel(
            req.body.title,
            req.body.imageURL,
            req.body.desc,
            req.body.price
        );
        product.save();
        productModel.save()
        .then(result => {
            console.log("ADDED PRODUCT TO DB");
            res.status(202).send("ADDED PRODUCT TO DB");
        })
        .catch(error=>{
            console.log(error);
            res.status(400).send("ERROR ADDING PRODUCT TO DB")
        })
        console.log("req.body: ");
        console.log(req.body);
        // Product.fetchAll((products) => {
        //     console.log("Product: ");
        //     console.log(products);
        // });
        res.redirect("/"); */
        const product = new ProductModel({
            title: req.body.data.title,
            imageURL: req.body.data.imageURL,
            desc: req.body.data.desc,
            price: req.body.data.price,
            userId: req.body.user._id
        })
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
        console.log("req.body: ");
        console.log(req.body);
        res.redirect("/");
    }
};

exports.postEditProduct = (req, res, next) => {
    /* console.log("req.body: ");
    console.log(req.body.data); */
    if(req.body.data.id!=undefined){
        console.log("EDITING THE PRODUCT")
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
        ProductModel.findById(req.body.data.id)
        .then(product => {
            product.title = req.body.data.title,
            product.imageURL = req.body.data.imageURL,
            product.desc = req.body.data.desc,
            product.price = req.body.data.price,
            product.save()
            .then(result=>{
                console.log(result);
                console.log("PRODUCT EDITED");
                res.status(202).send("PRODUCT EDITED");
            })
            .catch(error=>{
                console.log(error);
                res.status(400).sene("ERROR UPDATING THE ITEM");
            })
            res.redirect("/")
        })
    }
}

exports.postDeleteProduct = (req, res, next) => {
    console.log("deleteController");
    console.log(req.body.data);
    ProductModel.findByIdAndRemove(req.body.data._id)
    .then(() => {
        res.status(200).send("Successfully deleted!");
    })
    .catch((error) => {
        console.log(errpr);
    })
}

exports.getProducts = (req, res, next)=>{
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
    ProductModel.find()
    .then((products) => {
        console.log("Sending Products!");
        res.status(202).json(products);
    })
    .catch((error) => {
        console.log(error);
    });

};

exports.getProductInfo = (req, res, next)=>{
    /* Product.fetchById(req.params.id, product => {
        console.log(req.params.id);
        //console.log(product);
        res.json(product);
        console.log("sending product detailes");
    }) */
    ProductModel.findById(req.params.id).then(
        product => {
            // console.log(req.params.id);
            // console.log(product);
            res.status(202).json(product);
            console.log("SENDING PRODUCT DETAILS!")
        }
    )
    .catch(error => {
        console.log(error);
    })
}

exports.addCartProduct = async(req, res, next) => {
    try{
        console.log("ADDING PRODUCT TO CART");
        //console.log(req.body);
        // if(req.body.productId != undefined){
        // }
        // else{
        //     console.log(req);
        // }
        // Cart.addProduct(req.body.product);
        const user = await User.findById(req.params.id);
        console.log(user);
        user.addToCart(req.body.product);
        res.status(200).send("Successfully added to cart!");
    }
    catch(error){
        res.status(400).send("Faaled");
    }
}

exports.getCartProducts = async(req, res, next) => {
    console.log("FETCHING CART PRODUCTS");
    try{
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
        const user = await User.findById(req.params.id);
        user.populate("cart.items.productId").execPopulate()
        .then(user => {
            console.log(user.cart.items);
            res.status(202).send(user.cart.items);
        })
        .catch(error => {
            console.log(error);
        })
    }
    catch(error){
        res.send("Error Getting cart item!");
    }
}

exports.deleteCartItem = (req,res,next) => {
    try{
        console.log("DELETING THE CART ITEM");
        // Cart.delete(req.body.data);
        req.body.user.deleteCartProduct(req.body.data);
        res.status(202).send("Delected the item from cart!");
    }
    catch(error){
        res.status(400).send("Error deleting cart item!");
    }
}

exports.postOrder = (req, res, next)=>{
    try {
      console.log("POSTING ORDER");
      console.log("ORDER POSTED");
      console.log(req.body);
      req.body.user
        .populate("cart.items.productId")
        .execPopulate()
        .then((user) => {
            console.log(user.cart.items);
            // res.status(202).json(user.cart.items);
            const products = user.cart.items.map(product => {
                return {
                    product: {...product.productId._doc},
                    quantity: product.quantity 
                }
            })
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
    }
    catch (error) {
        res.status(400).send("Error Getting cart item!");
    }
}

exports.welcome = (req, res, next)=>{
    res.send("<h1>Welcome to EMarting API</h1>");
}

exports.getErrorPage = (req, res, next)=>{
    res.status(404).send("<h1>Page Not Found!</h1>")
};