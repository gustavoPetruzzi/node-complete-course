const express = require('express');
const authController = require('../controllers/auth');
const { body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

router.put(
    '/signup',
    [
        body('email')
            .isEmail() 
            .withMessage('Please enter a valid email')
            .custom((value, { req }) =>{
                return User.findOne( { email } )
                .then(userDoc =>{
                    if(userDoc){
                        return Promise.reject('email address already existed');
                    }
                })
                .catch(err => console.log(err));
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({min: 5}),
        body('name')
            .trim()
            .not()
            .isEmpty() 
    ],
    authController.signup
)
router.post('/login', authController.login)

module.exports = router;