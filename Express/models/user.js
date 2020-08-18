const mongoose = require('mongoose');
const { update } = require('./product');

const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    resetToken:{
        type:String
    },
    resetTokenExpiration:{
        type: Date
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product){
    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;

    if(cartProductIndex >=0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id, 
            quantity: newQuantity
        });
    }
    const updatedCart = {items: updatedCartItems};
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function(productId){
    
    const updatedCartItems = this.cart.items.filter(item =>{
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = { items: [] };
    return this.save();
}


module.exports = mongoose.model('User', userSchema);


// MONGODB; NOT MONGOOSE
// const mongoDb = require('mongodb');
// const { get } = require('../routes/shop');
// const getDb = require('../util/database').getDb;
// class User{
//     constructor(username, email, cart, id){
//         this.username = username;
//         this.email = email;
//         this._id = id ? new mongoDb.ObjectID(id) : null;
//         this.cart = cart; // {items: []}
//     }

//     save(){
//         const db = getDb();
//         if(this._id){
//             return db.collection('users')
//             .updateOne({_id: this._id},{
//                 $set: this
//             });
//         } else {
//             return db.collection('users').insertOne(this);
//         }
//     }

//     addToCart(product){
//         const db = getDb();
//         const updatedCartItems = [...this.cart.items];
//         const cartProductIndex = this.cart.items.findIndex(item => {
//             return item.productId.toString() === product._id.toString();
//         });
//         let newQuantity = 1;

//         if(cartProductIndex >=0){
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({productId: new mongoDb.ObjectId(product._id), quantity: newQuantity});
//         }
//         const updatedCart = {items: updatedCartItems};

//         return db.collection('users').updateOne(
//             { _id: new mongoDb.ObjectId(this._id) },
//             { $set: {cart: updatedCart}}    
//         ); 
//     }

//     getCart(){
//         const db = getDb();
//         const productsIds = this.cart.items.map(item => {
//             return item.productId;
//         })
//         return db
//         .collection('products')
//         .find({_id: {$in: productsIds}})
//         .toArray()
//         .then(products =>{
//             return products.map(product =>{
//                 const quantity = this.cart.items.find(item =>{
//                     return item.productId.toString() === product._id.toString();
//                 }).quantity
//                 return {...product, quantity: quantity};
//             })
//         })
//     }

//     deleteItemFromCart(id){
//         const db = getDb();
//         const updatedCartItems = this.cart.items.filter(item =>{
//             return item.productId.toString() !== id.toString();
//         });
//         return db
//         .collection('users')
//         .updateOne(
//             {_id: new mongoDb.ObjectId(this._id)},
//             {$set: {cart: {items: updatedCartItems}}}
//         )
//         .then(result =>{
//             console.log(result);
//         })

//     }

//     addOrder(){
//         const db = getDb();
//         return this.getCart()
//         .then(products =>{
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongoDb.ObjectId(this._id),
//                     name: this.name,
//                     email: this.email,
//                 }
//             }
//             return db.collection('orders')
//             .insertOne(order)
//             .then(() =>{
//                 return db.collection('users')
//                 .updateOne(
//                     {_id: new mongoDb.ObjectId(this._id)},
//                     {$set: {cart: { items: [] } } }
//                 )
//             })          
//         });
//     }

//     getOrders(){
//         const db = getDb();

//         return db.collection('orders')
//         .find({'user._id': new mongoDb.ObjectId(this._id)})
//         .toArray();
//     }
    
//     static findById(id){
//         const db = getDb();
//         return db.collection('users')
//         .findOne({_id: new mongoDb.ObjectId(id) });
//     }
// }

//module.exports = User;