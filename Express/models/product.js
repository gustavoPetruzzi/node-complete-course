const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongoDb.ObjectID(id) : null;
        this.userId = userId;
    }

    save(){
        const db = getDb();
        if(this._id){
            return db.collection('products')
            .updateOne({_id: this._id }, {
                $set: this
            });
        } else{
            console.log('entras aca por lo menos?')
            return db.collection('products').insertOne(this); 
        }
    }

    static fetchAll(){
        const db = getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then(product => {
            return product;
        })
        .catch(err => console.log(err));
    }

    static findById(id){
        const db = getDb();
        return db.collection('products')
        .find({_id: new mongoDb.ObjectId(id) })
        .next()
        .then(product =>{
            return product;
        })
        .catch(err => console.log(err))
    }

    static deleteById(prodId){
        const db = getDb();
        return db.collection('products')
        .deleteOne({_id: new mongoDb.ObjectId(prodId) })
        .then(()=>{
            console.log('Product deleted');
        })
        .catch(err => console.log(err));
    }

}

module.exports = Product