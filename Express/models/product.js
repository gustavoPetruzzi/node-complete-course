const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(title, price, description, imageUrl, id){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongoDb.ObjectID(id) : null;
    }

    save(){
        const db = getDb();
        if(this._id){
            console.log('sfniosdfniosdf');
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
            console.log(product);
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
            console.log(product);
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