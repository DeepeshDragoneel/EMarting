const database = require('../util/database');
const mongodb = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
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
    }
})

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
    const newCartItems = this.cart.items.filter(cItem => 
        cItem.productId.toString() !== product._id.toString()
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