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

exports.postCart = (req, res, next) =>{
    const productId = req.body.productId;
    Product.findById(productId).then(product =>{
        return req.user.addToCart(product);
    })
    .then(result =>{
        res.redirect('/cart');
    })
}

exports.getCart = (req, res, next) =>{
    req.user.getCart()
    .then(products =>{
        res.render('shop/cart',{
            products: products,
            pageTitle:'Your cart',
            path:'/cart',
        });  
    })
}
exports.postCartDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    req.user
    .deleteItemFromCart(productId)
    .then(result =>{
        res.redirect('/cart');
    })
}

exports.getOrders = (req, res, next) => {
    req.user
    .getOrders()
    .then(orders =>{
        res.render('shop/orders',{
            pageTitle: 'Your orders',
            path:'/orders',
            orders: orders
        })
    })
    .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    console.log(req.user);
    req.user.addOrder()
    .then(() =>{
        res.redirect('/orders');
    })
    .catch(err =>{
        console.log(err);
    })
}