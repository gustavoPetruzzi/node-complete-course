const express = require('express');
const bodyParse = require('body-parser');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views, views');
const shopRoutes =require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorRoutes = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

// app.use((req, res, next) =>{
//     console.log('In the middleware');
//     next(); // TE DEJA PASAR AL PROXIMO MIDDLEWARE
// });

// app.use((req, res, next) =>{
//     console.log('Another the middleware');
// });


app.use(bodyParse.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
    .then(user =>{
        if(user){
            req.user = user;
            next();
        }
    })
    .catch(err => console.log(err));
});

app.use('/admin/',adminRoutes);
app.use(shopRoutes);

app.use(errorRoutes.getNotFound);


Product.belongsTo(User,{constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//Force true --> overrides tables (not used in production)
sequelize.sync({force: true})
// sequelize.sync()
.then(result =>{
    return user.findByPk(1);
})
.then(user =>{
    if(!user){
        return User.create({
            name: 'yusti',
            email:'yusti.3o5@hotmail.com'
        })
    }
    return Promise.resolve(user);
})
.then(user =>{
    app.listen(3000);
})
.catch(err => console.log(err));
