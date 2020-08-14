const fs = require('fs');
const path = require('path')
const ownPath = require('../util/path');
const p = path.join(ownPath, 'data', 'cart.json');
module.exports = class Cart{

    static addProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) =>{
            let cart = {products: [], totalPrice: 0};
            if(!err){
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if(existingProduct){
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err =>{
                console.log(err);
            })
        });
    }

    static deleteProduct(id,productPrice){
        fs.readFile(p, (err, fileContent) =>{
            if(err){
                return;
            }
            const cart = JSON.parse(fileContent);
            const updatedCart = {...cart};
            const product = updatedCart.products.find(prod => prod.id === id);
            if(!product){
                return;
            }
            const productQty = product.qty;

            updatedCart.totalPrice = cart.totalPrice - productPrice * productQty;
            updatedCart.products = cart.products.filter(product => product.id !== id)
            fs.writeFile(p, JSON.stringify(updatedCart), err =>{
                console.log(err);
            })
        })    
    }

    static getCart(cb){
        fs.readFile(p, (err, fileContent) =>{
            const cart = JSON.parse(fileContent);
            if(err){
                cb(null);
            } else{
                cb(cart);
            }
        })
    }
}