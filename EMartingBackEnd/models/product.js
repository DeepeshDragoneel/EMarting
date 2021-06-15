const fs = require('fs');
const path = require('path');
const uuid = require("uuid");
const cart = require('./cart');
const database = require('../util/database');
const mongodb = require('mongodb');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        trim: true,
        require: true,
    },
    image_name: {
        type: String,
        trim: true,
        require: true,
    },
    genre: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 5.0,
    },
    author: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    },
    desc: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model('ProductModel', productSchema);

/* const p = path.join(__dirname,"..", 'data', "products.json");
module.exports = class Product{
    constructor(id, t, img, desc, rps){
        this.id = id;
        this.title = t;
        this.imageURL = img,
        this.desc = desc,
        this.price = rps
    }
    save(){
        console.log(p);
        fs.readFile(p, (error, data)=>{
            let products = [];
            if(!error){
                products = JSON.parse(data);
            }
            if(this.id){
                const existingProductIndex = products.findIndex(product => product.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (error) => {
                  console.log(error);
                });
            }
            else{
                this.id = uuid.v4();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (error)=>{
                    console.log(error);
                })
            }
        })
        console.log("From Product: ");
        console.log(this);
    }

    static fetchAll = (cb) => {
        fs.readFile(p, (error, data)=>{
            if(error){
                console.log(1);
                cb([]);
            }
            else{
                console.log(2);
                cb(JSON.parse(data));
            }
        })
    }

    static fetchById = (id, cb) => {
        fs.readFile(p, (error, data)=>{
            if(error){
                cb([]);
            }
            else{
                const product = JSON.parse(data).find(item => item.id === id);
                cb(product); 
            }
        })
    }

    static delete = async(product)=> {
        let updatedProducts;
        fs.readFile(p, (error, data) => {
            if (!error){
                updatedProducts = JSON.parse(data).filter((item) => item.id !== product.id);
                // console.log("Updated Products:")
                // console.log(updatedProducts);
            }
            fs.writeFile(p, JSON.stringify(updatedProducts), error => {
                if(!error){
                    cart.delete(product);
                }
            })
        });
    }
} */

/* class ProductModel{
    constructor(t, img, desc, rps, id){
        this.title = t;
        this.imageURL = img,
        this.desc = desc,
        this.price = rps,
        this._id = id
    }
    save(){
        const db = database.getdb();
        // console.log(this);
        if(this._id){
            return db
            .collection("products")
            .updateOne({_id: new mongodb.ObjectID(this._id)}, {$set: this})
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
        }
        else{
            return db
            .collection("products")
            .insertOne(this)
            .then((result) => console.log(result))
            .catch((error) => console.log(error));
        }
    }
    static fetchAll = () => {
        const db = database.getdb();
        return db.collection("products").find().toArray()
        .then(products => {
            //console.log(products);
            return products;
        })
        .catch(error => {
            console.log(error);
        });
    }
    static fetchById = (id) => {
        const db = database.getdb();
        return db.collection("products").find({_id: new mongodb.ObjectID(id)})
        .next()
        .then(products => {
            return (products);
        })
        .catch(error=>{
            console.log(error);
        })
    }
    static delete = (id) => {
        const db = database.getdb();
        return db.collection("products").deleteOne({_id: new mongodb.ObjectID(id)})
        .then(result => {
            console.log("DELETED THE ITEM");
        })
        .catch(error => {
            console.log(error);
        })
    }
}

module.exports.ProductModel = ProductModel; */