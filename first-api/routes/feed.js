const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');
const isAuth = require('../middleware/is-auth');
const feedController = require('../controllers/feed');

router.get('/posts', isAuth,  feedController.getPosts);

router.post(
    '/posts', 
    isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5}),
    ],
    feedController.createPost
);

router.get('/post/:postId', isAuth, feedController.getPost);

router.put(
    '/post/:postId',
    isAuth,
    [
        body('title').trim().isLength({min: 5}),
        body('content').trim().isLength({min: 5})
    ],
     feedController.editPost);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;