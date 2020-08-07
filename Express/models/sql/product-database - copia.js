// MODEL USED WITH DATABASE CONNECTION DIRECTLY


const path = require('path');
const ownPath = require('../util/path');
const p = path.join(ownPath, 'data', 'products.json');
const db = require('../util/database');
const Cart = require('./cart');

// const getProductsFromFile = cb =>{
//     fs.readFile(p, (err, fileContent)=>{
//         if(err){
//             cb([]);
//         } else{
//             cb(JSON.parse(fileContent));
//         }
        
//     });
// }


module.exports = class Product {
    constructor(id,title, imageUrl, description, price){
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    /**
     * Save product to Database
     * @return {Promise}
     */
    save(){

        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',[
            this.title,
            this.price,
            this.imageUrl,
            this.description
        ]);
        // getProductsFromFile(products =>{
        //     if(this.id){
        //         const existingProduct = products.findIndex(prod => prod.id === this.id);
        //         const updatedProducts = [...products];
        //         updatedProducts[existingProduct] = this;
        //         fs.writeFile(p, JSON.stringify(updatedProducts), err =>{
        //             if(err){
        //                 console.log(err);
        //             }
        //         })
        //     } else{
        //         this.id = Math.random().toString();
        //         products.push(this);
        //         fs.writeFile(p, JSON.stringify(products), err =>{
        //             if(err){
        //                 console.log(err);
        //             }
        //         });
        //     }
        // });
    }
    static deleteById(id){
        // getProductsFromFile(products =>{
        //     const product = products.find(product => product.id === id);
        //     const updatedProducts = products.filter(product => {
        //         return product.id !== id;
        //     });
        //     fs.writeFile(p, JSON.stringify(updatedProducts), err =>{
        //         if(err){
        //             console.log(err);
        //         } else{
        //             Cart.deleteProduct(product.id, product.price);
        //         }
        //     })
        // })
    }
    /**
     * Get all Products
     * @return {Promise}
     */
    static fetchAll(){
        // getProductsFromFile(cb);
        return db.execute("SELECT * FROM products")
    }

    /**
     * Get a product by id;
     * @param {number} id
     * @return {Promise} 
     */
    static findById(id){

        return db.execute('SELECT * FROM products WHERE id = ?', [id]);
        // getProductsFromFile(products =>{
        //     const product = products.find(p => p.id === id);
        //     cb(product);
        // })
    }
}