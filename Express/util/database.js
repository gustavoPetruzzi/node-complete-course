//const { get } = require('../routes/shop');

const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://yusti:y1161544761c@cluster0.ej3hr.mongodb.net/shop?retryWrites=true&w=majority';
const client = new MongoClient(uri,{ useNewUrlParser: true });

let _db;
const mongoConnect = (callback) => {

    client.connect()
    .then((client) => {
        console.log('connected');
        _db = client.db();
        callback();
    })
    .catch(err => console.log(err));
}

const getDb = () =>{
    if(_db){
        return _db;
    } else {
        throw 'No database found';
    }
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


// CONNECT TO SQL
// const Sequelize = require('sequelize/index');

// const sequelize = new Sequelize('node-complete', 'root', '1161544761',{
//     dialect: 'mysql',
//     host:'localhost'
// });

// module.exports = sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'1161544761'
// });

// module.exports = pool.promise();