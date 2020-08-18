const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: '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'
    }
}))

exports.getLogin = (req, res, next) => {
    const  message = req.flash('error');

    res.render('auth/login',{
        pageTitle: 'Login',
        path:'/login',
        errorMessage: message.length > 0 ? message[0] : null,
        oldInput:{
            email: '',
            password: '',
        },
        validationErrors: []
    });
}

exports.getSignup = (req, res, next) => {
    const  message = req.flash('error');
    console.log(message);
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message.length > 0 ? message[0] : null,
        oldInput:{
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/login', {
            path: '/Login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password',
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array(),
        })
    }
    User.findOne({
        email: email
    })
    .then(user =>{
        if(!user){ 
            req.flash('error', 'Invalid email or password');

            return req.session.save((err) =>{
                return res.status(422).render('auth/login', {
                    path: '/Login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                })
            });
        }
        bcrypt.compare(password, user.password)
        .then(doMatch =>{
            if (doMatch) {
                req.session.user = user;
                req.session.isLoggedIn = true;
                return req.session.save((err) =>{
                    
                    res.redirect('/');
                });
            }
            return req.session.save((err) =>{
                return res.status(422).render('auth/login', {
                    path: '/Login',
                    pageTitle: 'Login',
                    errorMessage: 'Invalid email or password',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: []
                })
            });

        })
        .catch(err =>{
            console.log(err);
            res.redirect('/')
        })

    })
    .catch(err => console.log(err));
}

exports.postSignup = (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput:{ email: email, password: password, confirmPassword: req.body.confirmPassword },
            validationErrors: errors.array()
        });
    }
    
    User.findOne({email: email})
    .then(userDoc =>{
        if(userDoc){
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword =>{
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {
                    items: []
                }
            })
            return user.save();
        })
        .then(() =>{
            res.redirect('/login')
            return transporter.sendMail({
                to: email,
                from:'yusti.3o5@hotmail.com',
                subject: 'Sign up succeeded!',
                html:'YOU SIGN UP!'
            })
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    })
    .catch(err =>{ console.log(err)})
}

exports.postLogout = (req, res, next) =>{
    req.session.destroy((err) =>{
        console.log(err);
        res.redirect('/')
    });
}

exports.getReset = (req, res, next) =>{
    const  message = req.flash('error');

    res.render('auth/reset',{
        pageTitle: 'Reset Password',
        path:'/reset',
        errorMessage: message.length > 0 ? message[0] : null
    });
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            console.log(err);
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
        .then(user =>{
            if(!user){
                req.flash('error', 'No account found');
                res.redirect('/reset');
            } else {
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            }
        })
        .then(result =>{
            res.redirect('/login');
            return transporter.sendMail({
                to: req.body.email,
                from:'yusti.3o5@hotmail.com',
                subject: 'Password Reset',
                html: `
                    <p> You requested a password reset </p>
                    <p> Click this <a href="http://localhost:3000/reset/${token}"> link </a>to set a new password.</p>
                `
            })
        })
        .catch(err => console.log(err))
    })
}

exports.getNewPassword = (req, res, next) =>{
    const message = req.flash('error');
    const token = req.params.resetToken;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then(user =>{
        res.render('auth/new-password',{
            pageTitle: 'Update Password',
            path:'/new-password',
            errorMessage: message.length > 0 ? message[0] : null,
            userId: user._id.toString(),
            passwordToken: token
        });
    })
    .catch(err => console.log(err));

}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}})
    .then(user =>{
        if(!user) {
            res.redirect('/');
        }
        console.log(newPassword);
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword =>{
        console.log(hashedPassword);
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result =>{
        res.redirect('/login');
    })
    .catch(err => console.log(err))

}