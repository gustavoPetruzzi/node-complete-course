const User = require('../models/user');
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup =  (req, res, next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validatio failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
    .then(hashedPassword =>{
        const user = new User({
            email: email,
            name: name,
            password: hashedPassword,
        });
        return user.save();
    })
    .then(result =>{
        res.status(201).json({
            message: 'User created!',
            userId: result._id
        })
    })
    .catch(err =>{
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })
    const user = new User({

    })

};

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    try{
        const user = await User.findOne({email: email})
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        loadedUser = user;
        const isEqual = await bcrypt.compare(password, user.password)
        if(!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            {
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
            },
            'secret',
            {expiresIn: '1h'}
        )
        res.status(200).json({
            token: token,
            userId: loadedUser._id.toString()
        });
    } catch (error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getStatus = async (req, res, next) =>{
    try{
        const user = await User.findById(req.userId)
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({
            message: 'Fetched status successfully',
            status: user.status
        })
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.setStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try {
        const user = await User.findById(req.userId)
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 401;
            throw error;
        }
        user.status = newStatus;
        console.log(user);
        const result = await user.save();
        res.status(200).json({
            message: 'Status updated successfully',
            status: result.status
        })
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}