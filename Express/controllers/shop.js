const Product = require('../models/product');

exports.getProducts = (req,res, next) =>{
    Product.fetchAll()
    .then(products =>{
        res.render('shop/productList',{
            prods: products,
            pageTitle: 'Products',
            path:'/products',
            hasProducts: products >0,
            activeShop: true,
            productCss: true
        });      
    })
    .catch(err =>{
        console.log(err);
    })
}

exports.getProduct = (req, res, next) =>{
    const productId = req.params.productId;
    console.log("aca esta el id",productId);
    Product.findById(productId)
    .then(product =>{
        res.render('shop/product-detail',{
            prod: product,
            pageTitle: product.title,
            path:'/products'
        });
    })
    .catch(err =>console.log(err));
}

exports.getIndex = (req, res, next) =>{
    Product.fetchAll()
    .then((products) => {
        res.render('shop/index',{
            prods: products,
            pageTitle:'Shop',
            path:'/',
            activeShop: true,
            productCss: true
        })  
    })
    .catch(err => console.log(err));
}