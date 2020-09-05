const express = require('express');
const authController = require('../controllers/auth');
const { body } = require('express-validator');
const User = require('../models/user');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.put(
    '/signup',
    [
        body('email')
            .isEmail() 
            .withMessage('Please enter a valid email')
            .custom((value, { req }) =>{
                return User.findOne( { value } )
                .then(userDoc =>{
                    if(userDoc){
                        return Promise.reject('email address already existed');
                    }
                })
                .catch(err => {
                    if(!error.statusCode){
                        error.statusCode = 500;
                    }
                    next(error);
                });
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

router.get('/status', isAuth, authController.getStatus);
router.put('/status', isAuth, authController.setStatus);
module.exports = router;