const database = require("../util/database");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Double } = require("mongodb");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (value.length < 4) {
                throw new Error("Enter Valid Username");
            }
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Enter a valid email");
            }
        },
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectID,
                    ref: "ProductModel",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

/* UserSchema.pre("save", async function(next){
    try{
        console.log("this preSave: ",this);
        this.password = await bcrypt.hash(this.password, 10);
        console.log("this.password: ",this.password);
    }
    catch(error){
        console.log(error);
    }
    next();
}) */

UserSchema.methods.authTokenGeneration = async function () {
    try {
        console.log("----------------------------------------");
        console.log("JWT THIS: ", this);
        const userToken = jwt.sign(
            {
                userid: this._id.toString(),
                email: this.email.toString(),
                username: this.username.toString(),
                password: this.password.toString(),
            },
            process.env.SECRET_KEY
        );
        this.tokens.push({
            token: userToken,
        });
        console.log(this.tokens);
        await this.save();
        return userToken;
    } catch (error) {
        console.log(error);
    }
};
UserSchema.methods.emailTokenGeneration = async function () {
    try {
        console.log("EMAIL JWT THIS: ", this);
        const emailToken = jwt.sign(
            { _id: this.email.toString() },
            process.env.SECRET_KEY
        );
        this.emailToken = emailToken;
        console.log("This.emailToken ", this.emailToken);
        await this.save();
        return emailToken;
    } catch (error) {
        console.log(error);
    }
};

UserSchema.methods.addToCart = function (product) {
    console.log("In User cart function");
    if (product.quantity > 0) {
        const existingProductIndex = this.cart.items.findIndex(
            (cItem) => cItem.productId.toString() === product._id.toString()
        );
        let newQuantity = 1;
        const newCartItems = [...this.cart.items];
        if (existingProductIndex >= 0) {
            if (
                product.quantity >
                this.cart.items[existingProductIndex].quantity
            ) {
                newQuantity =
                this.cart.items[existingProductIndex].quantity + 1;
                newCartItems[existingProductIndex].quantity = newQuantity;
            }
            else {
                console.log("ITEM CANNOT BE INCREMENTED AS PRODUCT QTY IS OUT OF STOCK");
            }
        } else {
            newCartItems.push({
                productId: product._id,
                quantity: 1,
            });
        }
        const newCart = {
            items: newCartItems,
        };
        console.log(newCart);
        this.cart = newCart;
        return this.save();
    } else {
        console.log(
            "ITEM CANNOT BE ADDED AS PRODUCT IS OUT OF STOCK"
        );
        return;
    }
};

UserSchema.methods.decrementQuantity = function (product) {
    // console.log("Decrementing Cart product: ", product);
    const newCartItems = this.cart.items.filter((cItem) => {
        /* console.log(
            cItem.productId._id.toString() +
                " === " +
                product.productId._id.toString()
        ); */
        return (
            cItem.productId !== null &&
            cItem.productId._id.toString() !== product.productId._id.toString()
        );
    });
    console.log({
        productId: product.productId._id.toString(),
        quantity: product.productId.quantity.toString(),
    });
    newCartItems.push({
        _id: product._id,
        productId: product.productId._id,
        quantity: product.productId.quantity,
    });
    this.cart.items = newCartItems;
    this.save();
    
    let temp = product;
    temp.quantity = temp.productId.quantity;
    // console.log("temp: ", temp);
    return temp;
};

UserSchema.methods.deleteCartProduct = function (product) {
    console.log("DELETECART: ", product._id);
    const newCartItems = this.cart.items.filter(
        (cItem) =>{
            console.log((cItem), " ", (cItem.productId.toString() !== product._id.toString()));
            return (cItem.productId !== null &&
            cItem._id.toString() !== product._id.toString())}
    );
    this.cart.items = newCartItems;
    return this.save();
};
UserSchema.methods.deleteCartProductByBook = function (product) {
    console.log("DELETE_CART_BY_BOOK: ", product._id);
    const newCartItems = this.cart.items.filter(
        (cItem) =>
            cItem.productId !== null &&
            cItem.productId.toString() !== product._id.toString()
    );
    this.cart.items = newCartItems;
    return this.save();
};

module.exports = mongoose.model("User", UserSchema);
/* class User{
    constructor(username, email){
        this.username = username;
        this.email = email; 
    }
    
    save = () => {
        db = database.getdb();
        return db.collection("users").insertOne(this)
        .then(result => {
            console.log("ADDED THE USER TO DB");
        })
        .catch(error => {
            console.log(error);
            throw error;
        })
    }

    static fetchById (id) {
        db = database.getdb();
        return db.collection("users").findOne({_id: new mongodb.ObjectID(id)})
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(error => {
            console.log(error);
        })
    }
}
 */
