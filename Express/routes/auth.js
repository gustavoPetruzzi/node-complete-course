const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { check, body } = require('express-validator/check');
const User = require('../models/user');
router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.get('/reset', authController.getReset)

router.post('/reset', authController.postReset);

router.get('/reset/:resetToken', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

router.post(
    '/login',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .normalizeEmail(),
        check(
            'password',
            'Please enter only number and text and at least 5 characters'
        )
            .isLength({min:5})
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin)

router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, { req }) =>{
                return User.findOne({email: value})
                .then(userDoc =>{
                    if(userDoc){
                        return Promise.reject('E-mail exists already, please pick a different one.');
                    }
                });
            }),
        body(
            'password', 
            'Please enter only number and text and at least 5 characters'
        )
            .isLength({min: 5})
            .isAlphanumeric(),
        body('confirmPassword')
            .custom((value, {req}) =>{
                if(value !== req.body.password){
                    throw new Error('Password have to match');
                }
                return true;
            })
    ],
    authController.postSignup)

router.post('/logout', authController.postLogout);

module.exports = router;

