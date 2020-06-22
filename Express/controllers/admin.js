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
    req.user.createProduct({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user.id
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err))

    // const newProduct = new Product(null, title, imageUrl, description, price);
    // newProduct.save()
    // .then( () => res.redirect('/'))
    // .catch(res =>{
    //     console.log(res);
    //     res.redirect('/');
    // })
}

exports.getProducts = (req, res,next) =>{
    req.user.getProducts()
    .then(products =>{
        res.render('admin/products',{
            prods: products,
            pageTitle: 'Admin Products',
            path:'/admin/products',
            hasProducts: products > 0,
            activeShop: true,
            productCss: true
        });       
    })
    .catch(err => console.log(err))


    // Product.fetchAll()
    // .then(([rows, fieldData]) =>{
    //     res.render('admin/products',{
    //         prods: rows,
    //         pageTitle: 'Admin Products',
    //         path:'/admin/products',
    //         hasProducts: rows > 0,
    //         activeShop: true,
    //         productCss: true
    //     });
    // })
    // .catch(res =>{
    //     console.log(res);
    //     res.redirect('/');
    // })
    // // Tarda en leer los productos, asi que le paso la funcion para que cuando los lea, ejecute esa funcion
    // Product.fetchAll((products) =>{
    //     res.render('admin/products',{
    //         prods:products,
    //         pageTitle:'Admin products',
    //         path:'/admin/products',
    //         hasProducts: products >0,
    //         activeShop: true,
    //         productCss: true
    //     });
    // });
}

exports.getEditProduct = (req, res, next) =>{
    const productId = req.params.productId;
    // get only product for the user who is requesting it
    // req.user.getProducts({where: {id: productId}});
    Product.findByPk(productId)
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
        })
    // Product.findById(productId)
    // .then(data =>{
    //     console.log(data);
    //     res.redirect('/');
    // })
    // .catch(err =>{
    //     console.log(err);
    //     res.redirect('/');
    //})

    // Product.findById(productId, product =>{
    //     if(!product){
    //         return res.redirect('/');
    //     } else {
    //         res.render('admin/edit-product',{
    //             prod:product,
    //             pageTitle: 'Edit Product',
    //             path:'/admin/edit-product'
    //         })
    //     }
    // })
}
exports.postEditProduct = (req, res, next) =>{
    const productId = req.body.productId
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    
    Product.findByPk(productId)
    .then(product =>{
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;
        return product.save();    
    })
    .then(result =>{
        console.log(result);
        return res.redirect('/admin/products');
    })
    .catch(() =>{
        console.log(err);
    })

}

exports.postDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;

    //Product.destroy({where})
    Product.findByPk(productId)
    .then(product =>{
        return product.destroy();
    })
    .then(result =>{
        console.log(result);
        res.redirect('/admin/products');
    })
    .catch(err =>{
        console.log(err);
    })

}