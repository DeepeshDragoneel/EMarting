const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, "..", "data", "cart.json");

module.exports = class Cart {
    static addProduct(item) {
        fs.readFile(p, (error, data) => {
            let cart = { products: [], totalPrice: 0 }
            if (!error) {
                cart = JSON.parse(data);
            }
            const existingProductIndex = cart.products.findIndex(product => product.id === item.id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProducts;
            if (existingProduct) {
                updatedProducts = {...existingProduct };
                updatedProducts.quantity = updatedProducts.quantity + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProducts;
            } else {
                updatedProducts = { id: item.id, quantity: 1 };
                cart.products = [...cart.products, updatedProducts];
            }
            cart.totalPrice = cart.totalPrice + +item.price;
            fs.writeFile(p, JSON.stringify(cart), (error) => {
                console.log("error:")
                console.log(error);
                throw new Error("Failed to add to cart in cart!");
            })
        })
    }

    static delete(cartProduct) {
        fs.readFile(p, (error, data) => {
            if (error) {
                return;
            }
            console.log("in cart delete");
            const cart = JSON.parse(data);
            const updatedCart = {...cart };
            const product = updatedCart.products.find(item => item.id === cartProduct.id);
            const productQuantity = product.quantity;
            updatedCart.products = updatedCart.products.filter(item => item.id !== cartProduct.id);
            updatedCart.totalPrice = updatedCart.totalPrice - (productQuantity * cartProduct.price);
            fs.writeFile(p, JSON.stringify(updatedCart), (error) => {
                console.log(error);
            })
        })
    }

    static getCartItems(func) {
        fs.readFile(p, (error, data) => {
            const cart = JSON.parse(data);
            if (error) {
                func(null);
            }
            func(cart);
        })
    }
}