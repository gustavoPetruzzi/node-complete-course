const express = require('express');
const bodyParse = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const shopRoutes =require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorRoutes = require('./controllers/error');
const User = require('./models/user');
const mongoConnect = require('./util/database').mongoConnect;


const app = express();

app.set('view engine', 'ejs');
app.set('views, views');

app.use(bodyParse.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('5f2dc963a0e5236a6a06bf68')
    .then(user =>{
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin/',adminRoutes);
app.use(shopRoutes);

app.use(errorRoutes.getNotFound);

mongoose.connect('mongodb+srv://yusti:y1161544761c@cluster0.ej3hr.mongodb.net/shop?retryWrites=true&w=majority')
.then(() =>{
    app.connect(3000);
})
.catch(err =>console.log(err));