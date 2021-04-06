const database = require('../util/database');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(value.length<4){
                throw new Error("Enter Valid Username");
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Enter a valid email");
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectID,
                    ref: "ProductModel",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
})

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

UserSchema.methods.authTokenGeneration = async function(){
    try{
        console.log("JWT THIS: ", this);
        const userToken = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY);
        this.tokens.push({
          token: userToken,
        });
        console.log(this.tokens);
        await this.save();
        return userToken;
    }
    catch(error){
        console.log(error);
    }
}

UserSchema.methods.addToCart = function(product){
    console.log("In User cart function");
    const existingProductIndex = this.cart.items.findIndex(cItem => 
        cItem.productId.toString() === product._id.toString() 
    )
    let newQuantity = 1;
    const newCartItems = [...this.cart.items];
    if(existingProductIndex >= 0){
        newQuantity = this.cart.items[existingProductIndex].quantity + 1;
        newCartItems[existingProductIndex].quantity = newQuantity;
    }
    else{
        newCartItems.push({
            productId: product._id,
            quantity: 1
        });
    }
    const newCart = {
        items: newCartItems
    };
    console.log(newCart);
    this.cart = newCart;
    return this.save();
}

UserSchema.methods.deleteCartProduct = function(product){
    console.log("DELETECART: ",product._id);
    const newCartItems = this.cart.items.filter(cItem => 
        (cItem.productId !== null)&&(cItem.productId.toString() !== product._id.toString()) 
    )
    this.cart.items = newCartItems;
    return this.save();
}
 
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