const Product = require('../models/product');
const {validationResult} = require('express-validator/check');
const fileHelper = require('../util/file');

exports.getAddProduct = (req,res,next) =>{
    res.render('admin/add-product', {
        pageTitle:'Add product',
        path:'/admin/add-product',
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    if (!image) {
        return res.status(422).render('admin/edit-product',{
            pageTitle: 'Add Product',
            path:'/admin/edit-product',
            hasError: true,
            errorMessage: 'Attached file is not an image', 
            editing: false,
            prod: {
                title: title,
                price: price,
                description: description,
            }
        });
    }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).render('admin/edit-product',{
            pageTitle: 'Add Product',
            path:'/admin/edit-product',
            hasError: true,
            errorMessage: errors.array()[0].msg, 
            editing: false,
            prod: {
                title: title,
                price: price,
                description: description,
            }
        });
    } else {
        const imageUrl = image.path.replace('\\', '/');
        const product = new Product({
            title: title,
            price: price,
            imageUrl: imageUrl,
            description: description,
            userId: req.user
        });
        product.save()
        .then(result =>{
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    }

}

exports.getProducts = (req, res,next) =>{
    Product.find({userId: req.user._id})
    .then((products) => {
        res.render('admin/products',{
            prods: products,
            pageTitle: 'Admin Products',
            path:'/admin/products',
            hasProducts: products > 0,
            activeShop: true,
            productCss: true,
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getEditProduct = (req, res, next) =>{
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product =>{
            if(!product){
                res.redirect('/');
            }
            res.render('admin/edit-product',{
                prod:product,
                pageTitle: 'Edit Product',
                path:'/admin/edit-product',
                hasError: true,
                errorMessage: null,
                editing: true
            });
        })
        .catch(err =>{
            console.log(err);
            res.redirect('/');
        });
}
exports.postEditProduct = (req, res, next) =>{
    const productId = req.body.productId
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;

    Product.findById(productId)
        .then(product =>{
            if(product.userid.toString() !== req.user._id.toString()){
                return res.redirect('/');
            }
            product.title = title;
            if (image){
                const imageUrl = image.path.replace('\\', '/');
                fileHelper.deleteFile(product.imageUrl);
                product.imageUrl = imageUrl;

            }

            product.price = price;
            product.description = description;

            return product.save()
            .then(result =>{
                return res.redirect('/admin/products');
            })
        })

        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product =>{
        if(!product){
            next(new Error('Product not found'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
    .then(() =>{
        res.redirect('/admin/products');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

}

exports.deleteProduct = (req, res, next) =>{
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product =>{
        if(!product){
            next(new Error('Product not found'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(() =>{
        return res.status(200).json({
            message:'Success',
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            message:'Deleting product failed'
        })
    });
}