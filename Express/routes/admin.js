const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const { check }  = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

router.get('/add-product', isAuth,  adminController.getAddProduct);

router.post(
    '/add-product',
    isAuth,
    [
        check('title')
            .isString()
            .isLength({ min: 3})
            .trim(),
        check('price')
            .isFloat(),
        check('description')
            .isLength({ min: 5, max: 200})
            .trim()
    ],
    adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product',
    isAuth,
    [
        check('title')
            .isString()
            .isLength({ min: 3})
            .trim(),
        check('price')
            .isFloat(),
        check('description')
            .isLength({ min: 5, max: 200})
            .trim()
    ],
    adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;