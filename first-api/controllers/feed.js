const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const io = require('../socket');

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;
    try {
        const totalItems = await Post.find().countDocuments()
        const posts = await Post.find().populate('creator').sort({createAt: -1}).skip((currentPage - 1) * perPage).limit(perPage);
        res.status(200).json({
            posts: posts,
            message: 'Fetched posts successfully',
            totalItems: totalItems,
        })
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }

}

exports.createPost = async (req, res, next) =>{
    const title = req.body.title;
    const content = req.body.content;
    const errors = validationResult(req);
    let creator;

    if(!errors.isEmpty()){
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    if(!req.file){
        const error  = new Error('No image!')
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path.replace("\\" ,"/");
    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId,

    })
    try {
        await post.save()
        const user = await User.findById(req.userId)
        user.posts.push(post);
        user.posts.push(post);
        await user.save();
        io.getIO().emit('posts', {action: 'create', post: {...post._doc, creator: { _id: req.userId, name: user.name } } });

        res.status(201).json({
            message: 'post create',
            post: post,
            creator: {_id: user._id, name: user.name}
        })
    } catch (error) {
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.getPost = async (req, res, next) =>{
    const postId = req.params.postId;
    const post = await Post.findById(postId)
    try {
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Post Fetched',
            post: post
        });
     
    } catch (error) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err); 
    }



}

exports.editPost = async (req, res, next) =>{
    const postId = req.params.postId;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const error = new Error('Validation Failed, entered data is incorrect');
        error.statusCode = 422;
        throw error;
    }

    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;
    if(req.file){
        imageUrl = req.file.path.replace("\\" ,"/");
    }
    if(!imageUrl){
        const error = new Error('No image!');
        error.statusCode = 422;
        throw error;
    }
    try{
        const post = await Post.findById(postId).populated('creator')
        console.log(post);
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        if(post.creator._id.toString() !== req.userId){
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        await post.save();
        io.getIO().emit('posts', { action: 'update', post: result })
        res.status(200).json({
            message: 'Post updated!',
            post: result
        })
    } catch (error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.deletePost = async (req, res, next) =>{
    const postId = req.params.postId;
    let imageUrl = ''
 
    try{
        const post = await Post.findById(postId);
        if(!post){
            const error = new Error('Post not found');
            error.statusCode = 404;
            throw error;
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error('Not authorized');
            error.statusCode = 403;
            throw error;
        }
        imageUrl = post.imageUrl;
        await Post.findByIdAndRemove(postId);
        clearImage(imageUrl);
        const user = await  User.findById(req.userId);
        user.posts.pull(postId);
        await user.save();
        io.getIO().emit('posts',{action:'delete', postId: postId});
        res.status(200).json({
            message: 'Post removed'
        })
    } catch(error){
        if(!error.statusCode){
            error.statusCode = 500;
        }
        next(error);
    }
}

const clearImage = filePath => {
    filePath = path.join(__dirname, '../', filePath);
    fs.unlink(filePath, err => console.log(err));
}