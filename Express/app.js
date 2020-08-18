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
const csrf = require('csurf');
const flash = require('connect-flash');


const app = express();
const store = new MongoDbStore({
    uri: 'mongodb+srv://yusti:y1161544761c@cluster0.ej3hr.mongodb.net/shop?retryWrites=true&w=majority',
    collection: 'sessions'
});
const csrfProtection = csrf();



app.set('view engine', 'ejs');
app.set('views, views');

app.use(bodyParse.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    } else{
        User.findById(req.session.user._id)
        .then(user =>{
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
    }
});

app.use((req, res, next) =>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

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
        app.listen(3000);
    })
    .catch(err =>console.log("mongo error", err));