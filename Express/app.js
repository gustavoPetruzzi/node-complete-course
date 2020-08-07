const express = require('express');
const bodyParse = require('body-parser');
const path = require('path');
const shopRoutes =require('./routes/shop');
const adminRoutes = require('./routes/admin');
const errorRoutes = require('./controllers/error');
const { Console } = require('console');
const mongoConnect = require('./util/database').mongoConnect;


const app = express();

app.set('view engine', 'ejs');
app.set('views, views');

app.use(bodyParse.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // User.findByPk(1)
    // .then(user =>{
    //     if(user){
    //         req.user = user;
    //         next();
    //     }
    // })
    // .catch(err => console.log(err));
    next();
});

app.use('/admin/',adminRoutes);
app.use(shopRoutes);

app.use(errorRoutes.getNotFound);

mongoConnect(() =>{
    app.listen(3000, () =>{
        console.log('connected on port 3000');
    });
});
