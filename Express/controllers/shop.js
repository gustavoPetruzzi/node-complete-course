const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path  = require('path');
const pdfDocument = require('pdfkit');

exports.getProducts = (req,res, next) =>{
    Product.find()
    .then(products =>{
        res.render('shop/productList',{
            prods: products,
            pageTitle: 'Products',
            path:'/products',
            hasProducts: products >0,
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
        })  
    })
    .catch(err => console.log(err));
}

exports.postCart = (req, res, next) =>{
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product =>{
        return req.user.addToCart(product);
    })
    .then(result =>{
        res.redirect('/cart');
    })
}

exports.getCart = (req, res, next) =>{
    req.user
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
        'user.id': req.user._id
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
    req.user
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
                email: req.user.email,
                id: req.user
            },
            products: products
        });
        return order.save();
    })
    .then(() =>{
        req.user.clearCart()
        .then(()=>{
            res.redirect('/orders');

        })
    })
    .catch(err => console.log(err));
}

exports.getInvoice = (req, res, next) =>{
    const orderId = req.params.orderId;
    Order.findById(orderId)
    .then(order =>{
        if (!order){
            return next(new Error('No order found'));
        }
        if(order.user.id.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized'));
        }
        const invoiceName = 'invoice-' + orderId + '.pdf';
        const invoicePath = path.join('data','invoices',invoiceName);
        const pdfDoc = new pdfDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text('Invoice',{
            underline: true
        });

        pdfDoc.text('---------------------');
        order.products.forEach(prod =>{
            pdfDoc.text(`${prod.product.title} - ${prod.quantity}x `) ;

        })

        pdfDoc.end();
        // READ THE ENTIRE FILE (HUGE MEMORY USE IF FILE IS BIG)
        // fs.readFile(invoicePath, (err, data)=>{
        //     if(err){
        //         return next();
        //     }
        //     res.setHeader('Content-Type', 'application/pdf');
        //     res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
        //     res.send(data);
        // })

        // SEND CHUNKS OF DATA 
        // const file = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', 'inline; filename="invoice.pdf"');
        // file.pipe(res);
    })
    .catch(err =>{
        next(err);
    })

}