
const User = require('../models/user');
exports.getLogin = (req, res, next) => {
    res.render('auth/login',{
        pageTitle: 'Login',
        path:'/login',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {

    User.findById('5f3605694810097964182962')
    .then(user =>{
        req.session.user;
        req.session.isLoggedIn = true;
        res.redirect('/');
    })
    .catch(err => console.log(err));

}