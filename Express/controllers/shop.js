const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = async (req, res,next) =>{
    // Find all products using async await

    try {
        const products = await Product.findAll();
        res.render('shop/productList',{
            prods: products,
            pageTitle: 'Products',
            path:'/products',
            hasProducts: products >0,
            activeShop: true,
            productCss: true
        });      
    } catch (error) {
        console.log(error);
    }
    
    
    // Find all products using then
    // Product.findAll()
    // .then(products =>{
    //     res.render('shop/productList',{
    //         prods: products,
    //         pageTitle: 'Products',
    //         path:'/products',
    //         hasProducts: products >0,
    //         activeShop: true,
    //         productCss: true
    //     });       
    // })
    // .catch(err => console.log(err))
    const products = await Product.findAll();
    console.log(products);
    // Product.fetchAll()
    // .then(([rows, fieldData]) =>{
    //     res.render('shop/productList',{
    //         prods: rows,
    //         pageTitle: 'Products',
    //         path:'/products',
    //         hasProducts: rows >0,
    //         activeShop: true,
    //         productCss: true
    //     });
    // });

    // Tarda en leer los productos, asi que le paso la funcion para que cuando los lea, ejecute esa funcion
    // Product.fetchAll((products) =>{
    //     res.render('shop/productList',{
    //         prods:products,
    //         pageTitle:'Products',
    //         path:'/products',
    //         hasProducts: products >0,
    //         activeShop: true,
    //         productCss: true
    //     });
    // });
}

exports.getProduct = async (req, res, next) =>{
    const productId = req.params.productId;
    console.log(productId);
    try {
        const product = await Product.findAll({where: { id : productId } });
        console.log(product);
        res.render('shop/product-detail',{
            prod: product[0],
            pageTitle: product[0].title,
            path:'/products'
        });        
    } catch (error) {
        console.log("console.log", error);
    }

    // const productId = req.params.productId;
    // Product.findById(productId)
    // .then(([product]) => {
    //     res.render('shop/product-detail',{
    //         prod: product[0],
    //         pageTitle: product[0].title,
    //         path:'/products'
    //     });        
    // })
    // .catch(err => console.log(err));


    // Product.findById(productId, (product)=>{
    //     res.render('shop/product-detail',{
    //         prod: product,
    //         pageTitle: product.title,
    //         path:'/products'
    //     })
    // })
}

exports.getCart = (req, res, next) =>{
    Cart.getCart( cart =>{
        Product.fetchAll(products =>{
            const cartProducts = [];
            for (product of products){
                const cartProduct = cart.products.find(prod => prod.id === product.id);
                if(cartProduct){
                    cartProducts.push({productData: product, qty: cartProduct.qty});
                }
            }

            res.render('shop/cart',{
                products: cartProducts,
                pageTitle:'Your cart',
                path:'/cart',
                activeShop:true,
                productCSS:true
            });
        });
    });

}
exports.postCart = (req, res, next) =>{
    const productId = req.body.productId;
    Product.findById(productId, (product) =>{
        Cart.addProduct(productId, product.price);
        res.redirect('/');
    })
}

exports.postCartDeleteProduct = (req, res, next) =>{
    const productId = req.body.productId;
    Product.findById(productId, product =>{
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    })
}

exports.getOrders = (req,res, next) =>{
    res.render('shop/orders',{
        pageTitle: 'Your orders',
        path:'/orders',
    })
}
exports.getIndex = (req, res, next) =>{
    Product.findAll()
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

    // Product.fetchAll((products) =>
    //     res.render('shop/index',{
    //         prods: products,
    //         pageTitle:'Shop',
    //         path:'/',
    //         activeShop: true,
    //         productCss: true
    //     })
    // );
}

exports.getCheckout = (req,res, next) =>{
    res.render('shop/checkout',{
        pageTitle:'Checkout',
        path:'/checkout',
        activeShop: true,
        productCSS: true
    })
}