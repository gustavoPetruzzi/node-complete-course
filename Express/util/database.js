const Sequelize = require('sequelize/index');

const sequelize = new Sequelize('node-complete', 'root', '1161544761',{
    dialect: 'mysql',
    host:'localhost'
});

module.exports = sequelize;

// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host:'localhost',
//     user:'root',
//     database:'node-complete',
//     password:'1161544761'
// });

// module.exports = pool.promise();