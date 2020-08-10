const Product = require('../models/product');

exports.getAddProduct = (req,res,next) =>{
    res.render('admin/add-product', {
        pageTitle:'Add product',
        path:'/admin/add-product',
    });
}

exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const userId = req.user._id;
    const product = new Product(title, price, description, imageUrl, null, userId);
    product.save()
    .then(result =>{
        res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
}

exports.getProducts = (req, res,next) =>{
    Product.fetchAll()
    .then((products) => {
        res.render('admin/products',{
            prods: products,
            pageTitle: 'Admin Products',
            path:'/admin/products',
            hasProducts: products > 0,
            activeShop: true,
            productCss: true
        })
    })
    .catch(err => console.log(err));
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
                path:'/admin/edit-product'
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
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    Product.findById(productId)
    .then(productData =>{
        const editedProduct = new Product(title, price, description, imageUrl, productId); 
        editedProduct.save()
        .then(result =>{
            console.log(result);
            return res.redirect('/admin/products');
        })
    })
    .catch((err) =>{
        console.log(err);
    })

}

exports.postDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    console.log(productId);
    Product.deleteById(productId)
    .then(() =>{
        res.redirect('/admin/products');
    })
    .catch(err =>{
        console.log(err);
    })

}