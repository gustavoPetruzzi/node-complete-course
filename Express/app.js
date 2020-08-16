const express = require('express');
const bodyParse = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const shopRoutes =require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorRoutes = require('./controllers/error');
const authRoutes = require('./routes/auth');
const User = require('./models/user');
const session = require('express-session');
//const mongoConnect = require('./util/database').mongoConnect;
const MongoDbStore = require('connect-mongodb-session')(session);


const app = express();
const store = new MongoDbStore({
    uri: 'mongodb+srv://yusti:y1161544761c@cluster0.ej3hr.mongodb.net/shop?retryWrites=true&w=majority',
    collection: 'sessions'
});
app.set('view engine', 'ejs');
app.set('views, views');

app.use(bodyParse.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

// app.use((req, res, next) => {
//     User.findById('5f3605694810097964182962')
//     .then(user =>{
//         req.user = user;
//         next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin/',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorRoutes.getNotFound);

mongoose
    .connect(
        'mongodb+srv://yusti:y1161544761c@cluster0.ej3hr.mongodb.net/shop?retryWrites=true&w=majority',
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        }
    )
    .then(() =>{
        User.findOne()
        .then(user =>{
            if(!user){
                const user = new User({
                    name: 'Yusti',
                    email: 'yusti@gmail.com',
                    cart:{
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err =>console.log("mongo error", err));