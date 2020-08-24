const express = require('express');
const bodyParse = require('body-parser');
const multer = require('multer');
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

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) =>{
        cb(null, new Date().getTime().toString() + '-' + file.originalname)
    }
});

const fileFilter = (req,file, cb) =>{
    if(
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }

}

app.set('view engine', 'ejs');
app.set('views, views');

app.use(bodyParse.urlencoded({extended: false}));
app.use(multer( {storage: fileStorage, fileFilter: fileFilter} ).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
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
            if(!user){
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err));
        });
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
app.use(errorRoutes.get500);

app.use((error, req, res, next)=> {
    console.log(error);
    res.redirect('/500');
})
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