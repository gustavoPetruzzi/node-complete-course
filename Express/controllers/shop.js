const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req,res, next) =>{
    Product.find()
    .then(products =>{
        res.render('shop/productList',{
            prods: products,
            pageTitle: 'Products',
            path:'/products',
            hasProducts: products >0,
            activeShop: true,
            productCss: true,
            isAuthenticated: req.session.isLoggedIn
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
            path:'/products',
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err =>console.log(err));
}

exports.getIndex = (req, res, next) =>{
    Product.find()
    .then((products) => {
        res.render('shop/index',{
            prods: products,
            pageTitle:'Shop',
            path:'/',
            activeShop: true,
            productCss: true,
            isAuthenticated: req.session.isLoggedIn
        })  
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res, next) =>{
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product =>{
        return req.session.user.addToCart(product);
    })
    .then(result =>{
        res.redirect('/cart');
    })
}

exports.getCart = (req, res, next) =>{
    req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        const products = user.cart.items;
        res.render('shop/cart',{
            products: products,
            pageTitle:'Your cart',
            path:'/cart',
            isAuthenticated: req.session.isLoggedIn
        });  
    })
}
exports.postCartDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    req.session.user
    .removeFromCart(productId)
    .then(result =>{
        res.redirect('/cart');
    })
}

exports.getOrders = (req, res, next) => {
    Order.find({
        'user.userId': req.user._id
    })
    .then(orders =>{
        res.render('shop/orders',{
            pageTitle: 'Your orders',
            path:'/orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
    // req.user
    // .getOrders()
    // .then(orders =>{
    //     res.render('shop/orders',{
    //         pageTitle: 'Your orders',
    //         path:'/orders',
    //         orders: orders
    //     })
    // })
    // .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.session.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user =>{
        const products = user.cart.items.map(product =>{
            return {
                quantity: product.quantity,
                product: { ...product.productId._doc }
            }
        });
        const order = new Order({
            user:{
                name: req.session.user.name,
                id: req.session.user
            },
            products: products
        });
        return order.save();
    })
    .then(() =>{
        req.session.user.clearCart()
        .then(()=>{
            res.redirect('/orders');

        })
    })
    .catch(err => console.log(err));
}



    // console.log(req.user);
    // req.user.addOrder()
    // .then(() =>{
    //     res.redirect('/orders');
    // })
    // .catch(err =>{
    //     console.log(err);
    // })
// }